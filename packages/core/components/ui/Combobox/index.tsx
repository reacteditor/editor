"use client";

import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { getClassNameFactory } from "../../../lib";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("EditorCombobox", styles);

type ClassNameInput<S> =
  | string
  | false
  | null
  | undefined
  | ((state: S) => string | undefined);

type ClassNameOutput<S> = string | ((state: S) => string | undefined);

const join = (...values: Array<string | undefined | null | false>) =>
  values.filter(Boolean).join(" ");

const mergeClassName = <S,>(
  base: string,
  override: ClassNameInput<S>
): ClassNameOutput<S> => {
  if (!override) return base;
  if (typeof override === "function") {
    return (state: S) => join(base, override(state));
  }
  return join(base, override);
};

const Combobox = ComboboxPrimitive.Root;

function ComboboxValue({
  ...props
}: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}

function ComboboxInput({
  className,
  ...props
}: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-input"
      className={mergeClassName(getClassName("input"), className)}
      {...props}
    />
  );
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={mergeClassName(getClassName("trigger"), className)}
      {...props}
    >
      {children ?? (
        <ChevronDownIcon
          size={14}
          className={getClassName("triggerIcon")}
        />
      )}
    </ComboboxPrimitive.Trigger>
  );
}

function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 4,
  align = "start",
  alignOffset = 0,
  children,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset"
  >) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className={getClassName("positioner")}
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          className={mergeClassName(getClassName("content"), className)}
          {...props}
        >
          {children}
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

function ComboboxList({
  className,
  ...props
}: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={mergeClassName(getClassName("list"), className)}
      {...props}
    />
  );
}

function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={mergeClassName(getClassName("item"), className)}
      {...props}
    >
      <span className={getClassName("itemIndicator")}>
        <ComboboxPrimitive.ItemIndicator>
          <CheckIcon size={14} />
        </ComboboxPrimitive.ItemIndicator>
      </span>
      {children}
    </ComboboxPrimitive.Item>
  );
}

function ComboboxEmpty({
  className,
  ...props
}: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={mergeClassName(getClassName("empty"), className)}
      {...props}
    />
  );
}

export {
  Combobox,
  ComboboxValue,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
};
