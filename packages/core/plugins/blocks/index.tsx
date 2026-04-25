import { Plus } from "lucide-react";
import { Plugin } from "../../types";
import { Components } from "../../components/Editor/components/Components";
import styles from "./styles.module.css";
import { getClassNameFactory } from "../../lib";

const getClassName = getClassNameFactory("BlocksPlugin", styles);

export const blocksPlugin: () => Plugin = () => ({
  name: "blocks",
  label: "Blocks",
  render: () => (
    <div className={getClassName()}>
      <Components />
    </div>
  ),
  icon: <Plus />,
});
