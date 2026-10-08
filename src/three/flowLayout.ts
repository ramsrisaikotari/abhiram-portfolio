import { Vector3 } from "three";
export interface FlowNode {
  label: string;
  position: Vector3;
  supporting: boolean;
  index: number;
}
export function flowLayout(
  active: string,
  steps: string[],
  primaryCount: number,
  mobile: boolean,
  selected: string,
  category?: string | null,
): FlowNode[] {
  let indices = steps.map((_, i) => i);
  if (mobile) {
    if (active === "components") indices = indices.slice(0, category ? 5 : 4);
    else if (active === "delivery") {
      const current = steps.indexOf(selected);
      indices =
        current >= 0
          ? indices.slice(
              Math.max(0, Math.min(current - 2, steps.length - 5)),
              Math.max(0, Math.min(current - 2, steps.length - 5)) + 5,
            )
          : [0, 2, 4, 6, 8].filter((i) => i < steps.length);
    } else {
      indices = indices.slice(0, Math.min(primaryCount, 5));
      const support = steps.indexOf(selected);
      if (active === "observability" && primaryCount < steps.length)
        indices.push(support >= primaryCount ? support : primaryCount);
      else if (support >= primaryCount)
        indices = indices.slice(0, 4).concat(support);
    }
  } else if (active === "components" && category) indices = indices.slice(0, 6);
  return indices.map((index, visibleIndex) => {
    const supporting = index >= primaryCount;
    let position: Vector3;
    if (active === "components" && mobile && category) {
      const row = visibleIndex < 3 ? 0 : 1;
      const rowCount =
        row === 0 ? Math.min(indices.length, 3) : indices.length - 3;
      const column = row === 0 ? visibleIndex : visibleIndex - 3;
      position = new Vector3(
        (column - (rowCount - 1) / 2) * 1.9,
        row ? -0.85 : 0.15,
        0.1,
      );
    } else if (active === "components") {
      const columns = mobile ? (category ? 5 : 4) : category ? 3 : 4;
      const x =
        ((visibleIndex % columns) - (columns - 1) / 2) *
        (mobile ? (category ? 1.22 : 1.9) : category ? 2 : 1.8);
      position = new Vector3(
        x,
        mobile
          ? category
            ? -0.35
            : 0.2
          : 1.4 - Math.floor(visibleIndex / columns) * 0.95,
        -0.15 + (visibleIndex % 2) * 0.22,
      );
    } else if (mobile) {
      const primary = indices.filter((i) => i < primaryCount).length;
      position = supporting
        ? new Vector3(0, -0.85, -0.3)
        : new Vector3(
            primary > 1
              ? (visibleIndex - (primary - 1) / 2) * (5.8 / (primary - 1))
              : 0,
            0.35,
            0.1,
          );
    } else if (active === "delivery" || (primaryCount > 5 && !supporting)) {
      const row = Math.floor(index / 3),
        column = index % 3;
      position = new Vector3(
        (row % 2 ? 1 - column : column - 1) * 2.3,
        1.7 - row * (active === "delivery" ? 1.3 : 1),
        row * 0.15,
      );
    } else if (supporting) {
      const count = steps.length - primaryCount,
        i = index - primaryCount;
      position = new Vector3(
        count === 2
          ? i
            ? 2.1
            : -2.1
          : count > 1
            ? (i - (count - 1) / 2) * Math.min(1.45, 5.5 / (count - 1))
            : 0,
        -0.2,
        -0.65,
      );
    } else {
      position = new Vector3(
        primaryCount > 1
          ? (index - (primaryCount - 1) / 2) * (5.5 / (primaryCount - 1))
          : 0,
        active === "diagnostic" ? 1.3 : 1.55,
        0.1 + index * 0.035,
      );
    }
    return { label: steps[index], position, supporting, index };
  });
}
