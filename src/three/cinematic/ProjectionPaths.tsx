import { useMemo } from "react";
import { Color, Vector3 } from "three";

// One vertex-colored batch distinguishes the request path from validation links.
export default function ProjectionPaths({
  primary,
  supporting,
  selected,
}: {
  primary: Vector3[][];
  supporting: Vector3[][];
  selected?: Vector3;
}) {
  const attributes = useMemo(() => {
    const positions: number[] = [],
      colors: number[] = [];
    const append = (path: Vector3[], support: boolean) => {
      const highlighted =
        selected &&
        path.some(
          (point) =>
            Math.abs(point.x - selected.x) < 0.12 &&
            Math.abs(point.y - selected.y) < 0.2,
        );
      const color = new Color(
        support
          ? highlighted
            ? "#4c717b"
            : "#233c45"
          : highlighted
            ? "#77bccb"
            : "#426f7d",
      );
      path.slice(1).forEach((point, index) => {
        positions.push(...path[index].toArray(), ...point.toArray());
        colors.push(...color.toArray(), ...color.toArray());
      });
    };
    primary.forEach((path) => append(path, false));
    supporting.forEach((path) => append(path, true));
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
    };
  }, [primary, supporting, selected]);
  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[attributes.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[attributes.colors, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={0.8} />
    </lineSegments>
  );
}
