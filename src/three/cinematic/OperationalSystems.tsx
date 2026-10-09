import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  BoxGeometry,
  BufferGeometry,
  Color,
  ExtrudeGeometry,
  Group,
  InstancedMesh,
  MathUtils,
  Mesh,
  Object3D,
  Quaternion,
  Shape,
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

function stationGeometry() {
  // A stepped, open-ended service cradle: housings, actuator feet, vents and
  // hinged projector mast are batched into one reused mechanical component.
  const shape = new Shape();
  shape.moveTo(-0.39, -0.17);
  shape.lineTo(-0.28, -0.28);
  shape.lineTo(0.28, -0.28);
  shape.lineTo(0.39, -0.17);
  shape.lineTo(0.39, 0.12);
  shape.lineTo(0.23, 0.23);
  shape.lineTo(-0.23, 0.23);
  shape.lineTo(-0.39, 0.12);
  shape.closePath();
  const parts: BufferGeometry[] = [
    new ExtrudeGeometry(shape, {
      depth: 0.25,
      bevelEnabled: true,
      bevelSegments: 1,
      steps: 1,
      bevelSize: 0.025,
      bevelThickness: 0.025,
    }),
  ];
  const add = (
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
  ) => {
    parts.push(new BoxGeometry(w, h, d).toNonIndexed().translate(x, y, z));
  };
  add(0, -0.36, -0.05, 0.48, 0.1, 0.6);
  for (const side of [-1, 1]) {
    add(side * 0.28, -0.25, -0.12, 0.08, 0.25, 0.35);
    add(side * 0.32, 0.03, 0.38, 0.07, 0.22, 0.12);
    for (let i = 0; i < 3; i++)
      add(side * 0.22, -0.07 + i * 0.065, 0.29, 0.12, 0.022, 0.035);
  }
  add(0, 0.18, -0.12, 0.2, 0.3, 0.12);
  const geometry = mergeGeometries(parts)!;
  parts.forEach((p) => p.dispose());
  return geometry;
}
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
  const {
    active,
    mobile,
    reduced,
    visible,
    selected,
    onSelect,
    onProjectSelect,
  } = props;
  const stations = useMemo(() => composeStations(props), [props]);
  const previousStations = useRef<Station[]>([]);
  useEffect(() => {
    if (stations.length) previousStations.current = stations;
  }, [stations]);
  const coreOrigin = useMemo(() => {
    const placement = machinePlacement(active, mobile);
    return placement.position.add(
      new Vector3(0, 0.45 * placement.scale, 0.25 * placement.scale),
    );
  }, [active, mobile]);
  const main = stations.filter((s) => s.primary);
  const isFlow = [
    "case-studies",
    "observability",
    "delivery",
    "diagnostic",
  ].includes(active);
  const root = useRef<Group>(null),
    projections = useRef<InstancedMesh>(null),
    bodies = useRef<InstancedMesh>(null),
    lights = useRef<InstancedMesh>(null),
    braces = useRef<InstancedMesh>(null),
    packet = useRef<Mesh>(null);
  const clock = useRef(0);
  const deployClock = useRef(0);
  const previousMode = useRef(active);
  const depths = useMemo(() => new Float32Array(16), []);
  const tilts = useMemo(() => new Float32Array(16), []);
  useEffect(() => {
    if (previousMode.current !== active || active !== "modules" || reduced)
      deployClock.current = reduced ? 2 : 0;
    previousMode.current = active;
  }, [active, props.projectSlug, props.skillCategory, reduced]);
  const invalidate = useThree((s) => s.invalidate);
  const geometry = useMemo(() => stationGeometry(), []),
    deck = useMemo(() => deckGeometry(), []);
  const dummy = useMemo(() => new Object3D(), []);
  useEffect(
    () => () => {
      geometry.dispose();
      deck.dispose();
    },
    [geometry, deck],
  );
  useEffect(() => {
    clock.current = reduced ? 4 : 0;
    invalidate();
  }, [
    active,
    props.projectSlug,
    props.skillCategory,
    selected,
    reduced,
    invalidate,
  ]);
  const primaryPaths = useMemo(() => {
    if (isFlow)
      return main.slice(1).flatMap((s, i) => {
        const start = main[i].position.clone().add(new Vector3(0, -0.12, 0.45));
        const end = s.position.clone().add(new Vector3(0, -0.12, 0.45));
        const middle = start.clone().lerp(end, 0.6);
        return [
          [start, end],
          [
            middle.clone().add(new Vector3(-0.1, 0.07, 0)),
            middle,
            middle.clone().add(new Vector3(-0.1, -0.07, 0)),
          ],
        ];
      });
    const chosen = stations.filter((s) => s.selected);
    return (chosen.length ? chosen : stations.slice(0, 1)).map((s) => [
      coreOrigin.clone(),
      new Vector3(s.position.x * 0.35, 0.25, 1),
      s.position,
    ]);
  }, [stations, main, isFlow, coreOrigin]);
  const secondaryPaths = useMemo(
    () =>
      stations
        .filter((s) => !s.primary)
        .map((s) => [new Vector3(0, 0.4, 1.2), s.position]),
    [stations],
  );
  useFrame((_, delta) => {
    if (!visible || document.hidden) return;
    if (!reduced) {
      clock.current += Math.min(delta, 0.25);
      deployClock.current += Math.min(delta, 0.25);
    }
    const t = clock.current;

    const retracting = active === "standby";
    const telemetry: Station[] =
      active === "case-studies" && !mobile
        ? [-1, 1].map((side) => ({
            label: "",
            primary: false,
            selected: false,
            position: new Vector3(side * 3.3, 1.7, -3),
          }))
        : [];
    const actors = retracting
      ? previousStations.current
      : [...stations, ...telemetry];
    actors.forEach((station, i) => {
      const deploy = retracting
        ? reduced
          ? 0
          : 1 - MathUtils.smoothstep(t, 0.05, 0.9)
        : reduced
          ? 1
          : MathUtils.smoothstep(
              deployClock.current,
              0.06 * i,
              0.75 + 0.06 * i,
            );
      dummy.position.copy(station.position);
      dummy.position.y -= (1 - deploy) * (retracting ? 2 : 0.65) + 0.3;
      const desiredDepth =
        station.position.z + (station.selected ? 0.18 : -0.14);
      depths[i] = reduced
        ? desiredDepth
        : MathUtils.damp(depths[i], desiredDepth, 10, Math.min(delta, 0.05));
      tilts[i] = reduced
        ? station.selected
          ? -0.02
          : -0.13
        : MathUtils.damp(
            tilts[i],
            station.selected ? -0.02 : -0.13,
            10,
            Math.min(delta, 0.05),
          );
      dummy.position.z = depths[i];
      dummy.rotation.set(-0.35 * (1 - deploy) + tilts[i], 0, 0);
      const scale = mobile ? 0.9 : station.primary ? 0.86 : 0.62;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      bodies.current?.setMatrixAt(i, dummy.matrix);
      bodies.current?.setColorAt(
        i,
        new Color(
          station.selected
            ? "#344c59"
            : station.primary
              ? "#253640"
              : "#16252d",
        ),
      );
      dummy.position.y += 0.13;
      dummy.position.z += 0.34;
      dummy.scale.set(0.7 * scale, 0.35 * scale, 0.035);
      dummy.updateMatrix();
      lights.current?.setMatrixAt(i, dummy.matrix);
      lights.current?.setColorAt(
        i,
        new Color(
          active === "diagnostic" && station.label === "Database"
            ? "#9b6550"
            : station.selected
              ? "#69b5c8"
              : station.primary
                ? "#3a7f91"
                : "#284751",
        ),
      );
      dummy.position.y += 0.1;
      dummy.rotation.set(-0.12, 0, 0);
      dummy.scale.set(0.65 * scale, 0.32 * scale, 1);
      dummy.updateMatrix();
      projections.current?.setMatrixAt(i, dummy.matrix);
      if (projections.current) {
        const material = projections.current.material;
        if (!Array.isArray(material))
          material.opacity = 0.055 * (retracting ? deploy : 1);
      }
      // Each station is physically supported by a telescoping articulated strut.
      const base = new Vector3(
        station.position.x * 0.87,
        -1.93,
        station.position.z - 0.4,
      );
      const tip = dummy.position.clone().add(new Vector3(0, -0.3, -0.32));
      const direction = tip.clone().sub(base);
      dummy.position.copy(base).add(tip).multiplyScalar(0.5);
      dummy.quaternion.copy(
        new Quaternion().setFromUnitVectors(
          new Vector3(0, 1, 0),
          direction.clone().normalize(),
        ),
      );
      dummy.scale.set(0.055, direction.length(), 0.055);
      dummy.updateMatrix();
      braces.current?.setMatrixAt(i, dummy.matrix);
    });
    for (const mesh of [
      bodies.current,
      lights.current,
      braces.current,
      projections.current,
    ])
      if (mesh) {
        mesh.visible =
          actors.length > 0 && !(retracting && (reduced || t > 1.05));
        mesh.count =
          actors.length +
          (mesh === braces.current && isFlow
            ? Math.max(0, main.length - 1)
            : 0);
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      }
    // Deployment rail is an actual connected structural member. Segments
    // telescope sequentially, using the same metal instance batch as struts.
    if (isFlow)
      main.slice(1).forEach((station, i) => {
        const a = main[i].position.clone().add(new Vector3(0, -0.68, -0.1));
        const b = station.position.clone().add(new Vector3(0, -0.68, -0.1));
        const direction = b.clone().sub(a);
        const extension = reduced
          ? 1
          : MathUtils.smoothstep(
              deployClock.current,
              0.08 * i,
              0.65 + 0.08 * i,
            );
        dummy.position.copy(a).addScaledVector(direction, extension * 0.5);
        dummy.quaternion.copy(
          new Quaternion().setFromUnitVectors(
            new Vector3(0, 1, 0),
            direction.clone().normalize(),
          ),
        );
        dummy.scale.set(0.065, direction.length() * extension, 0.065);
        dummy.updateMatrix();
        braces.current?.setMatrixAt(actors.length + i, dummy.matrix);
      });
    if (braces.current) braces.current.instanceMatrix.needsUpdate = true;
    if (packet.current) {
      const requestTime = deployClock.current;
      const progress = MathUtils.clamp((requestTime - 1) / 1.35, 0, 1);
      packet.current.visible =
        !reduced &&
        isFlow &&
        main.length > 1 &&
        requestTime > 1 &&
        requestTime < 2.35;
      if (main.length > 1) {
        const segment = progress * (main.length - 1),
          i = Math.min(main.length - 2, Math.floor(segment));
        packet.current.position
          .copy(main[i].position)
          .lerp(main[i + 1].position, segment - i)
          .add(new Vector3(0, -0.12, 0.4));
      }
    }
    if (!reduced && t < (isFlow ? 2.5 : 1.4)) {
      invalidate();
    }
  });
  return (
    <group ref={root}>
      <mesh geometry={deck}>
        <meshPhongMaterial color="#121e26" shininess={14} />
      </mesh>
      {(stations.length > 0 || active === "standby") && (
        <>
          <instancedMesh ref={bodies} args={[geometry, undefined, 16]}>
            <meshPhongMaterial
              color="white"
              specular="#3e5661"
              shininess={22}
            />
          </instancedMesh>
          <instancedMesh ref={lights} args={[undefined, undefined, 16]}>
            <ServiceFrame />
            <meshBasicMaterial color="white" />
          </instancedMesh>
          <instancedMesh ref={braces} args={[undefined, undefined, 32]}>
            <cylinderGeometry args={[1, 1, 1, 6]} />
            <meshPhongMaterial color="#31414a" shininess={18} />
          </instancedMesh>
          <instancedMesh ref={projections} args={[undefined, undefined, 16]}>
            <planeGeometry />
            <meshBasicMaterial
              color="#4c9db3"
              transparent
              opacity={0.055}
              depthWrite={false}
            />
          </instancedMesh>
          <ProjectionPaths
            primary={primaryPaths}
            supporting={secondaryPaths}
            selected={stations.find((station) => station.selected)?.position}
          />
          <mesh ref={packet} visible={false}>
            <sphereGeometry args={[0.045, 6, 4]} />
            <meshBasicMaterial color="#8abeca" />
          </mesh>
          {stations.map((station) => (
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
      display={station.display}
      project={!!station.project}
      selected={station.selected}
      onSelect={onSelect}
      mobile={props.mobile}
      className={
        !props.mobile && (props.connectedCount ?? props.steps.length) > 5
          ? "scene-pipeline-label"
          : ""
      }
      size={
        props.active === "components"
          ? props.skillCategory
            ? "technology"
            : "category"
          : undefined
      }
      position={[
        station.position.x,
        station.position.y -
          0.28 +
          ((props.connectedCount ?? props.steps.length) > 5 && !props.mobile
            ? props.steps.indexOf(station.label) % 2
              ? -0.45
              : 0.3
            : 0),
        station.position.z + (props.mobile ? 0.12 : 0.48),
      ]}
    />
  );
}

function ServiceFrame() {
  const geometry = useMemo(() => {
    const parts = [
      [-0.5, 0, 0.04, 1],
      [0.5, 0, 0.04, 1],
      [0, -0.5, 1, 0.035],
      [0, 0.5, 1, 0.035],
    ].map(([x, y, w, h]) =>
      new BoxGeometry(w, h, 1).toNonIndexed().translate(x, y, 0),
    );
    const merged = mergeGeometries(parts)!;
    parts.forEach((p) => p.dispose());
    return merged;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <primitive object={geometry} attach="geometry" />;
}
