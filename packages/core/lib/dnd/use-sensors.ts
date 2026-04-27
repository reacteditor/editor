import { useState } from "react";
import { PointerSensor } from "@dnd-kit/react";
import { isElement } from "@dnd-kit/dom/utilities";
import { PointerActivationConstraints } from "@dnd-kit/dom";
import type { ActivationConstraints } from "@dnd-kit/abstract";

export type ActivationConstraintList = ActivationConstraints<PointerEvent>;

const touchDefault: ActivationConstraintList = [
  new PointerActivationConstraints.Delay({ value: 200, tolerance: 10 }),
];
const otherDefault: ActivationConstraintList = [
  new PointerActivationConstraints.Delay({ value: 200, tolerance: 10 }),
  new PointerActivationConstraints.Distance({ value: 5 }),
];

export const useSensors = (
  {
    other = otherDefault,
    mouse,
    touch = touchDefault,
  }: {
    mouse?: ActivationConstraintList;
    touch?: ActivationConstraintList;
    other?: ActivationConstraintList;
  } = {
    touch: touchDefault,
    other: otherDefault,
  }
) => {
  const [sensors] = useState(() => [
    PointerSensor.configure({
      activationConstraints(event, source) {
        const { pointerType, target } = event;

        if (
          pointerType === "mouse" &&
          isElement(target) &&
          (source.handle === target || source.handle?.contains(target))
        ) {
          return mouse;
        }

        if (pointerType === "touch") {
          return touch;
        }

        return other;
      },
    }),
  ]);

  return sensors;
};
