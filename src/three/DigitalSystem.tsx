import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Vector3 } from "three";
import { NodeLabel, Paths } from "./scenePrimitives";
import { ease } from "./sceneUtils";
export default function DigitalSystem({
  active,
  phase,
  mobile,
  selected,
  steps,
  onSelect,
  time,
}: {
  active: string;
  phase: string;
  mobile: boolean;
  selected: string;
  steps: string[];
  onSelect: (value: string) => void;
  time: React.RefObject<number>;
}) {
  const nodes = useRef<Group>(null),
    root = useRef<Group>(null);
  const labels = useMemo(
    () =>
      active === "impact"
        ? steps
        : mobile
          ? ["AWS", "CI/CD", "OBSERVABILITY", "SRE"]
          : [
              "AWS",
              "CI/CD",
              "OBSERVABILITY",
              "AUTOMATION",
              "SRE",
              "AI / MLOPS",
            ],
    [active, steps, mobile],
  );
  const positions = useMemo(
    () =>
      labels.map((_, i) => {
        if (mobile)
          return new Vector3(
            i % 2 ? 2.15 : -2.15,
            i < 2 ? 0.5 : -0.45,
            i % 2 ? -0.3 : 0.2,
          );
        const angle = Math.PI / 6 + (i * Math.PI * 2) / labels.length;
        return new Vector3(
          Math.cos(angle) * 2.4,
          Math.sin(angle) * 1.9,
          i % 2 ? -0.8 : 0.35,
        );
      }),
    [labels, mobile],
  );
  const paths = useMemo(
    () => positions.map((position) => [new Vector3(0, 0, -0.6), position]),
    [positions],
  );
  useFrame(() => {
    if (root.current)
      root.current.visible =
        (phase === "digital" && active !== "observability") ||
        (phase === "mechanical" &&
          active === "infrastructure" &&
          time.current < 0.3);
    if (nodes.current)
      nodes.current.scale.setScalar(
        phase === "mechanical" ? 1 - ease(time.current, 0, 0.28) * 0.97 : 1,
      );
  });
  return (
    <group ref={root}>
      <group
        scale={mobile ? 0.75 : 1.12}
        position={[0, mobile ? 0.1 : 0, -0.8]}
      >
        <mesh>
          <icosahedronGeometry args={[0.95, 2]} />
          <meshBasicMaterial
            color="#327548"
            wireframe
            transparent
            opacity={0.55}
          />
        </mesh>
        <mesh rotation={[0.6, 0.3, 0.25]}>
          <torusGeometry args={[1.22, 0.013, 4, 48]} />
          <meshBasicMaterial color="#559B66" />
        </mesh>
        <mesh rotation={[-0.5, -0.6, -0.4]}>
          <torusGeometry args={[1.42, 0.009, 4, 48]} />
          <meshBasicMaterial color="#294B39" />
        </mesh>
      </group>
      <group ref={nodes}>
        <Paths paths={paths} color="#36624B" opacity={0.55} />
        {positions.map((position, i) => (
          <group key={labels[i]} position={position}>
            <mesh scale={labels[i] === selected ? 1.1 : 1}>
              <icosahedronGeometry args={[mobile ? 0.105 : 0.14, 0]} />
              <meshPhongMaterial
                color={labels[i] === selected ? "#3A7950" : "#1D3B2A"}
                emissive="#3FBF64"
                emissiveIntensity={labels[i] === selected ? 0.15 : 0.04}
                shininess={12}
              />
            </mesh>
            {phase === "digital" && (
              <NodeLabel
                mobile={mobile}
                label={labels[i]}
                selected={labels[i] === selected}
                onSelect={() => onSelect(labels[i])}
                position={[0, mobile ? -0.24 : -0.3, 0.15]}
              />
            )}
          </group>
        ))}
      </group>
    </group>
  );
}
