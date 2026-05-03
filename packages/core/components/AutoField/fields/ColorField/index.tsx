import { useCallback, useRef } from "react";
import { FieldPropsInternal } from "../..";
import { useLocalValue } from "../../lib/use-local-value";
import getClassNameFactory from "../../../../lib/get-class-name-factory";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("ColorField", styles);

// Normalize so the native <input type="color"> always receives a 7-char
// "#rrggbb" value (it rejects shorthand and named colors).
const toHexInput = (val: unknown): string => {
  if (typeof val !== "string") return "#000000";
  const trimmed = val.trim();
  const m = trimmed.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (!m) return "#000000";
  const hex = m[1];
  if (hex.length === 3) {
    return `#${hex
      .split("")
      .map((c) => c + c)
      .join("")}`;
  }
  return `#${hex}`.toLowerCase();
};

// Canonical form persisted to component props: always `#rrggbb` lowercased
// when the input parses cleanly. Returns null when it doesn't, so we leave
// the user mid-keystroke value alone instead of clobbering it.
const canonicalize = (val: string): string | null => {
  const trimmed = val.trim();
  const m = trimmed.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (!m) return null;
  const hex = m[1];
  if (hex.length === 3) {
    return `#${hex
      .split("")
      .map((c) => c + c)
      .join("")}`.toLowerCase();
  }
  return `#${hex}`.toLowerCase();
};

export const ColorField = ({
  field,
  onChange,
  readOnly,
  id,
  name = id,
  label,
  labelIcon,
  Label,
}: FieldPropsInternal) => {
  const [localValue, onChangeLocal] = useLocalValue(name, onChange);
  const pickerRef = useRef<HTMLInputElement | null>(null);

  if (field.type !== "color") return null;

  const swatchHex = toHexInput(localValue);

  const openPicker = useCallback(() => {
    if (readOnly) return;
    pickerRef.current?.click();
  }, [readOnly]);

  return (
    <Label label={label || name} icon={labelIcon} readOnly={readOnly}>
      <div className={getClassName({ readOnly })}>
        <button
          type="button"
          aria-label="Open color picker"
          className={getClassName("swatch")}
          disabled={readOnly}
          onClick={openPicker}
          style={{ color: swatchHex }}
        >
          <input
            ref={pickerRef}
            className={getClassName("picker")}
            type="color"
            tabIndex={-1}
            aria-hidden
            value={swatchHex}
            disabled={readOnly}
            onChange={(e) => onChangeLocal(e.currentTarget.value)}
          />
        </button>
        <input
          className={getClassName("text")}
          autoComplete="off"
          type="text"
          name={name}
          id={id}
          value={localValue ?? ""}
          placeholder={field.placeholder ?? "#000000"}
          readOnly={readOnly}
          tabIndex={readOnly ? -1 : undefined}
          onChange={(e) => onChangeLocal(e.currentTarget.value)}
          onBlur={(e) => {
            // Snap whatever the user typed (`fff`, `FFF`, `#fff`, `#FFFFFF`)
            // to the canonical `#rrggbb` form, but leave malformed input
            // alone so they can keep editing without losing their text.
            const canonical = canonicalize(e.currentTarget.value);
            if (canonical && canonical !== e.currentTarget.value) {
              onChangeLocal(canonical);
            }
          }}
        />
      </div>
    </Label>
  );
};
