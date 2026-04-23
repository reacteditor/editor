import { Component } from "lucide-react";
import { Outline } from "../../components/Editor/components/Outline";
import { Plugin } from "../../types";
import styles from "./styles.module.css";
import { getClassNameFactory } from "../../lib";

const getClassName = getClassNameFactory("OutlinePlugin", styles);

export const outlinePlugin: () => Plugin = () => ({
  name: "outline",
  label: "Outline",
  render: () => (
    <div className={getClassName()}>
      <Outline />
    </div>
  ),
  icon: <Component />,
});
