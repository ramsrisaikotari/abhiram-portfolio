import { useCallback, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import { SceneBoundary, WebGLFallback } from "./WebGLFallback";
import EngineeringScene from "./EngineeringScene";
export interface SceneProps {
  active: string;
  projectSlug: string;
  onProjectSelect: (slug: string) => void;
  phase: string;
  skillCategory?: string | null;
  selected: string;
  steps: string[];
  reduced: boolean;
  mobile: boolean;
  visible: boolean;
  connectedCount?: number;
  onSelect: (node: string) => void;
}
export default function SceneHost(props: SceneProps) {
  const [failed, setFailed] = useState(() => {
    // Probe before Canvas mounts; release this temporary context immediately.
    try {
      const probe = document.createElement("canvas");
      const context = probe.getContext("webgl2");
      if (!context) return true;
      context.getExtension("WEBGL_lose_context")?.loseContext();
      return false;
    } catch {
      return true;
    }
  });
  const failure = useCallback(() => setFailed(true), []);
  if (failed) return <WebGLFallback />;
  return (
    <SceneBoundary>
      <Canvas
        aria-label="Engineering system visualization"
        dpr={props.mobile ? [1, 1.25] : [1, 1.5]}
        camera={{ position: [0, 0, 10], fov: 40 }}
        frameloop={!props.visible ? "never" : "demand"}
        gl={{
          antialias: !props.mobile,
          alpha: false,
          powerPreference: "low-power",
        }}
        fallback={<WebGLFallback />}
      >
        <RendererLifecycle onFailure={failure} />
        <AdaptiveDpr pixelated />
        <EngineeringScene {...props} />
      </Canvas>
    </SceneBoundary>
  );
}

function RendererLifecycle({ onFailure }: { onFailure: () => void }) {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", lost);
    return () => {
      canvas.removeEventListener("webglcontextlost", lost);
      // Fiber releases the context; explicitly dispose renderer-owned caches/listeners.
      gl.dispose();
    };
  }, [gl, onFailure]);
  return null;
}
