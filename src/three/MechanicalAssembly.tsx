import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, Mesh, MeshPhongMaterial, MathUtils } from "three";
import { PlateGeometry } from "./scenePrimitives";
import { ease, steel } from "./sceneUtils";
interface Props {
  phase: string;
  active: string;
  mobile: boolean;
  reduced: boolean;
  visible: boolean;
  hideCore?: boolean;
}
export default function MechanicalAssembly({
  phase,
  active,
  mobile,
  reduced,
  visible,
  hideCore,
}: Props) {
  const time = useRef(0),
    inner = useRef<Mesh>(null),
    outer = useRef<Mesh>(null),
    body = useRef<Group>(null),
    modules = useRef<Group>(null);
  const panels = useRef<(Group | null)[]>([]),
    connectors = useRef<(Mesh | null)[]>([]),
    light = useRef<MeshPhongMaterial>(null);
  const standby = active === "standby";
  const { invalidate } = useThree();
  useEffect(() => {
    time.current = 0;
    invalidate();
  }, [phase, standby, reduced, mobile, invalidate]);
  useFrame((_, delta) => {
    if (!visible) return;
    time.current = reduced
      ? 2
      : Math.min(2, time.current + Math.min(delta, 0.05));
    const t = time.current,
      mechanical = phase === "mechanical",
      settling = ease(t, 0, 1.1);
    const alignment = ease(t, 0.12, 0.42),
      lock = ease(t, 0.28, 0.45);
    if (inner.current)
      inner.current.rotation.z = mechanical
        ? ((1 - alignment) * -Math.PI) / 2
        : 0.18;
    if (outer.current) {
      outer.current.position.z = mechanical ? 0.3 + (1 - lock) * 1.05 : -0.05;
      outer.current.rotation.z = mechanical ? ((1 - lock) * Math.PI) / 5 : 0;
    }
    panels.current.forEach((panel, i) => {
      if (!panel) return;
      const angle = (i * Math.PI) / 2 + Math.PI / 4,
        dock = mechanical ? ease(t, 0.38 + i * 0.08, 0.45) : standby ? 0 : 0.18;
      const radius = mechanical
        ? 1.12 + (1 - dock) * 1.3
        : standby
          ? 0.75 - 0.39 * settling
          : 1.12 - 0.37 * settling;
      panel.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        mechanical ? -0.02 + (1 - dock) * 0.4 : 0.05,
      );
      panel.rotation.set(
        mechanical
          ? (1 - dock) * -0.95
          : standby
            ? -0.1 * settling
            : 0.6 * settling,
        0,
        angle - Math.PI / 2,
      );
    });
    connectors.current.forEach((connector, i) => {
      if (connector)
        connector.position.x =
          (i ? 1 : -1) *
          (1.05 +
            (mechanical ? (1 - ease(t, 0.83 + i * 0.07, 0.35)) * 0.9 : 0));
    });
    if (modules.current)
      modules.current.position.z = mechanical
        ? -0.12 + (1 - ease(t, 0.7, 0.42)) * 0.6
        : -0.4;
    if (light.current)
      light.current.emissiveIntensity = mechanical
        ? 0.08 + ease(t, 1.05, 0.25) * 0.22
        : standby
          ? 0.035
          : 0.12;
    if (body.current) {
      const scale = mobile
        ? mechanical
          ? 0.64
          : standby
            ? 0.45
            : 0.32
        : mechanical
          ? 1.15
          : standby
            ? 0.72
            : 0.55;
      body.current.scale.setScalar(
        reduced
          ? scale
          : MathUtils.damp(
              body.current.scale.x,
              scale,
              6,
              Math.min(delta, 0.05),
            ),
      );
      body.current.position.y = mechanical
        ? mobile
          ? 0.15
          : -0.05
        : standby
          ? -0.05
          : mobile
            ? -0.75
            : -0.8;
    }
    if (!reduced && t < 1.5) invalidate();
  });
  return (
    <group
      ref={body}
      visible={
        phase !== "digital" &&
        !hideCore &&
        active !== "delivery" &&
        !(
          mobile &&
          ["case-studies", "components", "diagnostic"].includes(active)
        )
      }
    >
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.78, 0.65, 12]} />
        <meshPhongMaterial color={steel.body} shininess={30} />
      </mesh>
      <mesh position={[0, 0, 0.38]}>
        <torusGeometry args={[0.57, 0.07, 6, 32]} />
        <meshPhongMaterial color={steel.panel} shininess={40} />
      </mesh>
      <mesh position={[0, 0, 0.36]}>
        <icosahedronGeometry args={[0.43, 1]} />
        <meshPhongMaterial
          ref={light}
          color={steel.dark}
          emissive={steel.blue}
          emissiveIntensity={reduced ? 0.3 : 0.08}
          shininess={24}
        />
      </mesh>
      <mesh ref={inner} position={[0, 0, 0.16]}>
        <torusGeometry args={[0.96, 0.065, 6, 40, Math.PI * 1.85]} />
        <meshPhongMaterial color={steel.panel} shininess={35} />
      </mesh>
      <mesh ref={outer} position={[0, 0, 0.3]}>
        <torusGeometry args={[1.36, 0.095, 6, 40, Math.PI * 1.75]} />
        <meshPhongMaterial color={steel.body} shininess={22} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <group
          key={i}
          ref={(group) => {
            panels.current[i] = group;
          }}
        >
          <mesh position={[0, 0.25, 0]}>
            <PlateGeometry width={0.72} height={0.8} depth={0.12} />
            <meshPhongMaterial
              color={i % 2 ? steel.panel : steel.body}
              shininess={i % 2 ? 34 : 18}
            />
          </mesh>
        </group>
      ))}
      <group ref={modules}>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 1.62, -0.05, -0.15]}>
            <PlateGeometry width={0.43} height={0.78} depth={0.22} />
            <meshPhongMaterial color={steel.panel} shininess={28} />
          </mesh>
        ))}
      </group>
      {[0, 1].map((i) => (
        <mesh
          key={i}
          ref={(mesh) => {
            connectors.current[i] = mesh;
          }}
          position={[(i ? 1 : -1) * 1.05, -0.55, 0.15]}
        >
          <boxGeometry args={[0.65, 0.12, 0.18]} />
          <meshPhongMaterial color={steel.body} shininess={22} />
        </mesh>
      ))}
      <mesh position={[0.52, -0.58, 0.51]}>
        <boxGeometry args={[0.16, 0.035, 0.025]} />
        <meshBasicMaterial color={steel.gold} />
      </mesh>
    </group>
  );
}
