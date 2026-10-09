import { shortLabel, mobileLabel, steel } from "./sceneUtils";
import { useMemo } from "react";
import { Html } from "@react-three/drei";
import { Shape, Vector3 } from "three";
export function PlateGeometry({
  width = 0.9,
  height = 0.5,
  depth = 0.12,
}: {
  width?: number;
  height?: number;
  depth?: number;
}) {
  const shape = useMemo(() => {
    const x = width / 2,
      y = height / 2,
      c = Math.min(width, height) * 0.12;
    const result = new Shape();
    result.moveTo(-x + c, -y);
    result.lineTo(x - c, -y);
    result.lineTo(x, -y + c);
    result.lineTo(x, y - c);
    result.lineTo(x - c, y);
    result.lineTo(-x + c, y);
    result.lineTo(-x, y - c);
    result.lineTo(-x, -y + c);
    result.closePath();
    return result;
  }, [width, height]);
  return (
    <extrudeGeometry
      args={[
        shape,
        {
          depth,
          bevelEnabled: true,
          bevelSegments: 1,
          steps: 1,
          bevelSize: 0.025,
          bevelThickness: 0.025,
        },
      ]}
    />
  );
}
export function NodeLabel({
  label,
  onSelect,
  selected,
  position = [0, -0.35, 0.2],
  project = false,
  display,
  size,
  mobile = false,
  className = "",
}: {
  label: string;
  onSelect: () => void;
  selected: boolean;
  position?: [number, number, number];
  project?: boolean;
  display?: string;
  size?: "category" | "technology";
  mobile?: boolean;
  className?: string;
}) {
  return (
    <Html position={position} center zIndexRange={[10, 0]}>
      <button
        className={`scene-node ${className} ${project ? "scene-project-label" : ""} ${label.toLowerCase() === "observability" ? "scene-node-wide" : ""} ${size ? `scene-${size}-label` : ""}`}
        aria-label={`${project ? "Activate" : "Trace"} ${label}`}
        aria-pressed={selected}
        onFocus={onSelect}
        onPointerEnter={onSelect}
        onClick={onSelect}
      >
        {display ?? (mobile ? mobileLabel(label) : shortLabel(label))}
      </button>
    </Html>
  );
}
export function Paths({
  paths,
  color = steel.cyan,
  opacity = 0.6,
}: {
  paths: Vector3[][];
  color?: string;
  opacity?: number;
}) {
  const vertices = useMemo(
    () =>
      new Float32Array(
        paths.flatMap((path) =>
          path
            .slice(1)
            .flatMap((point, i) => [...path[i].toArray(), ...point.toArray()]),
        ),
      ),
    [paths],
  );
  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[vertices, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </lineSegments>
  );
}

export function Readout({
  label,
  position = [0, 0, 0],
}: {
  label: string;
  position?: [number, number, number];
}) {
  return (
    <Html position={position} center zIndexRange={[10, 0]}>
      <span className="scene-readout">{label}</span>
    </Html>
  );
}
