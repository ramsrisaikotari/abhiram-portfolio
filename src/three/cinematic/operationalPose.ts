import { Color, MathUtils, Vector3, type MeshBasicMaterial } from "three";
import type { GuardianAsset } from "../hero/GuardianModel";
import { guardianPivots } from "../hero/guardianTimeline";

// Dock coordinates are offsets from the approved, fully deployed Guardian.
// Small articulated changes express purpose without replaying its entrance.
export function settleOperationalPose(
  asset: GuardianAsset,
  mode: string,
  delta: number,
  immediate: boolean,
) {
  const blend = immediate ? 1 : 1 - Math.exp(-delta * 6);
  for (const [name, part] of asset.parts) {
    const position = new Vector3(...guardianPivots[name]);
    const rotation = new Vector3();
    const side = name.startsWith("left") ? -1 : 1;
    if (name.includes("housing")) {
      position.x = side * 1.19;
      rotation.y = -side * 0.16;
      if (["impact", "observability", "diagnostic"].includes(mode)) {
        position.x += side * 0.18;
        position.z += 0.12;
        rotation.y -= side * 0.12;
      }
    }
    if (name.includes("sled")) {
      if (mode === "infrastructure" || mode === "delivery") {
        position.x += side * 0.3;
        position.z += 0.3;
        rotation.y = -side * 0.18;
        rotation.z = side * 0.1;
      } else if (["modules", "case-studies", "components"].includes(mode)) {
        position.y -= 0.28;
        rotation.z = -side * 0.14;
        rotation.y = -side * 0.1;
      } else if (mode === "standby") {
        position.x -= side * 0.65;
        rotation.z = -side * 0.18;
        rotation.y = side * 0.12;
      }
    }
    if (name.includes("brace"))
      rotation.z =
        mode === "standby"
          ? side * 0.26
          : mode === "delivery"
            ? -side * 0.14
            : 0;
    if (name === "top_armor") {
      position.y += mode === "impact" ? 0.2 : mode === "standby" ? -0.22 : 0;
      rotation.x = mode === "standby" ? 0.12 : 0;
    }
    if (name === "core") position.z = mode === "standby" ? 0.1 : 0.25;
    part.position.lerp(position, blend);
    part.rotation.set(
      MathUtils.lerp(part.rotation.x, rotation.x, blend),
      MathUtils.lerp(part.rotation.y, rotation.y, blend),
      MathUtils.lerp(part.rotation.z, rotation.z, blend),
    );
  }
  asset.lights.forEach((material, name) => {
    const target = new Color(
      name === "Coolant light"
        ? "#4facc5"
        : name === "Data indicator"
          ? "#42764f"
          : "#927140",
    );
    target.multiplyScalar(
      mode === "standby"
        ? 0.28
        : mode === "diagnostic"
          ? 0.65
          : name === "Coolant light"
            ? 0.88
            : 0.65,
    );
    (material as MeshBasicMaterial).color.lerp(target, blend);
  });
}
