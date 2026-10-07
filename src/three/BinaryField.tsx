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
  const mesh = useRef<InstancedMesh>(null);
  const count = mobile ? 24 : 84;
  const dummy = useMemo(() => new Object3D(), []);
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
  useEffect(() => {
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        ((i * 17) % 31) / 2 - 7.5,
        ((i * 13) % 23) / 2 - 5.5,
        -3 - (i % 3) * 2,
      );
      dummy.scale.setScalar(0.6 + (i % 3) * 0.2);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(i, dummy.matrix);
    }
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
  }, [count, dummy]);
  useFrame((state) => {
    if (mesh.current && !reduced && active)
      mesh.current.position.y = -((state.clock.elapsedTime * 0.12) % 2);
  });
  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, count]}
      visible={active}
    >
      <planeGeometry args={[0.4, 0.9]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.22}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
