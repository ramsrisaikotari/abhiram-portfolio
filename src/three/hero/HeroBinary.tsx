import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CanvasTexture, InstancedMesh, Object3D } from "three";
export default function HeroBinary({
  mobile,
  reduced,
  visible,
  mode = "intro",
}: {
  mobile: boolean;
  reduced: boolean;
  visible: boolean;
  mode?: string;
}) {
  const textures = useMemo(
    () =>
      [0, 1, 2].map((layer) => {
        const canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 384;
        const ctx = canvas.getContext("2d")!;
        ctx.font = `${layer === 1 ? 22 : 19}px monospace`;
        ctx.shadowColor = "#69bd82";
        ctx.shadowBlur = layer === 2 ? 3 : 0;
        ctx.fillStyle = "#69bd82";
        for (let i = 0; i < 13; i++)
          ctx.fillText(i % 3 === 0 ? "1" : "0", 24, 24 + i * 26);
        return new CanvasTexture(canvas);
      }),
    [],
  );
  useEffect(
    () => () => textures.forEach((texture) => texture.dispose()),
    [textures],
  );
  return (
    <group>
      {(mode === "intro"
        ? mobile
          ? [0, 1]
          : [0, 1, 2]
        : mode === "observability"
          ? [0, 1]
          : [0]
      ).map((layer) => (
        <StreamLayer
          key={layer}
          layer={layer}
          count={(mobile ? [12, 6] : [72, 22, 3])[layer]}
          texture={textures[layer]}
          reduced={reduced}
          visible={visible}
          speed={mode === "standby" ? 0.12 : 1}
        />
      ))}
    </group>
  );
}
function StreamLayer({
  layer,
  count,
  texture,
  reduced,
  visible,
  speed,
}: {
  layer: number;
  count: number;
  texture: CanvasTexture;
  reduced: boolean;
  visible: boolean;
  speed: number;
}) {
  const mesh = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  useEffect(() => {
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        ((i * 19 + layer * 7) % 47) / 5 - 4.6,
        ((i * 13) % 37) / 6 - 2.8,
        [-7.8, -1.5, 1.2][layer],
      );
      // Foreground data stays at bay edges, clear of the central machine.
      if (layer === 2) dummy.position.setX((i % 2 ? 1 : -1) * (3.7 + i * 0.16));
      dummy.scale.setScalar([0.78, 0.92, 0.72][layer]);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(i, dummy.matrix);
    }
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
  }, [count, layer, dummy]);
  useFrame((state) => {
    if (mesh.current && !reduced && visible && !document.hidden)
      mesh.current.position.y = -(
        (state.clock.elapsedTime * [0.045, 0.09, 0.12][layer] * speed) %
        1.5
      );
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <planeGeometry args={[0.26, 1.7]} />
      <meshBasicMaterial
        map={texture}
        opacity={[0.24, 0.33, 0.18][layer]}
        transparent
        depthWrite={false}
      />
    </instancedMesh>
  );
}
