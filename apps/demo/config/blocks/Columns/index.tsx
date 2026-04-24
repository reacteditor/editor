import { ComponentConfig, Slot } from "@/core";
import { cn } from "@/lib/utils";

export type ColumnsProps = {
  items: Array<{
    span:
      | "1"
      | "2"
      | "3"
      | "4"
      | "5"
      | "6"
      | "7"
      | "8"
      | "9"
      | "10"
      | "11"
      | "12";
    content: Slot;
  }>;
  gap: "sm" | "md" | "lg" | "xl";
};

const spanClasses: Record<ColumnsProps["items"][number]["span"], string> = {
  "1": "md:col-span-1",
  "2": "md:col-span-2",
  "3": "md:col-span-3",
  "4": "md:col-span-4",
  "5": "md:col-span-5",
  "6": "md:col-span-6",
  "7": "md:col-span-7",
  "8": "md:col-span-8",
  "9": "md:col-span-9",
  "10": "md:col-span-10",
  "11": "md:col-span-11",
  "12": "md:col-span-12",
};

const gapClasses: Record<ColumnsProps["gap"], string> = {
  sm: "gap-3",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-12",
};

export const Columns: ComponentConfig<ColumnsProps> = {
  fields: {
    items: {
      type: "array",
      default: [
        { span: "6", content: [] },
        { span: "6", content: [] },
      ],
      getItemSummary: (item, i) =>
        `Column ${(i ?? 0) + 1} · span ${item.span}`,
      arrayFields: {
        span: {
          type: "select",
          default: "6",
          options: Array.from({ length: 12 }, (_, i) => {
            const v = String(i + 1) as ColumnsProps["items"][number]["span"];
            return { label: v, value: v };
          }),
        },
        content: { type: "slot" },
      },
    },
    gap: {
      type: "select",
      default: "md",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Extra large", value: "xl" },
      ],
    },
  },
  render: ({ items, gap }) => (
    <div
      className={cn(
        "grid w-full grid-cols-1 items-start md:grid-cols-12",
        gapClasses[gap]
      )}
    >
      {items.map((item, i) => {
        const Content = item.content;
        return (
          <Content
            key={i}
            className={cn("col-span-1", spanClasses[item.span])}
          />
        );
      })}
    </div>
  ),
};
