import type { SceneProps } from "./SceneHost";
import LegacyEngineeringScene from "./LegacyEngineeringScene";
import CinematicHero from "./hero/CinematicHero";

export default function EngineeringScene(props: SceneProps) {
  return props.active === "intro" ? (
    <CinematicHero {...props} />
  ) : (
    <LegacyEngineeringScene {...props} />
  );
}
