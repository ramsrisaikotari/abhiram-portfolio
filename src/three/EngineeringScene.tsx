import type { SceneProps } from "./SceneHost";
import CinematicHero from "./hero/CinematicHero";

export default function EngineeringScene(props: SceneProps) {
  return <CinematicHero {...props} />;
}
