import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  CylinderGeometry,
  ExtrudeGeometry,
  DynamicDrawUsage,
  Matrix4,
  Object3D,
  Shape,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { Station } from "./modeComposition";

type Part = "fixed" | "hatch" | "instrument";
interface Segment {
  station: number;
  part: Part;
  start: number;
  count: number;
  positions: Float32Array;
  normals: Float32Array;
}
export interface ModuleBatch {
  geometry: BufferGeometry;
  segments: Segment[];
}

// Unlike identical instanced cradles, each attachment has a recognizable mechanical
// purpose. All rigid pieces still render in just two shared material batches.
export function buildModules(
  stations: Station[],
  projection = false,
): {
  metal: ModuleBatch;
  lamps: ModuleBatch;
} {
  const batches: {
    pieces: BufferGeometry[];
    segments: Segment[];
    offset: number;
  }[] = [0, 1].map(() => ({ pieces: [], segments: [], offset: 0 }));
  stations.forEach((station, index) => {
    const add = (
      geo: BufferGeometry,
      pos: number[],
      color: string,
      part: Part = "fixed",
      light = false,
      rotation: number[] = [0, 0, 0],
    ) => {
      const object = new Object3D();
      object.position.set(pos[0], pos[1], pos[2]);
      object.rotation.set(rotation[0], rotation[1], rotation[2]);
      object.updateMatrix();
      const g = (geo.index ? geo.toNonIndexed() : geo.clone()).applyMatrix4(
        object.matrix,
      );
      geo.dispose();
      // Extra UV channels are unnecessary for these texture-free shared materials.
      g.deleteAttribute("uv");
      const n = g.getAttribute("position").count,
        c = new Color(projection && !light ? "#477788" : color),
        colors = new Float32Array(n * 3);
      for (let j = 0; j < n; j++) c.toArray(colors, j * 3);
      g.setAttribute("color", new BufferAttribute(colors, 3));
      const batch = batches[light ? 1 : 0];
      batch.segments.push({
        station: index,
        part,
        start: batch.offset,
        count: n,
        positions: new Float32Array(g.getAttribute("position").array),
        normals: new Float32Array(g.getAttribute("normal").array),
      });
      batch.offset += n;
      batch.pieces.push(g);
    };
    const box = (
      p: number[],
      s: number[],
      color = "#25343e",
      part: Part = "fixed",
      light = false,
      r: number[] = [0, 0, 0],
    ) => add(new BoxGeometry(s[0], s[1], s[2]), p, color, part, light, r);
    const cylinder = (
      p: number[],
      r: number,
      h: number,
      color = "#17252d",
      part: Part = "fixed",
      rotation: number[] = [Math.PI / 2, 0, 0],
      top = r,
    ) =>
      add(new CylinderGeometry(top, r, h, 10), p, color, part, false, rotation);
    const armor = (
      p: number[],
      w: number,
      h: number,
      d: number,
      color = "#30434e",
      part: Part = "fixed",
      rotation: number[] = [0, 0, 0],
    ) => {
      const sh = new Shape(),
        cut = Math.min(w, h) * 0.18;
      sh.moveTo(-w / 2 + cut, -h / 2);
      sh.lineTo(w / 2 - cut, -h / 2);
      sh.lineTo(w / 2, -h / 2 + cut);
      sh.lineTo(w / 2, h / 2 - cut);
      sh.lineTo(w / 2 - cut, h / 2);
      sh.lineTo(-w / 2 + cut, h / 2);
      sh.lineTo(-w / 2, h / 2 - cut);
      sh.lineTo(-w / 2, -h / 2 + cut);
      sh.closePath();
      add(
        new ExtrudeGeometry(sh, {
          depth: d,
          steps: 1,
          bevelEnabled: false,
        }).translate(0, 0, -d / 2),
        p,
        color,
        part,
        false,
        rotation,
      );
    };
    const slit = (
      x: number,
      y: number,
      z: number,
      w = 0.12,
      h = 0.025,
      part: Part = "fixed",
    ) => box([x, y, z], [w, h, 0.025], "#376b79", part, true);
    // Shared mounting socket; the functional silhouette above it differs per type.
    box([0, -0.43, -0.08], [0.52, 0.09, 0.48], "#15232c");
    cylinder([0, -0.32, -0.07], 0.09, 0.23, "#3c4c56", "fixed", [0, 0, 0]);
    switch (station.form) {
      case "tower":
        for (const side of [-1, 1]) {
          box([side * 0.3, 0.17, 0], [0.085, 1.22, 0.45], "#334652");
          armor([side * 0.25, 0.25, 0.28], 0.15, 0.72, 0.07);
        }
        for (let i = 0; i < 4; i++) {
          armor([0, -0.22 + i * 0.25, 0], 0.48, 0.18, 0.48, "#1c2a34");
          slit(-0.12, -0.2 + i * 0.25, 0.25, 0.14);
        }
        armor([0, 0.82, 0], 0.66, 0.15, 0.55, "#40515c", "hatch");
        break;
      case "rail":
        for (const side of [-1, 1])
          box([0, side * 0.2, 0.03], [1.04, 0.065, 0.42], "#374953");
        for (let i = 0; i < 4; i++)
          cylinder(
            [-0.36 + i * 0.24, 0, 0.03],
            0.08,
            0.36,
            "#1a2a34",
            "fixed",
            [0, 0, Math.PI / 2],
          );
        armor([0, 0.26, 0], 0.5, 0.18, 0.4, "#3e505c", "hatch");
        slit(0, -0.17, 0.27, 0.68);
        break;
      case "compute":
        for (let i = 0; i < 3; i++) {
          armor(
            [(i - 1) * 0.25, 0.15 + (i === 1 ? 0.13 : 0), 0],
            0.2,
            0.69,
            0.57,
            "#2d3d47",
          );
          for (let j = 0; j < 3; j++)
            box(
              [(i - 1) * 0.25, -0.02 + j * 0.1, 0.3],
              [0.14, 0.025, 0.025],
              "#09141d",
            );
          slit((i - 1) * 0.25, 0.39, 0.3, 0.08);
        }
        armor([0, 0.7, -0.12], 0.66, 0.15, 0.22, "#3c505c", "hatch");
        break;
      case "sensor":
        cylinder([0, 0.14, 0], 0.35, 0.1, "#22343f", "instrument");
        cylinder([0, 0.14, 0.09], 0.19, 0.08, "#091720", "instrument");
        for (const side of [-1, 1]) {
          box(
            [side * 0.34, 0.17, -0.08],
            [0.08, 0.72, 0.16],
            "#3e515c",
            "hatch",
            false,
            [0, 0, side * -0.3],
          );
          slit(side * 0.34, 0.43, 0.02, 0.06, 0.1, "hatch");
        }
        for (let i = 0; i < 3; i++)
          slit(0, 0.05 + i * 0.09, 0.15, 0.11, 0.025, "instrument");
        break;
      case "shield":
        armor([0, 0.12, 0], 0.78, 0.86, 0.15, "#354752", "hatch");
        armor([0, 0.13, 0.11], 0.52, 0.56, 0.06, "#111f29", "hatch");
        for (const side of [-1, 1])
          box(
            [side * 0.23, 0.12, 0.17],
            [0.045, 0.34, 0.055],
            "#425760",
            "hatch",
            false,
            [0, 0, side * 0.27],
          );
        slit(0, 0.1, 0.17, 0.07, 0.19, "hatch");
        break;
      case "console":
        armor([0, -0.15, 0], 1.05, 0.39, 0.74, "#2c3d48");
        for (const side of [-1, 1]) {
          armor([side * 0.49, 0.05, 0], 0.14, 0.5, 0.69, "#3b4d58");
          cylinder([side * 0.43, 0.19, -0.1], 0.07, 0.18, "#52616a", "fixed", [
            0,
            0,
            Math.PI / 2,
          ]);
        }
        armor([0, 0.16, -0.16], 0.84, 0.49, 0.09, "#344853", "hatch");
        armor([0, 0.16, -0.1], 0.65, 0.32, 0.025, "#081820", "hatch");
        for (let i = 0; i < 3; i++)
          slit(-0.14 + i * 0.14, 0.1 + i * 0.06, -0.075, 0.09, 0.02, "hatch");
        for (let i = 0; i < 4; i++)
          box([-0.23 + i * 0.15, -0.2, 0.39], [0.08, 0.028, 0.03], "#07141d");
        slit(0, -0.32, 0.39, 0.68);
        break;
      case "collector":
        cylinder(
          [0, 0.13, 0.04],
          0.34,
          0.35,
          "#344750",
          "instrument",
          [Math.PI / 2, 0, 0],
          0.17,
        );
        cylinder([0, 0.13, 0.25], 0.16, 0.09, "#0d1e27", "instrument");
        for (const side of [-1, 1])
          box(
            [side * 0.33, 0.12, 0.08],
            [0.06, 0.64, 0.34],
            "#293c47",
            "hatch",
          );
        slit(0, 0.12, 0.31, 0.08, 0.08, "instrument");
        break;
      case "channel":
        for (const side of [-1, 1]) {
          box([0, side * 0.2, 0], [0.92, 0.1, 0.47], "#354953");
          slit(0, side * 0.17, 0.25, 0.77);
        }
        for (let i = 0; i < 3; i++)
          cylinder(
            [-0.28 + i * 0.28, 0, 0],
            0.13,
            0.42,
            "#142831",
            "instrument",
            [0, 0, Math.PI / 2],
          );
        armor([0, 0.29, -0.07], 0.56, 0.13, 0.3, "#42555e", "hatch");
        break;
      case "receiver":
        armor([0, 0.12, 0], 0.65, 0.7, 0.41, "#192b35");
        for (const side of [-1, 1])
          armor([side * 0.3, 0.23, 0.06], 0.13, 0.9, 0.32, "#3b525d", "hatch", [
            0,
            0,
            side * -0.16,
          ]);
        for (let i = 0; i < 3; i++) slit(0, -0.05 + i * 0.15, 0.24, 0.3, 0.036);
        break;
      case "database":
        for (let i = 0; i < 3; i++)
          cylinder(
            [0, -0.12 + i * 0.22, 0],
            0.34,
            0.17,
            "#2e414b",
            "fixed",
            [0, 0, 0],
          );
        for (const side of [-1, 1])
          box([side * 0.3, 0.15, 0], [0.06, 0.84, 0.25], "#40525b", "hatch");
        for (let i = 0; i < 3; i++) slit(0, -0.12 + i * 0.22, 0.34, 0.19);
        break;
    }
  });
  return Object.fromEntries(
    batches.map((batch, i) => {
      const geometry = batch.pieces.length
        ? mergeGeometries(batch.pieces)!
        : new BufferGeometry();
      batch.pieces.forEach((p) => p.dispose());
      geometry.computeBoundingSphere();
      for (const key of ["position", "normal", "color"]) {
        const attribute = geometry.getAttribute(key);
        if (attribute instanceof BufferAttribute)
          attribute.setUsage(DynamicDrawUsage);
      }
      return [i ? "lamps" : "metal", { geometry, segments: batch.segments }];
    }),
  ) as unknown as { metal: ModuleBatch; lamps: ModuleBatch };
}

export function poseBatch(
  batch: ModuleBatch,
  transforms: Matrix4[][],
  lampColors?: Color[],
) {
  const positions = batch.geometry.getAttribute("position"),
    normals = batch.geometry.getAttribute("normal"),
    colors = batch.geometry.getAttribute("color");
  if (!positions) return;
  for (const segment of batch.segments) {
    const m =
      transforms[segment.station][
        segment.part === "fixed" ? 0 : segment.part === "hatch" ? 1 : 2
      ].elements;
    const color = lampColors?.[segment.station];
    for (let i = 0; i < segment.count; i++) {
      const j = i * 3,
        at = segment.start + i,
        x = segment.positions[j],
        y = segment.positions[j + 1],
        z = segment.positions[j + 2];
      positions.setXYZ(
        at,
        m[0] * x + m[4] * y + m[8] * z + m[12],
        m[1] * x + m[5] * y + m[9] * z + m[13],
        m[2] * x + m[6] * y + m[10] * z + m[14],
      );
      const nx = segment.normals[j],
        ny = segment.normals[j + 1],
        nz = segment.normals[j + 2];
      const a = m[0] * nx + m[4] * ny + m[8] * nz,
        b = m[1] * nx + m[5] * ny + m[9] * nz,
        c = m[2] * nx + m[6] * ny + m[10] * nz,
        len = Math.hypot(a, b, c) || 1;
      normals.setXYZ(at, a / len, b / len, c / len);
      if (color) colors.setXYZ(at, color.r, color.g, color.b);
    }
  }
  positions.needsUpdate = true;
  normals.needsUpdate = true;
  if (lampColors) colors.needsUpdate = true;
  // Parts move across modes; avoid stale culling bounds without per-frame scans.
}
