import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { guardianPivots } from "./guardianTimeline";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  type Material,
} from "three";

export interface GuardianAsset {
  scene: Group;
  parts: Map<string, Group>;
  lights: Map<string, Material>;
}

function release(asset: GuardianAsset) {
  const geometries = new Set<Mesh["geometry"]>();
  const materials = new Set<Material>();
  asset.scene.traverse((object) => {
    if (object instanceof Mesh) {
      geometries.add(object.geometry);
      for (const material of Array.isArray(object.material)
        ? object.material
        : [object.material])
        materials.add(material);
    }
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
}

// No global useGLTF cache: each experience owns and releases its model resources.
export function useGuardianModel() {
  const [asset, setAsset] = useState<GuardianAsset | null>(null);
  const [error, setError] = useState(false);
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const abort = new AbortController();
    let owned: GuardianAsset | null = null;
    let cancelled = false;
    fetch("/models/cloud-infrastructure-guardian.glb", { signal: abort.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Model unavailable");
        return response.arrayBuffer();
      })
      .then(
        (buffer) =>
          new Promise<Group>((resolve, reject) => {
            new GLTFLoader().parse(
              buffer,
              "",
              (gltf) => resolve(gltf.scene),
              reject,
            );
          }),
      )
      .then((scene) => {
        const converted = new Map<Material, Material>();
        const lights = new Map<string, Material>();
        scene.traverse((object) => {
          if (!(object instanceof Mesh)) return;
          const source = object.material as Material & { color: Color };
          if (!converted.has(source)) {
            const luminous = /light|indicator|practical/i.test(source.name);
            const material = luminous
              ? new MeshBasicMaterial({
                  color:
                    source.name === "Coolant light"
                      ? "#4facc5"
                      : source.name === "Data indicator"
                        ? "#42764f"
                        : "#927140",
                })
              : new MeshPhongMaterial({
                  color: source.color
                    .clone()
                    .multiplyScalar(
                      source.name === "Brushed steel"
                        ? 0.82
                        : source.name === "Recess"
                          ? 0.5
                          : 0.62,
                    ),
                  specular: new Color(
                    source.name === "Brushed steel" ? "#657782" : "#26363d",
                  ),
                  shininess: source.name === "Brushed steel" ? 28 : 12,
                });
            material.name = source.name;
            converted.set(source, material);
            if (luminous) lights.set(source.name, material);
          }
          object.material = converted.get(source)!;
        });
        converted.forEach((_, source) => source.dispose());
        const parts = new Map<string, Group>();
        for (const name of Object.keys(guardianPivots)) {
          const part = scene.getObjectByName(name);
          if (part) {
            const pivot = new Group();
            pivot.name = `${name}_hinge`;
            const origin = guardianPivots[name];
            pivot.position.set(origin[0], origin[1], origin[2]);
            part.position.set(-origin[0], -origin[1], -origin[2]);
            scene.add(pivot);
            pivot.add(part);
            parts.set(name, pivot);
          }
        }
        owned = { scene, parts, lights };
        if (cancelled) release(owned);
        else {
          setAsset(owned);
          invalidate();
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
      abort.abort();
      if (owned) release(owned);
    };
  }, [invalidate]);
  return { asset, error };
}
