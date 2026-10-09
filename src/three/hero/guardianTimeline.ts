import { MathUtils, type MeshBasicMaterial, Color } from "three";
import type { GuardianAsset } from "./GuardianModel";

const ease = (time: number, start: number, duration: number) => {
  const x = MathUtils.clamp((time - start) / duration, 0, 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
};
const lights = {
  "Coolant light": new Color("#4facc5"),
  "Data indicator": new Color("#42764f"),
  "Amber practical": new Color("#927140"),
};

export const guardianPivots: Record<string, number[]> = {
  left_sled: [-2.45, 0.8, -0.08],
  right_sled: [2.45, 0.8, -0.08],
  left_brace: [-0.95, 0.8, -0.25],
  right_brace: [0.95, 0.8, -0.25],
  left_housing: [-1.05, 0.45, 0.25],
  right_housing: [1.05, 0.45, 0.25],
  top_armor: [0, 1.6, -0.2],
  left_support: [-0.35, -1.1, -0.1],
  right_support: [0.35, -1.1, -0.1],
  core: [0, 0.45, 0.06],
};

// Pivots are authored docking coordinates. Deployment uses real travel/hinges.
export function applyGuardianPose(asset: GuardianAsset, time: number) {
  for (const side of [-1, 1]) {
    const prefix = side < 0 ? "left" : "right";
    const travel = ease(time, side < 0 ? 0.28 : 0.42, 1.2);
    const sled = asset.parts.get(`${prefix}_sled`)!;
    sled.position.set(
      side * (2.45 - 1.6 * (1 - travel)),
      0.8 - 0.32 * (1 - travel),
      -0.08 - 0.4 * (1 - travel),
    );
    sled.rotation.set(
      0,
      side * 0.32 * (1 - travel),
      -side * 0.22 * (1 - travel),
    );
    const brace = asset.parts.get(`${prefix}_brace`)!;
    const hinge = ease(time, 0.38 + (side > 0 ? 0.12 : 0), 1.25);
    brace.rotation.z = side * 0.85 * (1 - hinge);
    const housing = asset.parts.get(`${prefix}_housing`)!;
    const opening = ease(time, 1.12 + (side > 0 ? 0.08 : 0), 0.78);
    housing.position.set(
      side * (1.05 - 0.64 * (1 - opening) + 0.14 * opening),
      0.45,
      0.25 + 0.56 * (1 - opening),
    );
    housing.rotation.y = -side * 0.16 * opening;
  }
  const crown = asset.parts.get("top_armor")!;
  const lift = ease(time, 0.95, 0.88);
  crown.position.y = 1.6 - 0.74 * (1 - lift);
  crown.rotation.x = 0.38 * (1 - lift);
  const dock = ease(time, 0.72, 1.05);
  for (const side of [-1, 1]) {
    const support = asset.parts.get(
      side < 0 ? "left_support" : "right_support",
    )!;
    support.position.set(
      side * (0.35 - 0.6 * (1 - dock)),
      -1.1 + 0.3 * (1 - dock),
      -0.1,
    );
    support.rotation.set(-0.1 * (1 - dock), 0, -side * 0.1 * (1 - dock));
  }
  const core = asset.parts.get("core")!;
  const power = ease(time, 1.72, 0.68);
  core.position.z = 0.06 + 0.14 * power;
  core.rotation.z = -0.42 * (1 - power);
  asset.lights.forEach((material, name) => {
    const factor =
      name === "Coolant light"
        ? 0.035 + 0.965 * power
        : 0.16 + 0.65 * ease(time, 0.48, 1.3);
    (material as MeshBasicMaterial).color
      .copy(lights[name as keyof typeof lights])
      .multiplyScalar(factor);
  });
}
