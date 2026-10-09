import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, Vector3 } from "three";
import type { SceneProps } from "./SceneHost";
import BinaryField from "./BinaryField";
import DigitalSystem from "./DigitalSystem";
import MechanicalAssembly from "./MechanicalAssembly";
import CommandSurface from "./CommandSurface";
import ProjectModules from "./ProjectModules";
import SystemArchitecture from "./SystemArchitecture";
import { NodeLabel, Paths, Readout } from "./scenePrimitives";
export default function LegacyEngineeringScene(props: SceneProps) {
  const {
    active,
    phase,
    mobile,
    visible,
    reduced,
    selected,
    steps,
    onSelect,
    skillCategory,
  } = props;
  const time = useRef(reduced ? 2 : 0),
    slowFrames = useRef(0);
  const { invalidate, camera, pointer, viewport, size, setDpr } = useThree();
  const fittedDistance = useMemo(() => {
    const halfFov = (Math.PI * 40) / 360,
      aspect = size.width / Math.max(1, size.height);
    return (
      Math.max(
        (mobile ? 1.6 : 3.1) / Math.tan(halfFov),
        4 / (Math.tan(halfFov) * aspect),
      ) + 1.2
    );
  }, [size.width, size.height, mobile]);
  useEffect(() => {
    camera.position.set(0, 0, fittedDistance);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, fittedDistance, invalidate]);
  useEffect(() => {
    time.current = reduced ? 2 : 0;
    if (visible) invalidate();
  }, [active, props.projectSlug, skillCategory, reduced, visible, invalidate]);
  useEffect(() => {
    if (visible) invalidate();
  }, [selected, visible, invalidate]);
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
  useFrame((_, delta) => {
    if (reduced || !visible) return;
    const dt = Math.min(delta, 0.05);
    time.current += dt;
    if (
      delta > 1 / 35 &&
      delta < 0.15 &&
      viewport.dpr > 1 &&
      ++slowFrames.current > 20
    )
      setDpr(1);
    if (time.current < 1.8 || active === "intro" || active === "observability")
      invalidate();
    camera.position.set(
      MathUtils.damp(
        camera.position.x,
        active === "intro" && !mobile ? pointer.x * 0.12 : 0,
        5,
        dt,
      ),
      MathUtils.damp(
        camera.position.y,
        active === "intro" && !mobile ? pointer.y * 0.06 : 0,
        5,
        dt,
      ),
      fittedDistance,
    );
    camera.lookAt(0, 0, 0);
  });
  const diagram = [
    "case-studies",
    "observability",
    "delivery",
    "diagnostic",
    "components",
  ].includes(active);
  const standbyPaths = useMemo(
    () => [
      [new Vector3(-1.8, -0.2, -0.8), new Vector3(-0.6, -0.2, -0.8)],
      [new Vector3(0.6, -0.2, -0.8), new Vector3(1.8, -0.2, -0.8)],
    ],
    [],
  );
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
      <ambientLight intensity={0.75} color="#8CA0AD" />
      <directionalLight position={[3, 4, 6]} intensity={1.8} color="#C5D3DE" />
      <directionalLight
        position={[-3, 1, -2]}
        intensity={1.1}
        color="#49677D"
      />
      <BinaryField
        mobile={mobile}
        reduced={reduced}
        active={phase === "digital"}
      />
      {active !== "observability" &&
        (phase === "digital" || phase === "mechanical") && (
          <DigitalSystem
            active={active}
            phase={phase}
            mobile={mobile}
            selected={selected}
            steps={steps}
            onSelect={onSelect}
            time={time}
          />
        )}
      <MechanicalAssembly
        hideCore={active === "case-studies" && (props.connectedCount ?? 0) > 6}
        phase={phase}
        active={active}
        mobile={mobile}
        reduced={reduced}
        visible={visible}
      />
      {phase !== "digital" && (
        <CommandSurface mobile={mobile} standby={active === "standby"} />
      )}
      {active === "infrastructure" && (
        <group>
          {(mobile
            ? ["Cloud", "Delivery", "Reliability"]
            : ["Cloud", "Delivery", "Services", "Observability", "Reliability"]
          ).map((label, i, labels) => (
            <group
              key={label}
              position={[
                (i - (labels.length - 1) / 2) * (mobile ? 1.8 : 1.5),
                mobile ? -1.12 : -2.15,
                0.45,
              ]}
            >
              <NodeLabel
                mobile={mobile}
                label={label}
                selected={selected === label}
                onSelect={() => onSelect(label)}
                position={[0, 0, 0]}
              />
            </group>
          ))}
        </group>
      )}
      {active === "modules" && (
        <ProjectModules
          selected={props.projectSlug}
          onSelect={props.onProjectSelect}
          mobile={mobile}
          reduced={reduced}
        />
      )}
      {diagram && (
        <SystemArchitecture
          active={active}
          steps={steps}
          primaryCount={props.connectedCount ?? steps.length}
          mobile={mobile}
          selected={selected}
          onSelect={onSelect}
          time={time}
          reduced={reduced}
          skillCategory={skillCategory}
        />
      )}
      {active === "observability" && !mobile && (
        <group position={[0, -1.65, -1.2]}>
          <mesh>
            <icosahedronGeometry args={[0.4, 1]} />
            <meshBasicMaterial color="#254D35" wireframe />
          </mesh>
        </group>
      )}
      {active === "standby" && (
        <Paths paths={standbyPaths} color="#36515D" opacity={0.4} />
      )}
      {!mobile && (
        <gridHelper
          args={[12, 20, "#15242C", "#0D1921"]}
          position={[0, -2.1, -2]}
        />
      )}
      {active === "standby" && (
        <group position={[0, mobile ? 0.7 : 1.25, -0.2]}>
          <Readout label="SYSTEM STANDBY" />
        </group>
      )}
    </>
  );
}
