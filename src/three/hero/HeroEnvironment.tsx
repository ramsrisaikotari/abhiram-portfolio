import { useEffect, useMemo } from "react";
import { CanvasTexture, BoxGeometry, Matrix4, Mesh, MeshPhongMaterial } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Repeated bay ribs/rails are merged into four material batches, not dozens of meshes.
export default function HeroEnvironment({ mobile }: { mobile: boolean }) {
  const contact = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext("2d")!;
    const gradient = context.createRadialGradient(64, 64, 10, 64, 64, 64);
    gradient.addColorStop(0, "rgba(0,0,0,.8)");
    gradient.addColorStop(0.55, "rgba(0,0,0,.5)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    return new CanvasTexture(canvas);
  }, []);
  useEffect(() => () => contact.dispose(), [contact]);
  const environment = useMemo(() => {
    const group: Mesh[] = [];
    const batches: [string, number[][]][] = [
      [
        "#111b20",
        [
          [0, -2.4, -1, 16, 0.18, 18],
          [0, 1, -6, 16, 9, 0.25],
        ],
      ],
      [
        "#1c2a30",
        mobile
          ? [
              [-3.5, 1, -4.8, 0.2, 7, 0.6],
              [3.5, 1, -4.8, 0.2, 7, 0.6],
            ]
          : [-6, -4, -2, 0, 2, 4, 6].map((x) => [x, 1.5, -5.5, 0.16, 8, 0.7]),
      ],
      [
        "#0a1217",
        [
          [-3.2, -0.1, -4.8, 1.2, 4, 0.8],
          [3.6, -0.4, -4.3, 1.4, 3.4, 1.2],
          [0, 4, -3, 14, 0.16, 0.25],
          [-2.3, -2.2, 0, 0.07, 0.1, 15],
          [2.3, -2.2, 0, 0.07, 0.1, 15],
        ],
      ],
    ];
    for (const [color, boxes] of batches) {
      const pieces = boxes.map(([x, y, z, w, h, d]) =>
        new BoxGeometry(w, h, d).applyMatrix4(
          new Matrix4().makeTranslation(x, y, z),
        ),
      );
      const geometry = mergeGeometries(pieces);
      pieces.forEach((piece) => piece.dispose());
      const mesh = new Mesh(
        geometry,
        new MeshPhongMaterial({ color, shininess: 8 }),
      );
      mesh.receiveShadow = true;
      group.push(mesh);
    }
    return group;
  }, [mobile]);
  useEffect(
    () => () =>
      environment.forEach((mesh) => {
        mesh.geometry.dispose();
        (mesh.material as MeshPhongMaterial).dispose();
      }),
    [environment],
  );
  return (
    <group>
      <mesh position={[0, -2.245, 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.8, 3.4]} />
        <meshBasicMaterial
          map={contact}
          transparent
          depthWrite={false}
          opacity={0.65}
        />
      </mesh>
      {environment.map((mesh, index) => (
        <primitive key={index} object={mesh} dispose={null} />
      ))}
      <mesh
        position={[0, -2.27, 0.15]}
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[2.65, 8]} />
        <meshPhongMaterial color="#202c32" shininess={14} />
      </mesh>
      <mesh position={[-3.3, 0.9, -5.05]}>
        <planeGeometry args={[0.035, 3.3]} />
        <meshBasicMaterial color="#274b4b" />
      </mesh>
      {!mobile && (
        <mesh position={[3.6, 0.7, -4.91]}>
          <planeGeometry args={[0.035, 2.7]} />
          <meshBasicMaterial color="#665334" />
        </mesh>
      )}
    </group>
  );
}
