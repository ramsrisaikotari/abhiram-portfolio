import { Component, type ReactNode } from "react";
export function WebGLFallback() {
  return (
    <div className="system-fallback" role="status">
      <p>3D experience unavailable on this device.</p>
      <a href="/" data-experience-route>
        Return to Portfolio
      </a>
      <p>The engineering story is still available below.</p>
    </div>
  );
}
export class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <WebGLFallback /> : this.props.children;
  }
}
