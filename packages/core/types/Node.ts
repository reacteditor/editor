// New authoring-model data shape.
// {id, type, props, slots} replaces the current {type, props}-with-slots-in-props
// and lets walkers/reducers/serializer treat children structurally rather than
// by reaching back to the component's field schema.

export type Leaf =
  | string
  | number
  | boolean
  | null
  | undefined
  | { [key: string]: Leaf }
  | Leaf[];

export type NodeChild = Node | string;

export type Node = {
  id: string;
  type: string;
  props: Record<string, Leaf>;
  slots: Record<string, NodeChild[]>;
};

export type Document = {
  root: Node;
};
