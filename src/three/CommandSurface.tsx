import { useMemo } from "react";
import { InstancedMesh, Object3D } from "three";
import { steel } from "./sceneUtils";
export default function CommandSurface({
  mobile,
  standby = false,
}: {
  mobile: boolean;
  standby?: boolean;
}) {
  const segments = useMemo(() => {
    const dummy = new Object3D();
    return Array.from({ length: mobile ? 6 : 10 }, (_, index) => {
      const angle = (index * Math.PI * 2) / (mobile ? 6 : 10);
      dummy.position.set(Math.cos(angle) * 2.65, -0.08, Math.sin(angle) * 1.15);
      dummy.rotation.set(0, -angle, 0);
      dummy.updateMatrix();
      return dummy.matrix.clone();
    });
  }, [mobile]);
  return (
    <group
      position={[0, mobile ? -0.95 : -1.8, -1.1]}
      scale={standby ? 0.75 : 1}
      rotation={[0.2, 0, 0]}
    >
      <mesh>
        <cylinderGeometry args={[2.9, 3.05, 0.18, mobile ? 24 : 48]} />
        <meshPhongMaterial color={steel.dark} shininess={16} />
      </mesh>
      <mesh position={[0, 0.14, 0]} scale={[1, 1, 0.6]}>
        <cylinderGeometry args={[2.6, 2.65, 0.14, 32]} />
        <meshPhongMaterial color={steel.body} shininess={24} />
      </mesh>
      <mesh position={[0, 0.25, 0]} scale={[1, 1, 0.6]}>
        <cylinderGeometry args={[1.65, 1.8, 0.12, 32]} />
        <meshPhongMaterial color={steel.panel} shininess={30} />
      </mesh>
      <mesh
        position={[0, 0.22, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[1, 0.6, 1]}
      >
        <torusGeometry args={[2.58, 0.014, 4, 48]} />
        <meshBasicMaterial color={standby ? "#36515D" : steel.cyan} />
      </mesh>
      <instancedMesh
        args={[undefined, undefined, segments.length]}
        ref={(mesh: InstancedMesh | null) => {
          if (mesh) {
            segments.forEach((matrix, i) => mesh.setMatrixAt(i, matrix));
            mesh.instanceMatrix.needsUpdate = true;
          }
        }}
      >
        <boxGeometry args={[0.45, 0.2, 0.24]} />
        <meshPhongMaterial color={steel.body} shininess={14} />
      </instancedMesh>
      <mesh position={[0.8, 0.34, 0.4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.3, 6]} />
        <meshBasicMaterial color={steel.gold} />
      </mesh>
    </group>
  );
}
