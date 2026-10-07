import { useEffect, useMemo, useRef } from "react";
import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Color, Group, MathUtils, Vector3 } from "three";
import type { SceneProps } from "./SceneHost";
import ProjectModules from "./ProjectModules";
import BinaryField from "./BinaryField";
const colors: Record<string, string> = {
  digital: "#67E879",
  mechanical: "#55AFFF",
  command: "#59C7FF",
};
export default function EngineeringScene({
  active,
  projectSlug,
  onProjectSelect,
  phase,
  selected,
  steps,
  reduced,
  mobile,
  visible,
  onSelect,
  connectedCount,
}: SceneProps) {
  const core = useRef<Group>(null);
  const modules = useRef<Group>(null);
  const pulse = useRef<Group>(null);
  const elapsed = useRef(0);
  const slowFrames = useRef(0);
  const previous = useRef(active);
  const previousPhase = useRef(phase);
  const moduleScale = useRef(1);
  const { invalidate, camera, pointer, setDpr, viewport } = useThree();
  const accent = colors[phase];
  const target = useMemo(() => new Vector3(), []);
  useEffect(() => {
    elapsed.current = 0;
    invalidate();
  }, [active, projectSlug, reduced, invalidate]);
  useEffect(() => {
    if (visible) invalidate();
  }, [selected, visible, invalidate]);
  const pathCount = Math.min(connectedCount ?? steps.length, mobile ? 9 : 14);
  useEffect(() => {
    if (reduced || mobile || active !== "intro") return;
    const move = (event: PointerEvent) => {
      pointer.set(
        MathUtils.clamp((event.clientX / innerWidth) * 2 - 1, -1, 1),
        MathUtils.clamp(1 - (event.clientY / innerHeight) * 2, -1, 1),
      );
      invalidate();
    };
    document.addEventListener("pointermove", move, { passive: true });
    return () => document.removeEventListener("pointermove", move);
  }, [active, reduced, mobile, pointer, invalidate]);
  const count = Math.min(steps.length, mobile ? 9 : 14);
  const positions = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        if (
          [
            "delivery",
            "observability",
            "case-studies",
            "diagnostic",
            "modules",
          ].includes(active)
        )
          return new Vector3(((i % 3) - 1) * 2, 2 - Math.floor(i / 3) * 1.4, 0);
        return new Vector3(
          Math.cos((i / count) * Math.PI * 2) * 2.7,
          Math.sin((i / count) * Math.PI * 2) * 2.7,
          Math.sin(i * 2) * 0.3,
        );
      }),
    [count, active],
  );
  useFrame((_, delta) => {
    if (reduced || !visible) return;
    if (delta > 1 / 35 && delta < 0.15 && viewport.dpr > 1) {
      slowFrames.current += 1;
      if (slowFrames.current > 20) setDpr(1);
    }
    const dt = Math.min(delta, 0.05);
    if (previous.current !== active) {
      previous.current = active;
      moduleScale.current = 0.05;
    }
    if (previousPhase.current !== phase) {
      previousPhase.current = phase;
      if (core.current) core.current.scale.setScalar(0.25);
    }
    elapsed.current += dt;
    if (elapsed.current < 2 || active === "intro" || active === "observability")
      invalidate();
    if (core.current) {
      const desired =
        phase === "mechanical" ? 0.65 : phase === "command" ? 0.35 : 1;
      core.current.scale.setScalar(
        MathUtils.damp(core.current.scale.x, desired, 4, dt),
      );
      if (elapsed.current < 1.5)
        core.current.rotation.z = MathUtils.damp(
          core.current.rotation.z,
          phase === "mechanical" ? Math.PI / 4 : 0,
          4,
          dt,
        );
    }
    moduleScale.current = MathUtils.damp(moduleScale.current, 1, 5, dt);
    if (modules.current) modules.current.scale.setScalar(moduleScale.current);
    target.set(
      pointer.x * (mobile ? 0 : 0.18),
      pointer.y * (mobile ? 0 : 0.12),
      phase === "mechanical" ? 10.5 : 10,
    );
    camera.position.lerp(target, 1 - Math.exp(-dt * 3));
    camera.lookAt(0, 0, 0);
    if (pulse.current && pathCount > 1) {
      const duration = active === "observability" ? 4 : 2;
      const progress = (elapsed.current / duration) % 1;
      pulse.current.visible =
        active === "observability" ||
        ((active === "delivery" || active === "case-studies") &&
          elapsed.current < duration);
      const path = progress * (pathCount - 1);
      const index = Math.floor(path);
      pulse.current.position
        .copy(positions[index])
        .lerp(positions[Math.min(index + 1, pathCount - 1)], path - index);
    }
  });
  return (
    <>
      <color
        attach="background"
        args={[
          phase === "digital"
            ? "#020604"
            : phase === "mechanical"
              ? "#070B10"
              : "#060B14",
        ]}
      />
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 5]} intensity={2} color={accent} />
      <BinaryField
        mobile={mobile}
        reduced={reduced}
        active={phase === "digital"}
      />
      <group
        ref={core}
        position={[0, 0, -1.3]}
        scale={
          reduced
            ? phase === "mechanical"
              ? 0.65
              : phase === "command"
                ? 0.35
                : 1
            : 1
        }
      >
        <mesh>
          <icosahedronGeometry args={[1.1, 1]} />
          <meshPhongMaterial
            color="#1B2630"
            emissive={accent}
            emissiveIntensity={0.12}
            wireframe={phase === "digital"}
            shininess={45}
          />
        </mesh>
        {[0, 1, 2].slice(0, mobile ? 2 : 3).map((i) => (
          <mesh key={i} rotation={[i * 0.8, i * 0.5, i * 0.4]}>
            <torusGeometry
              args={[
                1.5 + i * 0.3,
                phase === "mechanical" ? 0.075 : 0.018,
                6,
                mobile ? 32 : 64,
              ]}
            />
            <meshPhongMaterial
              color={accent}
              emissive={accent}
              emissiveIntensity={0.45}
            />
          </mesh>
        ))}
      </group>
      <group ref={modules} scale={1}>
        {positions.map((position, index) => (
          <group key={`${active}-${index}`} position={position}>
            <mesh
              rotation={[0.2, 0.2, 0]}
              scale={steps[index] === selected ? 1.2 : 1}
            >
              {phase === "digital" ? (
                <icosahedronGeometry args={[0.18, 0]} />
              ) : (
                <boxGeometry args={[0.65, 0.4, 0.22]} />
              )}
              <meshPhongMaterial
                color={
                  active === "diagnostic" && steps[index] === "Database"
                    ? "#B94A4A"
                    : steps[index] === selected
                      ? accent
                      : "#1B2630"
                }
                emissive={new Color(accent)}
                emissiveIntensity={steps[index] === selected ? 0.6 : 0.12}
                shininess={45}
              />
            </mesh>
            {active !== "modules" && (
              <Html
                position={[0, -0.4, 0.1]}
                center
                distanceFactor={10}
                zIndexRange={[10, 0]}
              >
                <button
                  className="scene-node"
                  aria-label={`Trace ${steps[index]}`}
                  aria-pressed={steps[index] === selected}
                  onFocus={() => onSelect(steps[index])}
                  onPointerEnter={() => onSelect(steps[index])}
                  onClick={() => onSelect(steps[index])}
                >
                  {mobile ? String(index + 1).padStart(2, "0") : steps[index]}
                </button>
              </Html>
            )}
            {index < pathCount - 1 && (
              <Connection
                start={position}
                end={positions[index + 1]}
                highlight={
                  steps[index] === selected || steps[index + 1] === selected
                }
                color={accent}
              />
            )}
          </group>
        ))}
      </group>
      <group ref={pulse} visible={!reduced && active === "observability"}>
        <mesh>
          <sphereGeometry args={[0.08, 8, 6]} />
          <meshBasicMaterial color={accent} />
        </mesh>
      </group>
      {active === "modules" && (
        <ProjectModules
          selected={projectSlug}
          onSelect={onProjectSelect}
          mobile={mobile}
        />
      )}
      {phase !== "digital" && (
        <group position={[0, -2.9, -1.5]}>
          <mesh>
            <cylinderGeometry args={[2.6, 2.8, 0.18, mobile ? 16 : 32]} />
            <meshPhongMaterial color="#1B2630" shininess={45} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.12, 0]}>
            <torusGeometry args={[2.4, 0.018, 4, 48]} />
            <meshBasicMaterial color={accent} />
          </mesh>
        </group>
      )}
      {phase === "mechanical" &&
        Array.from({ length: mobile ? 4 : 6 }, (_, index) => (
          <mesh
            key={index}
            position={[
              Math.cos((index * Math.PI) / 3) * 1.7,
              Math.sin((index * Math.PI) / 3) * 1.7,
              -1.5,
            ]}
            rotation={[0, 0, (index * Math.PI) / 3]}
          >
            <boxGeometry args={[0.5, 0.8, 0.3]} />
            <meshPhongMaterial color="#1B2630" shininess={45} />
          </mesh>
        ))}
      <gridHelper
        args={[20, mobile ? 12 : 24, "#1B2630", "#0C1623"]}
        position={[0, -3.5, 0]}
      />
    </>
  );
}
function Connection({
  start,
  end,
  highlight,
  color,
}: {
  start: Vector3;
  end: Vector3;
  highlight: boolean;
  color: string;
}) {
  const points = useMemo(
    () =>
      new Float32Array([
        0,
        0,
        0,
        end.x - start.x,
        end.y - start.y,
        end.z - start.z,
      ]),
    [start, end],
  );
  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color={highlight ? color : "#254239"}
        transparent
        opacity={highlight ? 0.9 : 0.35}
      />
    </lineSegments>
  );
}
