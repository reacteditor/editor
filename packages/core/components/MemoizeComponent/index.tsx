import { deepEqual } from "fast-equals";
import { ComponentType, memo } from "react";
import { shallowEqual } from "../../lib/shallow-equal";

const RenderComponent = ({
  Component,
  componentProps: renderProps,
}: {
  Component: ComponentType<any>;
  componentProps: any;
}) => {
  return <Component {...renderProps} />;
};

/**　Renders the Component and only re-renders when its props change using shallow comparison. Uses deep comparison for the "editor" prop. */
export const MemoizeComponent = memo(RenderComponent, (prev, next) => {
  let editorEquals = true;
  if ("editor" in prev.componentProps && "editor" in next.componentProps) {
    editorEquals = deepEqual(prev.componentProps.editor, next.componentProps.editor);
  }

  return (
    prev.Component === next.Component &&
    shallowEqual(prev.componentProps, next.componentProps, ["editor"]) &&
    editorEquals
  );
});
