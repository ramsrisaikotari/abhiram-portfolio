import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { MathUtils, Group, Vector3, type DirectionalLight } from "three";
import type { SceneProps } from "../SceneHost";
import { useGuardianModel } from "./GuardianModel";
import HeroEnvironment from "./HeroEnvironment";
import HeroBinary from "./HeroBinary";
import { applyGuardianPose } from "./guardianTimeline";
import HeroTargeting from "./HeroTargeting";
import OperationalSystems from "../cinematic/OperationalSystems";
import { machinePlacement } from "../cinematic/modeComposition";
import { settleOperationalPose } from "../cinematic/operationalPose";

const smooth = (time: number, start: number, length: number) => {
  const x = MathUtils.clamp((time - start) / length, 0, 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
};
export default function CinematicHero(props: SceneProps) {
  const { mobile, reduced, visible, selected, active } = props;
  const intro = active === "intro";
  const machine = useRef<Group>(null);
  const transition = useRef(0);
  const aim = useRef(new Vector3());
  const placement = machinePlacement(active, mobile);
  const { asset, error } = useGuardianModel();
  const { camera, size, invalidate, pointer, setDpr, viewport } = useThree();
  const keyLight = useRef<DirectionalLight>(null),
    rimLight = useRef<DirectionalLight>(null);
  const time = useRef(0),
    slow = useRef(0);
  useEffect(() => {
    // Tight, lower mobile view; desktop shows the entire infrastructure chassis.
    const aspect = size.width / Math.max(1, size.height);
    const distance = mobile ? 6.6 : Math.max(10.6, 10.3 / aspect);
    camera.position.set(
      mobile ? 2.5 : (5 * distance) / 10.6,
      mobile ? 1.35 : (2.7 * distance) / 10.6,
      distance,
    );
    camera.lookAt(0, mobile ? 0.4 : 0, 0);
    camera.updateProjectionMatrix();
    transition.current = 0;
    invalidate();
  }, [camera, size.width, size.height, mobile, invalidate]);
  useEffect(() => {
    time.current = reduced ? 3 : 0;
    invalidate();
  }, [asset, reduced, invalidate]);
  useEffect(() => {
    if (visible) invalidate();
    transition.current = 0;
  }, [
    visible,
    selected,
    active,
    props.projectSlug,
    props.skillCategory,
    invalidate,
  ]);
  useEffect(() => {
    if (active !== "standby" || reduced || !visible) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) invalidate();
    }, 100);
    return () => window.clearInterval(timer);
  }, [active, reduced, visible, invalidate]);
  useEffect(() => {
    if (mobile || reduced) return;
    const move = (event: PointerEvent) => {
      pointer.set(
        MathUtils.clamp((event.clientX / innerWidth) * 2 - 1, -1, 1),
        MathUtils.clamp(1 - (event.clientY / innerHeight) * 2, -1, 1),
      );
      invalidate();
    };
    document.addEventListener("pointermove", move, { passive: true });
    return () => document.removeEventListener("pointermove", move);
  }, [mobile, reduced, pointer, invalidate]);
  useFrame((_, delta) => {
    if (!visible || document.hidden) return;
    const dt = Math.min(delta, 0.05);
    // Count elapsed activation time separately from the bounded damping step.
    // Slow devices must still settle and stop invalidating on schedule.
    transition.current += Math.min(delta, 0.25);
    if (!reduced) time.current += Math.min(delta, 0.25);
    if (
      delta > 1 / 35 &&
      delta < 0.15 &&
      viewport.dpr > 1 &&
      ++slow.current > 20
    )
      setDpr(1);
    if (asset) {
      const t = time.current;
      if (intro) {
        if (keyLight.current)
          keyLight.current.intensity = 0.25 + 2.55 * smooth(t, 0.15, 1.5);
        if (rimLight.current)
          rimLight.current.intensity = 0.35 + 3.45 * smooth(t, 0.25, 1.45);
        applyGuardianPose(asset, t);
      } else {
        settleOperationalPose(asset, active, dt, reduced);
        if (keyLight.current) {
          const target =
            active === "standby" ? 1.5 : active === "diagnostic" ? 2 : 2.8;
          keyLight.current.intensity = reduced
            ? target
            : MathUtils.damp(keyLight.current.intensity, target, 6, dt);
        }
        if (rimLight.current) {
          const target = active === "standby" ? 2 : 3.8;
          rimLight.current.intensity = reduced
            ? target
            : MathUtils.damp(rimLight.current.intensity, target, 6, dt);
        }
      }
      if (machine.current) {
        const blend = reduced ? 1 : 1 - Math.exp(-dt * 6);
        machine.current.position.lerp(placement.position, blend);
        machine.current.scale.lerp(
          new Vector3().setScalar(placement.scale),
          blend,
        );
      }
    }
    {
      const aspect = size.width / Math.max(1, size.height);
      const distance = mobile ? 6.6 : Math.max(10.6, 10.3 / aspect);
      // The hero camera stays exact. Operational projections use a nearly
      // frontal, elevated bay view so their sequential labels remain readable.
      const wide = [
        "modules",
        "case-studies",
        "observability",
        "components",
      ].includes(active);
      const target = new Vector3(
        intro
          ? mobile
            ? 2.5
            : (5 * distance) / 10.6
          : mobile
            ? 0.1
            : active === "delivery"
              ? 0.8
              : active === "observability"
                ? -1.1
                : active === "standby"
                  ? 3
                  : active === "infrastructure"
                    ? 2.5
                    : active === "impact"
                      ? 2.8
                      : 1.5,
        intro
          ? mobile
            ? 1.35
            : (2.7 * distance) / 10.6
          : mobile
            ? 2
            : active === "delivery"
              ? 1.6
              : active === "standby"
                ? 2.4
                : active === "infrastructure"
                  ? 1.7
                  : 2,
        intro
          ? distance
          : mobile
            ? 6.3
            : Math.max(
                active === "standby" ? 14.2 : wide ? 12.8 : 12,
                11.6 / aspect,
              ),
      );
      if (!mobile && !reduced) {
        target.x += pointer.x * 0.16;
        target.y += pointer.y * 0.08;
      }
      camera.position.lerp(target, reduced ? 1 : 1 - Math.exp(-dt * 4));
      aim.current.lerp(
        new Vector3(0, intro ? (mobile ? 0.4 : 0) : 0.1, intro ? 0 : 0.4),
        reduced ? 1 : 1 - Math.exp(-dt * 4),
      );
      camera.lookAt(aim.current);
      if (
        !reduced &&
        (intro || transition.current < 1.4 || active === "observability")
      )
        invalidate();
    }
  });
  if (error) throw new Error("Hero model unavailable");
  return (
    <>
      <color attach="background" args={["#03090c"]} />
      <fog attach="fog" args={["#03090c", 12, 32]} />
      <ambientLight intensity={0.16} color="#7b8d96" />
      <directionalLight
        ref={keyLight}
        position={[-3, 6, 5]}
        intensity={2.8}
        color="#a5c4d2"
      />
      <directionalLight
        ref={rimLight}
        position={[4, 3, -2]}
        intensity={3.8}
        color="#4c99b5"
      />
      <pointLight
        position={[-2, -0.4, 1]}
        intensity={3.5}
        distance={6}
        decay={2}
        color="#469272"
      />
      <pointLight
        position={[3, -1.7, 1]}
        intensity={3}
        distance={4}
        decay={2}
        color="#b5894c"
      />
      <HeroEnvironment mobile={mobile} />
      <HeroBinary
        mobile={mobile}
        reduced={reduced}
        visible={visible}
        mode={active}
      />
      {intro && !mobile && <HeroTargeting />}
      {asset && (
        <group ref={machine}>
          <primitive object={asset.scene} dispose={null} />
        </group>
      )}
      {asset && !intro && <OperationalSystems {...props} />}
      {asset && intro && (
        <group>
          {mobile ? (
            <Html
              fullscreen
              position={[0, 0.4, 0]}
              style={{ pointerEvents: "none" }}
            >
              <span className="guardian-hud scene-readout guardian-mobile-hud">
                SYSTEM ONLINE
              </span>
            </Html>
          ) : (
            <Html
              center
              position={[0.1, 3.08, 0.1]}
              style={{ pointerEvents: "none" }}
            >
              <span className="guardian-hud scene-readout">SYSTEM ONLINE</span>
            </Html>
          )}
          {intro && !mobile && (
            <Html
              center
              position={[-2.65, -1.48, 0.15]}
              style={{ pointerEvents: "none" }}
            >
              <span className="guardian-hud scene-readout">
                AWS / CLOUD SYSTEMS
              </span>
            </Html>
          )}
        </group>
      )}
    </>
  );
}
