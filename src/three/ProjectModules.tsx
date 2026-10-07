import { Html } from "@react-three/drei";
import { projects } from "../data/projects";
export default function ProjectModules({
  selected,
  onSelect,
  mobile,
}: {
  selected: string;
  onSelect: (slug: string) => void;
  mobile: boolean;
}) {
  return (
    <group>
      {projects
        .filter((project) => project.featured)
        .map((project, index) => (
          <group
            key={project.slug}
            position={[(index % 2 ? 1 : -1) * 2.6, index < 2 ? 2.6 : -2.6, 0.2]}
          >
            <mesh scale={selected === project.slug ? 1.1 : 1}>
              <boxGeometry args={[1, 0.55, 0.22]} />
              <meshPhongMaterial
                color="#1B2630"
                emissive="#59C7FF"
                emissiveIntensity={selected === project.slug ? 0.6 : 0.12}
                shininess={45}
              />
            </mesh>
            <Html
              center
              position={[0, -0.5, 0.1]}
              distanceFactor={10}
              zIndexRange={[10, 0]}
            >
              <button
                className="scene-node"
                aria-label={`Activate ${project.title}`}
                aria-pressed={selected === project.slug}
                onFocus={() => onSelect(project.slug)}
                onPointerEnter={() => onSelect(project.slug)}
                onClick={() => onSelect(project.slug)}
              >
                {mobile ? `MODULE 0${index + 1}` : project.title}
              </button>
            </Html>
          </group>
        ))}
    </group>
  );
}
