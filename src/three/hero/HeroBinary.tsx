import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CanvasTexture, InstancedMesh, Object3D } from "three";
export default function HeroBinary({
  mobile,
  reduced,
  visible,
}: {
  mobile: boolean;
  reduced: boolean;
  visible: boolean;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.font = "19px monospace";
    ctx.fillStyle = "#69bd82";
    for (let i = 0; i < 9; i++)
      ctx.fillText(i % 3 === 0 ? "1" : "0", 24, 24 + i * 26);
    return new CanvasTexture(canvas);
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <group>
      {(mobile ? [0, 1] : [0, 1, 2]).map((layer) => (
        <StreamLayer
          key={layer}
          layer={layer}
          count={(mobile ? [12, 4] : [42, 18, 4])[layer]}
          texture={texture}
          reduced={reduced}
          visible={visible}
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
}: {
  layer: number;
  count: number;
  texture: CanvasTexture;
  reduced: boolean;
  visible: boolean;
}) {
  const mesh = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  useEffect(() => {
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        ((i * 19 + layer * 7) % 41) / 5 - 4,
        ((i * 13) % 37) / 6 - 2.8,
        [-5.15, -3.3, 1.0][layer],
      );
      // Foreground data stays at bay edges, clear of the central machine.
      if (layer === 2) dummy.position.setX((i % 2 ? 1 : -1) * (2.6 + i * 0.14));
      dummy.scale.setScalar([0.65, 0.8, 0.68][layer]);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(i, dummy.matrix);
    }
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
  }, [count, layer, dummy]);
  useFrame((state) => {
    if (mesh.current && !reduced && visible && !document.hidden)
      mesh.current.position.y = -(
        (state.clock.elapsedTime * [0.045, 0.065, 0.085][layer]) %
        1.5
      );
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <planeGeometry args={[0.23, 1.1]} />
      <meshBasicMaterial
        map={texture}
        opacity={[0.18, 0.22, 0.24][layer]}
        transparent
        depthWrite={false}
      />
    </instancedMesh>
  );
}
