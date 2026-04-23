import { FieldPropsInternal } from "../..";
import { useDeepField } from "../../lib/use-deep-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/Select";

export const SelectField = ({
  field,
  onChange,
  label,
  labelIcon,
  Label,
  id,
  name = id,
  readOnly,
}: FieldPropsInternal) => {
  const value = useDeepField(name);

  if (field.type !== "select" || !field.options) {
    return null;
  }

  // Radix Select requires string values. Serialize so any option value
  // (string/number/boolean/object) round-trips cleanly on selection.
  const serializedValue = JSON.stringify({ value });

  return (
    <Label label={label || name} icon={labelIcon} readOnly={readOnly}>
      <Select
        value={serializedValue}
        onValueChange={(v) => {
          onChange(JSON.parse(v).value);
        }}
        disabled={readOnly}
      >
        <SelectTrigger id={id} style={{ width: "100%" }}>
          <SelectValue placeholder={label || name} />
        </SelectTrigger>
        <SelectContent>
          {field.options.map((option) => (
            <SelectItem
              key={option.label + JSON.stringify(option.value)}
              value={JSON.stringify({ value: option.value })}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Label>
  );
};
