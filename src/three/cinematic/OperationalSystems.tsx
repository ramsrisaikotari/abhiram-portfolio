import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  BoxGeometry,
  BufferGeometry,
  Color,
  InstancedMesh,
  MathUtils,
  Matrix4,
  Mesh,
  Object3D,
  Quaternion,
  Vector3,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { SceneProps } from "../SceneHost";
import { NodeLabel } from "../scenePrimitives";
import ProjectionPaths from "./ProjectionPaths";
import {
  composeStations,
  machinePlacement,
  type Station,
} from "./modeComposition";
import { buildModules, poseBatch } from "./MechanicalModules";

function deckGeometry() {
  const parts: BufferGeometry[] = [];
  const box = (p: number[], scale: number[]) =>
    parts.push(
      new BoxGeometry(...(scale as [number, number, number]))
        .toNonIndexed()
        .translate(...(p as [number, number, number])),
    );
  box([0, -2.12, 1], [8.2, 0.16, 5.2]);
  for (const side of [-1, 1]) {
    box([side * 3.5, -1.96, 1], [0.38, 0.22, 4.8]);
    box([side * 3.2, -1.83, 1.1], [0.12, 0.15, 4.3]);
    for (const z of [-0.7, 1, 2.7])
      box([side * 3.6, -1.56, z], [0.3, 0.62, 0.24]);
  }
  box([0, -1.94, -0.8], [5.5, 0.18, 0.4]);
  const geometry = mergeGeometries(parts)!;
  parts.forEach((p) => p.dispose());
  return geometry;
}
export default function OperationalSystems(props: SceneProps) {
  const { active, mobile, reduced, visible, onSelect, onProjectSelect } = props;
  const stations = useMemo(() => composeStations(props), [props]);
  // Retain the last deployed attachment layout while standby retracts it.
  const [lastStations, setLastStations] = useState(stations);
  if (stations.length && lastStations !== stations) setLastStations(stations);
  const retracting = active === "standby";
  const actors = retracting ? lastStations : stations;
  const batch = useMemo(
    () => buildModules(actors, active === "case-studies"),
    [actors, active],
  );
  const deck = useMemo(() => deckGeometry(), []);
  useEffect(
    () => () => {
      batch.metal.geometry.dispose();
      batch.lamps.geometry.dispose();
    },
    [batch],
  );
  useEffect(() => () => deck.dispose(), [deck]);
  const braces = useRef<InstancedMesh>(null),
    packet = useRef<Mesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const transforms = useMemo(
    () => actors.map(() => [new Matrix4(), new Matrix4(), new Matrix4()]),
    [actors],
  );
  const colors = useMemo(() => actors.map(() => new Color()), [actors]);
  const depths = useRef(new Float32Array(16)),
    openings = useRef(new Float32Array(16));
  const clock = useRef(0),
    deployClock = useRef(0),
    lastMode = useRef(active);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (lastMode.current !== active || active !== "modules" || reduced)
      deployClock.current = reduced ? 3 : 0;
    lastMode.current = active;
  }, [active, props.projectSlug, props.skillCategory, reduced]);
  useEffect(() => {
    clock.current = reduced ? 4 : 0;
    invalidate();
  }, [
    active,
    props.selected,
    props.projectSlug,
    props.skillCategory,
    reduced,
    invalidate,
  ]);
  const main = stations.filter((s) => s.primary);
  const flow = [
    "case-studies",
    "observability",
    "delivery",
    "diagnostic",
  ].includes(active);
  const core = useMemo(() => {
    const p = machinePlacement(active, mobile);
    return p.position.add(new Vector3(0, 0.45 * p.scale, 0.25 * p.scale));
  }, [active, mobile]);
  const primaryPaths = useMemo(() => {
    if (flow) {
      const paths = main
        .slice(1)
        .map((s, i) => [
          main[i].position.clone().add(new Vector3(0, -0.12, 0.35)),
          s.position.clone().add(new Vector3(0, -0.12, 0.35)),
        ]);
      if (active === "case-studies" && !mobile)
        paths.push([
          new Vector3(1.35, 2.95, 1.15),
          new Vector3(3.7, 2.95, 1.15),
          new Vector3(3.7, -0.85, 1.15),
          new Vector3(1.35, -0.85, 1.15),
          new Vector3(1.35, 2.95, 1.15),
        ]);
      return paths;
    }
    return stations
      .filter((s) => s.selected)
      .map((s) => [
        stations.find((s) => s.anchor)?.position ?? core,
        new Vector3(s.position.x * 0.65, -0.35, 0.5),
        s.position,
      ]);
  }, [flow, main, stations, core, active, mobile]);
  // Side diagnostics dock to the Guardian; they never form a second flow row.
  const secondaryPaths = useMemo(
    () => stations.filter((s) => !s.primary).map((s) => [core, s.position]),
    [stations, core],
  );
  useFrame((_, delta) => {
    if (!visible || document.hidden) return;
    const dt = Math.min(delta, 0.05);
    if (!reduced) {
      clock.current += Math.min(delta, 0.25);
      deployClock.current += Math.min(delta, 0.25);
    }
    const t = clock.current;
    actors.forEach((station, i) => {
      const deploy = retracting
        ? reduced
          ? 0
          : 1 - MathUtils.smoothstep(t, 0.05, 0.9)
        : reduced
          ? 1
          : MathUtils.smoothstep(
              deployClock.current,
              0.055 * i,
              0.65 + 0.055 * i,
            );
      const targetDepth =
        station.position.z +
        (station.selected ? (active === "diagnostic" ? 0.48 : 0.24) : -0.18);
      depths.current[i] = reduced
        ? targetDepth
        : MathUtils.damp(depths.current[i], targetDepth, 9, dt);
      openings.current[i] = reduced
        ? station.selected
          ? 1
          : 0.1
        : MathUtils.damp(
            openings.current[i],
            station.selected ? 1 : 0.1,
            7,
            dt,
          );
      const opening = openings.current[i];
      dummy.position.copy(station.position);
      dummy.position.y -= (1 - deploy) * (retracting ? 1.6 : 0.65) + 0.12;
      dummy.position.z = depths.current[i];
      dummy.rotation.set(
        -0.24 * (1 - deploy),
        active === "modules" ? -Math.sign(station.position.x) * 0.12 : 0,
        0,
      );
      dummy.scale.setScalar(
        station.scale * (retracting ? Math.max(0.01, deploy) : 1),
      );
      dummy.updateMatrix();
      transforms[i][0].copy(dummy.matrix);
      // A hinged hood and extending instrument create distinct active silhouettes.
      const hinge = new Matrix4()
        .makeTranslation(0, 0.3, -0.12)
        .multiply(
          new Matrix4().makeRotationX(
            -opening * (station.form === "console" ? 0.68 : 0.28),
          ),
        )
        .multiply(
          new Matrix4().makeTranslation(0, -0.3 + opening * 0.07, 0.12),
        );
      transforms[i][1].copy(dummy.matrix).multiply(hinge);
      transforms[i][2]
        .copy(dummy.matrix)
        .multiply(
          new Matrix4().makeTranslation(0, opening * 0.06, opening * 0.13),
        );
      colors[i].set(
        active === "diagnostic" && station.label === "Database"
          ? "#90654e"
          : active === "observability"
            ? "#4c927f"
            : active === "infrastructure" || active === "delivery"
              ? "#4d86a4"
              : "#4c97aa",
      );
      colors[i].multiplyScalar(
        station.selected ? 1 : station.primary ? 0.36 : 0.2,
      );
      const base =
        active === "observability" || active === "diagnostic"
          ? new Vector3(
              station.position.x,
              station.primary ? station.position.y - 0.52 : -1.15,
              station.position.z - 0.25,
            )
          : flow
            ? new Vector3(
                station.position.x * 0.9,
                -1.93,
                station.position.z - 0.5,
              )
            : core
                .clone()
                .add(
                  new Vector3(Math.sign(station.position.x) * 0.7, -0.5, -0.2),
                );
      const tip = dummy.position.clone().add(new Vector3(0, -0.38, -0.1));
      const direction = tip.clone().sub(base);
      dummy.position.copy(base).add(tip).multiplyScalar(0.5);
      dummy.quaternion.copy(
        new Quaternion().setFromUnitVectors(
          new Vector3(0, 1, 0),
          direction.clone().normalize(),
        ),
      );
      dummy.scale.set(0.06, direction.length(), 0.06);
      dummy.updateMatrix();
      braces.current?.setMatrixAt(i, dummy.matrix);
    });
    poseBatch(batch.metal, transforms);
    poseBatch(batch.lamps, transforms, colors);
    if (flow && !(active === "case-studies" && !mobile))
      main.slice(1).forEach((station, i) => {
        const a = main[i].position.clone().add(new Vector3(0, -0.6, -0.2)),
          b = station.position.clone().add(new Vector3(0, -0.6, -0.2)),
          d = b.clone().sub(a);
        const extension = reduced
          ? 1
          : MathUtils.smoothstep(
              deployClock.current,
              0.07 * i,
              0.65 + 0.07 * i,
            );
        dummy.position.copy(a).addScaledVector(d, extension * 0.5);
        dummy.quaternion.copy(
          new Quaternion().setFromUnitVectors(
            new Vector3(0, 1, 0),
            d.clone().normalize(),
          ),
        );
        dummy.scale.set(
          active === "delivery" ? 0.095 : 0.028,
          d.length() * extension,
          active === "delivery" ? 0.095 : 0.028,
        );
        dummy.updateMatrix();
        braces.current?.setMatrixAt(actors.length + i, dummy.matrix);
      });
    if (braces.current) {
      braces.current.count =
        active === "case-studies" && !mobile
          ? 0
          : actors.length + (flow ? Math.max(0, main.length - 1) : 0);
      braces.current.visible = !(retracting && (reduced || t > 1.05));
      braces.current.instanceMatrix.needsUpdate = true;
    }
    if (packet.current) {
      // Observability has one quiet packet at a time; deployment/request runs once.
      const time =
        active === "observability"
          ? ((deployClock.current - 1) % 4) + 1
          : deployClock.current;
      const progress = MathUtils.clamp((time - 1) / 1.35, 0, 1);
      packet.current.visible =
        !reduced && flow && main.length > 1 && time > 1 && time < 2.35;
      if (main.length > 1) {
        const segment = progress * (main.length - 1),
          i = Math.min(main.length - 2, Math.floor(segment));
        packet.current.position
          .copy(main[i].position)
          .lerp(main[i + 1].position, segment - i)
          .add(new Vector3(0, -0.12, 0.38));
      }
    }
    if (!reduced && t < (flow ? 2.5 : 1.4)) invalidate();
  });
  return (
    <group>
      <mesh geometry={deck}>
        <meshPhongMaterial color="#121e26" shininess={14} />
      </mesh>
      {active === "case-studies" && !mobile && (
        <mesh position={[2.525, 1.05, 1.1]}>
          <planeGeometry args={[2.35, 3.8]} />
          <meshBasicMaterial
            color="#337b8f"
            transparent
            opacity={0.055}
            depthWrite={false}
          />
        </mesh>
      )}
      {actors.length > 0 && (
        <>
          <mesh
            geometry={batch.metal.geometry}
            frustumCulled={false}
            visible={!retracting || !reduced}
          >
            {active === "case-studies" ? (
              <meshBasicMaterial
                vertexColors
                transparent
                opacity={0.42}
                depthWrite={false}
              />
            ) : (
              <meshPhongMaterial
                vertexColors
                specular="#3e5661"
                shininess={22}
              />
            )}
          </mesh>
          <mesh
            geometry={batch.lamps.geometry}
            frustumCulled={false}
            visible={!retracting || !reduced}
          >
            <meshBasicMaterial vertexColors />
          </mesh>
          <instancedMesh
            ref={braces}
            args={[undefined, undefined, 32]}
            frustumCulled={false}
          >
            <cylinderGeometry args={[1, 1, 1, 6]} />
            <meshPhongMaterial color="#263b48" shininess={18} />
          </instancedMesh>
          <ProjectionPaths
            primary={primaryPaths}
            supporting={secondaryPaths}
            selected={stations.find((s) => s.selected)?.position}
          />
          <mesh ref={packet} visible={false}>
            <sphereGeometry args={[0.06, 8, 5]} />
            <meshBasicMaterial
              color={active === "observability" ? "#78b99c" : "#8abeca"}
            />
          </mesh>
          {stations
            .filter((station) => !station.anchor)
            .map((station) => (
              <StationLabel
                key={station.label}
                station={station}
                props={props}
                onSelect={() =>
                  station.project
                    ? onProjectSelect(station.project)
                    : onSelect(station.label)
                }
              />
            ))}
        </>
      )}
    </group>
  );
}
function StationLabel({
  station,
  props,
  onSelect,
}: {
  station: Station;
  props: SceneProps;
  onSelect: () => void;
}) {
  return (
    <NodeLabel
      label={station.label}
      display={station.selected ? station.display : ""}
      project={!!station.project}
      selected={station.selected}
      onSelect={onSelect}
      mobile={props.mobile}
      className={station.selected ? "scene-active-module" : "scene-module-port"}
      position={[
        station.position.x,
        station.position.y +
          (props.mobile && props.active === "modules"
            ? 0.12
            : props.mobile
              ? -0.35
              : props.active === "modules"
                ? -0.62
                : -0.45),
        station.position.z + (props.mobile ? 0.15 : 0.6),
      ]}
    />
  );
}
