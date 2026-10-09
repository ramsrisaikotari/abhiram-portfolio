import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { MathUtils, type DirectionalLight } from "three";
import type { SceneProps } from "../SceneHost";
import { useGuardianModel } from "./GuardianModel";
import HeroEnvironment from "./HeroEnvironment";
import HeroBinary from "./HeroBinary";
import { applyGuardianPose } from "./guardianTimeline";
import HeroTargeting from "./HeroTargeting";

const smooth = (time: number, start: number, length: number) => {
  const x = MathUtils.clamp((time - start) / length, 0, 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
};
export default function CinematicHero({
  mobile,
  reduced,
  visible,
  selected,
}: SceneProps) {
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
    invalidate();
  }, [camera, size.width, size.height, mobile, invalidate]);
  useEffect(() => {
    time.current = reduced ? 3 : 0;
    invalidate();
  }, [asset, reduced, invalidate]);
  useEffect(() => {
    if (visible) invalidate();
  }, [visible, selected, invalidate]);
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
      if (keyLight.current)
        keyLight.current.intensity = 0.25 + 2.55 * smooth(t, 0.15, 1.5);
      if (rimLight.current)
        rimLight.current.intensity = 0.35 + 3.45 * smooth(t, 0.25, 1.45);
      applyGuardianPose(asset, t);
    }
    if (!reduced) {
      const aspect = size.width / Math.max(1, size.height);
      const distance = mobile ? 6.6 : Math.max(10.6, 10.3 / aspect);
      camera.position.set(
        MathUtils.damp(
          camera.position.x,
          (mobile ? 2.5 : (5 * distance) / 10.6) +
            (!mobile ? pointer.x * 0.16 : 0),
          4,
          dt,
        ),
        MathUtils.damp(
          camera.position.y,
          (mobile ? 1.35 : (2.7 * distance) / 10.6) +
            (!mobile ? pointer.y * 0.08 : 0),
          4,
          dt,
        ),
        distance,
      );
      camera.lookAt(0, mobile ? 0.4 : 0, 0);
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
      <HeroBinary mobile={mobile} reduced={reduced} visible={visible} />
      {!mobile && <HeroTargeting />}
      {asset && <primitive object={asset.scene} dispose={null} />}
      {asset && (
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
          {!mobile && (
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
