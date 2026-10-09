import { useEffect, useMemo } from "react";
import { BufferGeometry, Float32BufferAttribute } from "three";
export default function HeroTargeting() {
  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute(
      "position",
      new Float32BufferAttribute(
        [
          -3.9, -1.28, -0.7, -3.9, -0.85, -0.7, -3.9, -1.28, -0.7, -3.5, -1.28,
          -0.7, 3.5, 2.1, -0.7, 3.9, 2.1, -0.7, 3.9, 2.1, -0.7, 3.9, 1.68, -0.7,
        ],
        3,
      ),
    );
    return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#385b65" transparent opacity={0.45} />
    </lineSegments>
  );
}
