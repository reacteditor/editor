import { CSSProperties, forwardRef, ReactNode } from "react";
import {
  ComponentConfig,
  DefaultComponentProps,
  ObjectField,
} from "@/core/types";
import { spacingOptions } from "../../options";
import { getClassNameFactory } from "@/core/lib";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Layout", styles);

type LayoutFieldProps = {
  padding?: string;
  spanCol?: number;
  spanRow?: number;
  grow?: boolean;
};

export type WithLayout<Props extends DefaultComponentProps> = Props & {
  layout?: LayoutFieldProps;
};

type LayoutProps = WithLayout<{
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}>;

function buildLayoutField(
  overrides: Partial<LayoutFieldProps> = {}
): ObjectField<LayoutFieldProps> {
  return {
    type: "object",
    objectFields: {
      spanCol: {
        label: "Grid Columns",
        type: "number",
        min: 1,
        max: 12,
        default: overrides.spanCol ?? 1,
      },
      spanRow: {
        label: "Grid Rows",
        type: "number",
        min: 1,
        max: 12,
        default: overrides.spanRow ?? 1,
      },
      grow: {
        label: "Flex Grow",
        type: "radio",
        options: [
          { label: "true", value: true },
          { label: "false", value: false },
        ],
        default: overrides.grow ?? false,
      },
      padding: {
        type: "select",
        label: "Vertical Padding",
        options: [{ label: "0px", value: "0px" }, ...spacingOptions],
        default: overrides.padding ?? "0px",
      },
    },
  };
}

export const layoutField = buildLayoutField();

const Layout = forwardRef<HTMLDivElement, LayoutProps>(
  ({ children, className, layout, style }, ref) => {
    return (
      <div
        className={className}
        style={{
          gridColumn: layout?.spanCol
            ? `span ${Math.max(Math.min(layout.spanCol, 12), 1)}`
            : undefined,
          gridRow: layout?.spanRow
            ? `span ${Math.max(Math.min(layout.spanRow, 12), 1)}`
            : undefined,
          paddingTop: layout?.padding,
          paddingBottom: layout?.padding,
          flex: layout?.grow ? "1 1 0" : undefined,
          ...style,
        }}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

Layout.displayName = "Layout";

export { Layout };

export function withLayout<
  ThisComponentConfig extends ComponentConfig<any> = ComponentConfig
>(
  componentConfig: ThisComponentConfig,
  layoutDefaults?: Partial<LayoutFieldProps>
): ThisComponentConfig {
  const merged = buildLayoutField(layoutDefaults);

  return {
    ...componentConfig,
    fields: {
      ...componentConfig.fields,
      layout: merged,
    },
    resolveFields: (_, params) => {
      if (params.parent?.type === "Grid") {
        return {
          ...componentConfig.fields,
          layout: {
            ...merged,
            objectFields: {
              spanCol: merged.objectFields.spanCol,
              spanRow: merged.objectFields.spanRow,
              padding: merged.objectFields.padding,
            },
          },
        };
      }
      if (params.parent?.type === "Flex") {
        return {
          ...componentConfig.fields,
          layout: {
            ...merged,
            objectFields: {
              grow: merged.objectFields.grow,
              padding: merged.objectFields.padding,
            },
          },
        };
      }

      return {
        ...componentConfig.fields,
        layout: {
          ...merged,
          objectFields: {
            padding: merged.objectFields.padding,
          },
        },
      };
    },
    inline: true,
    render: (props) => (
      <Layout
        className={getClassName()}
        layout={props.layout as LayoutFieldProps}
        ref={props.puck.dragRef}
      >
        {componentConfig.render(props)}
      </Layout>
    ),
  };
}
