import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, InstancedMesh, Object3D, Vector3 } from "three";
import { NodeLabel, Paths, PlateGeometry } from "./scenePrimitives";
import { ease, steel } from "./sceneUtils";
import { flowLayout, type FlowNode } from "./flowLayout";
interface Props {
  active: string;
  steps: string[];
  primaryCount: number;
  mobile: boolean;
  selected: string;
  onSelect: (value: string) => void;
  time: React.RefObject<number>;
  reduced: boolean;
  skillCategory?: string | null;
}
export default function SystemArchitecture(props: Props) {
  const {
    active,
    steps,
    primaryCount,
    mobile,
    selected,
    time,
    reduced,
    skillCategory,
    onSelect,
  } = props;
  const packet = useRef<Group>(null);
  const nodes = useMemo(
    () =>
      flowLayout(active, steps, primaryCount, mobile, selected, skillCategory),
    [active, steps, primaryCount, mobile, selected, skillCategory],
  );
  const primary = useMemo(
    () => nodes.filter((node) => !node.supporting),
    [nodes],
  );
  const path = useMemo(() => primary.map((node) => node.position), [primary]);
  const paths = useMemo(
    () =>
      active === "components"
        ? nodes.map((node) => [
            new Vector3(0, mobile ? 0.75 : 2.2, -0.1),
            node.position,
          ])
        : [path],
    [active, nodes, mobile, path],
  );
  const arrows = useMemo(() => {
    const dummy = new Object3D();
    return active === "components"
      ? []
      : path.slice(1).map((point, i) => {
          const start = path[i];
          dummy.position.copy(start).lerp(point, 0.56);
          dummy.rotation.set(
            0,
            0,
            Math.atan2(point.y - start.y, point.x - start.x) - Math.PI / 2,
          );
          dummy.updateMatrix();
          return dummy.matrix.clone();
        });
  }, [active, path]);
  useFrame(() => {
    if (!packet.current) return;
    packet.current.visible =
      !reduced &&
      path.length > 1 &&
      (active === "observability" ||
        ((active === "delivery" || active === "case-studies") &&
          time.current < 1.7));
    const progress =
        active === "observability"
          ? (time.current % 4) / 4
          : Math.min(1, time.current / 1.6),
      offset = progress * (path.length - 1),
      i = Math.min(path.length - 2, Math.floor(offset));
    if (i >= 0)
      packet.current.position.copy(path[i]).lerp(path[i + 1], offset - i);
  });
  return (
    <group>
      {active === "delivery" && (
        <Rail path={path} time={time} reduced={reduced} />
      )}
      <Paths
        paths={paths}
        color={active === "observability" ? "#548A63" : steel.cyan}
        opacity={0.65}
      />
      {arrows.length > 0 && (
        <instancedMesh
          args={[undefined, undefined, arrows.length]}
          ref={(mesh: InstancedMesh | null) => {
            if (mesh) {
              arrows.forEach((matrix, i) => mesh.setMatrixAt(i, matrix));
              mesh.instanceMatrix.needsUpdate = true;
            }
          }}
        >
          <coneGeometry args={[0.07, 0.15, 3]} />
          <meshBasicMaterial
            color={active === "observability" ? "#548A63" : steel.cyan}
          />
        </instancedMesh>
      )}
      {nodes.map((node, i) => (
        <ArchitectureNode
          key={node.label}
          node={node}
          index={i}
          active={active}
          selected={selected}
          onSelect={onSelect}
          time={time}
          reduced={reduced}
          mobile={mobile}
        />
      ))}
      {active === "components" && (
        <group position={[0, mobile ? 0.78 : 2.2, -0.1]}>
          <mesh>
            <cylinderGeometry args={[0.12, 0.12, 0.07, 12]} />
            <meshBasicMaterial color={steel.cyan} />
          </mesh>
          <NodeLabel
            mobile={mobile}
            size="category"
            label={skillCategory ?? "Skills"}
            display={skillCategory ?? "Skills"}
            selected={false}
            position={[0, 0.2, 0]}
            onSelect={() => onSelect(skillCategory ?? steps[0])}
          />
        </group>
      )}
      <group ref={packet} visible={false}>
        <mesh>
          <sphereGeometry args={[0.055, 8, 6]} />
          <meshBasicMaterial
            color={active === "observability" ? "#7CB68A" : "#74AEC3"}
          />
        </mesh>
      </group>
    </group>
  );
}
function ArchitectureNode({
  node,
  index,
  active,
  selected,
  onSelect,
  time,
  reduced,
  mobile,
}: {
  node: FlowNode;
  index: number;
  active: string;
  selected: string;
  onSelect: (value: string) => void;
  time: React.RefObject<number>;
  reduced: boolean;
  mobile: boolean;
}) {
  const group = useRef<Group>(null),
    focus = node.label === selected;
  const diagnostic = active === "diagnostic",
    color =
      diagnostic && node.label === "Database"
        ? "#865656"
        : diagnostic
          ? "#5E8D7A"
          : focus
            ? steel.cyan
            : node.supporting
              ? "#45616D"
              : "#527889";
  useFrame(() => {
    if (!group.current) return;
    const dock = reduced
      ? 1
      : ease(
          time.current,
          active === "delivery" ? index * 0.09 : index * 0.025,
          active === "delivery" ? 0.4 : 0.55,
        );
    group.current.position.copy(node.position);
    group.current.position.z +=
      (1 - dock) * (active === "delivery" ? 0.75 : 0.25);
    group.current.position.y +=
      (1 - dock) * (active === "delivery" ? 0.4 : 0.1);
    group.current.rotation.x = (1 - dock) * -0.55;
  });
  return (
    <group
      ref={group}
      position={node.position}
      scale={node.supporting ? 0.75 : 1}
    >
      <mesh>
        <PlateGeometry width={0.7} height={0.32} depth={0.12} />
        <meshPhongMaterial
          color={focus ? "#354B58" : node.supporting ? steel.dark : steel.body}
          shininess={node.supporting ? 12 : 28}
        />
      </mesh>
      <mesh position={[0, 0.13, 0.155]}>
        <boxGeometry args={[focus ? 0.5 : 0.32, 0.025, 0.02]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <NodeLabel
        mobile={mobile}
        size={active === "components" ? "technology" : undefined}
        label={node.label}
        selected={focus}
        onSelect={() => onSelect(node.label)}
        position={[0, -0.23, 0.16]}
      />
    </group>
  );
}
function Rail({
  path,
  time,
  reduced,
}: {
  path: Vector3[];
  time: React.RefObject<number>;
  reduced: boolean;
}) {
  const rail = useRef<InstancedMesh>(null),
    dummy = useMemo(() => new Object3D(), []);
  useFrame(() => {
    if (!rail.current) return;
    path.slice(1).forEach((point, i) => {
      const start = path[i],
        dock = reduced ? 1 : ease(time.current, i * 0.055, 0.45);
      dummy.position.copy(start).lerp(point, 0.5);
      dummy.position.z -= 0.08 + (1 - dock) * 0.5;
      dummy.rotation.set(
        0,
        0,
        Math.atan2(point.y - start.y, point.x - start.x),
      );
      dummy.scale.set(start.distanceTo(point), 0.07, 0.14);
      dummy.updateMatrix();
      rail.current?.setMatrixAt(i, dummy.matrix);
    });
    rail.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh
      ref={rail}
      args={[undefined, undefined, Math.max(0, path.length - 1)]}
    >
      <boxGeometry />
      <meshPhongMaterial color={steel.panel} shininess={24} />
    </instancedMesh>
  );
}
