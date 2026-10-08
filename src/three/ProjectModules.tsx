import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, MathUtils, Vector3 } from "three";
import { projects } from "../data/projects";
import { NodeLabel, Paths, PlateGeometry } from "./scenePrimitives";
import { steel } from "./sceneUtils";
const titles: Record<string, string> = {
  "llm-job-agent": "LLM Job Agent",
  "portfolio-cicd": "Portfolio CI/CD",
  "phishing-url-detection": "Phishing Detection",
  "covid-analytics": "COVID Analytics",
};
const featured = projects.filter((project) => project.featured);
export default function ProjectModules({
  selected,
  onSelect,
  mobile,
  reduced,
}: {
  selected: string;
  onSelect: (slug: string) => void;
  mobile: boolean;
  reduced: boolean;
}) {
  const positions = useMemo(
    () =>
      featured.map(
        (project, index) =>
          new Vector3(
            index % 2 ? 1.8 : -1.8,
            index < 2 ? (mobile ? 0.6 : 1.15) : mobile ? -0.45 : -0.15,
            selected === project.slug ? 0.55 : -0.2,
          ),
      ),
    [selected, mobile],
  );
  const chosen = featured.findIndex((project) => project.slug === selected);
  const paths = useMemo(
    () =>
      chosen < 0
        ? []
        : [[new Vector3(0, mobile ? -0.7 : -0.8, -0.5), positions[chosen]]],
    [chosen, positions, mobile],
  );
  return (
    <group>
      <Paths paths={paths} opacity={0.7} />
      {featured.map((project, i) => (
        <DockedModule
          key={project.slug}
          label={project.title}
          display={titles[project.slug] ?? project.title}
          position={positions[i]}
          selected={selected === project.slug}
          onSelect={() => onSelect(project.slug)}
          reduced={reduced}
          mobile={mobile}
        />
      ))}
    </group>
  );
}
function DockedModule({
  label,
  display,
  position,
  selected,
  onSelect,
  reduced,
  mobile,
}: {
  label: string;
  display: string;
  position: Vector3;
  selected: boolean;
  onSelect: () => void;
  reduced: boolean;
  mobile: boolean;
}) {
  const root = useRef<Group>(null);
  const riser = position.y - (mobile ? -0.65 : -1.45) - 0.18;
  useFrame((_, delta) => {
    if (root.current) {
      root.current.position.lerp(
        position,
        reduced ? 1 : 1 - Math.exp(-Math.min(delta, 0.05) * 8),
      );
      root.current.rotation.x = reduced
        ? -0.12
        : MathUtils.damp(
            root.current.rotation.x,
            selected ? -0.04 : -0.18,
            8,
            Math.min(delta, 0.05),
          );
    }
  });
  return (
    <group ref={root} position={position}>
      <mesh position={[0, -riser / 2, -0.1]}>
        <cylinderGeometry args={[0.06, 0.09, riser, 6]} />
        <meshPhongMaterial color={steel.dark} shininess={18} />
      </mesh>
      <mesh>
        <PlateGeometry width={1.3} height={0.56} depth={0.16} />
        <meshPhongMaterial
          color={selected ? "#344C59" : steel.body}
          shininess={30}
        />
      </mesh>
      <mesh position={[0, 0.23, 0.2]}>
        <boxGeometry args={[0.85, 0.022, 0.025]} />
        <meshBasicMaterial color={selected ? steel.cyan : "#354B58"} />
      </mesh>
      <NodeLabel
        label={label}
        display={display}
        project
        selected={selected}
        onSelect={onSelect}
        position={[0, -0.15, 0.23]}
      />
    </group>
  );
}
