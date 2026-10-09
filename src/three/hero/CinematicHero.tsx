import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import {
  Color,
  MathUtils,
  type DirectionalLight,
  type MeshBasicMaterial,
} from "three";
import type { SceneProps } from "../SceneHost";
import { useGuardianModel } from "./GuardianModel";
import HeroEnvironment from "./HeroEnvironment";
import HeroBinary from "./HeroBinary";

const smooth = (time: number, start: number, length: number) => {
  const x = MathUtils.clamp((time - start) / length, 0, 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
};
const baseLights = {
  "Coolant light": new Color("#4facc5"),
  "Data indicator": new Color("#42764f"),
  "Amber practical": new Color("#927140"),
};

export default function CinematicHero({
  mobile,
  reduced,
  visible,
  selected,
}: SceneProps) {
  const { asset, error } = useGuardianModel();
  const { camera, size, invalidate, pointer, setDpr, viewport } = useThree();
  const keyLight = useRef<DirectionalLight>(null),
    rimLight = useRef<DirectionalLight>(null);
  const time = useRef(0),
    slow = useRef(0);
  useEffect(() => {
    // Tight, lower mobile view; desktop shows the entire infrastructure chassis.
    const aspect = size.width / Math.max(1, size.height);
    const distance = mobile ? 5.2 : Math.max(9.2, 5.4 / aspect);
    camera.position.set(mobile ? 2.2 : 4.5, mobile ? 1.3 : 2.8, distance);
    camera.lookAt(0, mobile ? 0.4 : 0, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size.width, size.height, mobile, invalidate]);
  useEffect(() => {
    time.current = reduced ? 3 : 0;
    invalidate();
  }, [asset, reduced, invalidate]);
  useEffect(() => {
    if (visible) invalidate();
  }, [visible, selected, invalidate]);
  useEffect(() => {
    if (mobile || reduced) return;
    const move = (event: PointerEvent) => {
      pointer.set(
        MathUtils.clamp((event.clientX / innerWidth) * 2 - 1, -1, 1),
        MathUtils.clamp(1 - (event.clientY / innerHeight) * 2, -1, 1),
      );
      invalidate();
    };
    document.addEventListener("pointermove", move, { passive: true });
    return () => document.removeEventListener("pointermove", move);
  }, [mobile, reduced, pointer, invalidate]);
  useFrame((_, delta) => {
    if (!visible || document.hidden) return;
    const dt = Math.min(delta, 0.05);
    if (!reduced) time.current += Math.min(delta, 0.25);
    if (
      delta > 1 / 35 &&
      delta < 0.15 &&
      viewport.dpr > 1 &&
      ++slow.current > 20
    )
      setDpr(1);
    if (asset) {
      const t = time.current;
      if (keyLight.current)
        keyLight.current.intensity = 0.35 + 2.05 * smooth(t, 0.15, 1.25);
      if (rimLight.current)
        rimLight.current.intensity = 0.5 + 2.2 * smooth(t, 0.25, 1.1);
      for (const name of ["left_sled", "right_sled"]) {
        const part = asset.parts.get(name)!;
        const side = name === "left_sled" ? -1 : 1;
        const p = smooth(t, name === "left_sled" ? 0.35 : 0.55, 0.85);
        part.position.x = side * (1.1 + (1 - p) * 0.45);
        part.position.z = (1 - p) * -0.5;
        part.rotation.y = side * (1 - p) * -0.22;
        part.rotation.z = side * (1 - p) * 0.12;
      }
      const top = asset.parts.get("top_armor")!,
        lower = asset.parts.get("lower_armor")!;
      const a = smooth(t, 0.8, 0.7),
        b = smooth(t, 1.05, 0.65);
      top.position.y = 1.3 + (1 - a) * 0.24;
      top.rotation.x = (1 - a) * -0.28;
      lower.position.y = -1.1 - (1 - b) * 0.18;
      lower.rotation.x = (1 - b) * 0.18;
      asset.lights.forEach((material, name) => {
        const factor =
          name === "Coolant light"
            ? 0.13 + 0.87 * smooth(t, 1.2, 0.75)
            : 0.25 + 0.75 * smooth(t, 0.15, 0.8);
        (material as MeshBasicMaterial).color
          .copy(baseLights[name as keyof typeof baseLights])
          .multiplyScalar(factor);
      });
    }
    if (!reduced) {
      const aspect = size.width / Math.max(1, size.height);
      const distance = mobile ? 5.2 : Math.max(9.2, 5.4 / aspect);
      camera.position.set(
        MathUtils.damp(
          camera.position.x,
          (mobile ? 2.2 : 4.5) + (!mobile ? pointer.x * 0.16 : 0),
          4,
          dt,
        ),
        MathUtils.damp(
          camera.position.y,
          (mobile ? 1.3 : 2.8) + (!mobile ? pointer.y * 0.08 : 0),
          4,
          dt,
        ),
        distance,
      );
      camera.lookAt(0, mobile ? 0.4 : 0, 0);
      invalidate();
    }
  });
  if (error) throw new Error("Hero model unavailable");
  return (
    <>
      <color attach="background" args={["#03090c"]} />
      <fog attach="fog" args={["#03090c", 11, 24]} />
      <ambientLight intensity={0.27} color="#7b8d96" />
      <directionalLight
        ref={keyLight}
        position={[2, 6, 5]}
        intensity={2.4}
        color="#a5c4d2"
      />
      <directionalLight
        ref={rimLight}
        position={[-4, 2, -3]}
        intensity={2.7}
        color="#26728d"
      />
      <pointLight
        position={[2, -0.4, 2]}
        intensity={5}
        distance={6}
        decay={2}
        color="#469272"
      />
      <pointLight
        position={[-2, 1.2, 0]}
        intensity={2}
        distance={4}
        decay={2}
        color="#b5894c"
      />
      <HeroEnvironment mobile={mobile} />
      <HeroBinary mobile={mobile} reduced={reduced} visible={visible} />
      {asset && <primitive object={asset.scene} dispose={null} />}
      {asset && (
        <group>
          {mobile ? (
            <Html
              fullscreen
              position={[0, 0.4, 0]}
              style={{ pointerEvents: "none" }}
            >
              <span className="guardian-hud scene-readout guardian-mobile-hud">
                SYSTEM ONLINE
              </span>
            </Html>
          ) : (
            <Html
              center
              position={[0.1, 2.5, 0.1]}
              style={{ pointerEvents: "none" }}
            >
              <span className="guardian-hud scene-readout">SYSTEM ONLINE</span>
            </Html>
          )}
          {!mobile && (
            <Html
              center
              position={[-2.05, -1.28, 0.15]}
              style={{ pointerEvents: "none" }}
            >
              <span className="guardian-hud scene-readout">
                AWS / CLOUD SYSTEMS
              </span>
            </Html>
          )}
        </group>
      )}
    </>
  );
}
