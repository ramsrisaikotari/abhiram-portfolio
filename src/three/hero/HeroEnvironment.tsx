import { useEffect, useMemo } from "react";
import {
  CanvasTexture,
  BoxGeometry,
  Matrix4,
  Mesh,
  MeshPhongMaterial,
  MeshBasicMaterial,
  CylinderGeometry,
  Vector3,
  Quaternion,
  type BufferGeometry,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// A service bay built in five shared material batches, independent of model detail.
export default function HeroEnvironment({ mobile }: { mobile: boolean }) {
  const contact = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
    gradient.addColorStop(0, "rgba(0,0,0,.8)");
    gradient.addColorStop(0.55, "rgba(0,0,0,.5)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    return new CanvasTexture(canvas);
  }, []);
  useEffect(() => () => contact.dispose(), [contact]);
  const bay = useMemo(() => {
    const batches: BufferGeometry[][] = [[], [], [], [], []];
    const box = (
      batch: number,
      x: number,
      y: number,
      z: number,
      w: number,
      h: number,
      d: number,
      angle = 0,
    ) => {
      const matrix = new Matrix4().makeRotationZ(angle);
      matrix.setPosition(x, y, z);
      batches[batch].push(new BoxGeometry(w, h, d).applyMatrix4(matrix));
    };
    const pipe = (a: number[], b: number[], r: number) => {
      const start = new Vector3(...a),
        end = new Vector3(...b),
        direction = end.clone().sub(start);
      const matrix = new Matrix4().compose(
        start.add(end).multiplyScalar(0.5),
        new Quaternion().setFromUnitVectors(
          new Vector3(0, 1, 0),
          direction.clone().normalize(),
        ),
        new Vector3(1, 1, 1),
      );
      batches[2].push(
        new CylinderGeometry(r, r, direction.length(), 8).applyMatrix4(matrix),
      );
    };
    box(2, 0, -2.51, -3, 19, 0.2, 24);
    box(2, 0, 1.5, -12, 18, 10, 0.35);
    // Segmented floor plates and recessed longitudinal service trenches.
    for (const x of [-4.2, -2.1, 0, 2.1, 4.2])
      for (const z of mobile ? [-4, -0.7, 2.6] : [-10.6, -7.3, -4, -0.7, 2.6])
        box(0, x, -2.35, z, 1.95, 0.12, 3.15);
    for (const side of [-1, 1]) {
      box(2, side * 2.65, -2.29, -3.5, 0.23, 0.11, 19);
      box(1, side * 2.85, -2.23, -3.5, 0.07, 0.07, 19);
      box(1, side * 2.47, -2.23, -3.5, 0.055, 0.07, 19);
      // Large columns, overhead beams, and rear machinery establish human scale.
      for (const z of mobile ? [-7] : [-3.8, -7.6, -11.4]) {
        box(1, side * 5.2, 0.9, z, 0.45, 7, 0.64);
        box(1, side * 4.6, 4.03, z, 1.65, 0.34, 0.52, side * 0.55);
        box(1, 0, 4.6, z, 8.05, 0.2, 0.42);
        box(2, side * 5.7, -0.45, z, 1.4, 3.9, 1.08);
        pipe([side * 5.18, -1.8, z + 0.4], [side * 5.18, 2.9, z + 0.4], 0.1);
      }
      box(1, side * 3.5, 0.3, -10.9, 0.24, 5.3, 0.4);
      box(2, side * 3.95, -0.2, -10.2, 0.8, 4.35, 1.3);
      if (!mobile)
        for (let i = 0; i < 6; i++)
          box(1, side * 3.95, -1.4 + i * 0.43, -9.52, 0.71, 0.055, 0.07);
      // Sparse amber rail indicators and cyan inset service strips.
      for (const z of mobile ? [-3, 1] : [-8, -4, 0, 3]) {
        box(3, side * 2.65, -2.215, z, 0.1, 0.025, 0.26);
        box(4, side * 2.47, -2.185, z - 0.65, 0.026, 0.025, 0.65);
        box(2, side * 2.15, -2.275, z, 0.18, 0.02, 0.35, side * 0.6);
      }
      box(4, side * 3.5, 0.8, -10.65, 0.028, 1.7, 0.028);
    }
    if (!mobile) {
      pipe([-5, 3.2, -9], [5, 3.2, -9], 0.11);
      pipe([-4.7, 2.9, -9], [-4.7, 2.9, 1.5], 0.08);
      pipe([4.7, 2.9, -9], [4.7, 2.9, 1.5], 0.08);
    }
    return batches.map((pieces, index) => {
      const geometry = mergeGeometries(pieces, false);
      pieces.forEach((p) => p.dispose());
      const material =
        index < 3
          ? new MeshPhongMaterial({
              color: ["#19232b", "#25353d", "#080f15"][index],
              shininess: index === 1 ? 18 : 7,
            })
          : new MeshBasicMaterial({
              color: index === 3 ? "#796440" : "#294d59",
            });
      return new Mesh(geometry, material);
    });
  }, [mobile]);
  useEffect(
    () => () =>
      bay.forEach((mesh) => {
        mesh.geometry.dispose();
        (mesh.material as MeshPhongMaterial).dispose();
      }),
    [bay],
  );
  return (
    <group>
      {bay.map((mesh, index) => (
        <primitive key={index} object={mesh} dispose={null} />
      ))}
      <mesh position={[0, -2.278, 0.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8.8, 4.8]} />
        <meshBasicMaterial
          map={contact}
          transparent
          depthWrite={false}
          opacity={0.65}
        />
      </mesh>
    </group>
  );
}
