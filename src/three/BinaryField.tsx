import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CanvasTexture, InstancedMesh, Object3D } from "three";
export default function BinaryField({
  mobile,
  reduced,
  active,
}: {
  mobile: boolean;
  reduced: boolean;
  active: boolean;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 128;
    const context = canvas.getContext("2d")!;
    context.font = "24px monospace";
    context.fillStyle = "#67E879";
    context.fillText("0", 20, 30);
    context.fillText("1", 20, 65);
    context.fillText("0", 20, 100);
    return new CanvasTexture(canvas);
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <group visible={active}>
      {[0, 1, 2].map((layer) => (
        <BinaryLayer
          key={layer}
          layer={layer}
          count={(mobile ? [12, 8, 4] : [48, 28, 8])[layer]}
          texture={texture}
          reduced={reduced}
          active={active}
        />
      ))}
    </group>
  );
}
function BinaryLayer({
  layer,
  count,
  texture,
  reduced,
  active,
}: {
  layer: number;
  count: number;
  texture: CanvasTexture;
  reduced: boolean;
  active: boolean;
}) {
  const mesh = useRef<InstancedMesh>(null),
    dummy = useMemo(() => new Object3D(), []);
  useEffect(() => {
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        ((i * 17 + layer * 5) % 31) / 2.5 - 6,
        ((i * 13) % 29) / 3 - 4.5,
        -6 + layer * 1.8,
      );
      dummy.scale.setScalar(0.65 + layer * 0.12);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(i, dummy.matrix);
    }
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
  }, [layer, count, dummy]);
  useFrame((state) => {
    if (mesh.current && !reduced && active)
      mesh.current.position.y = -(
        (state.clock.elapsedTime * (0.055 + layer * 0.035)) %
        1.8
      );
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <planeGeometry args={[0.34, 0.8]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={[0.11, 0.17, 0.22][layer]}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
