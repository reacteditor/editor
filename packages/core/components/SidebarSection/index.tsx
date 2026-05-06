import { ReactNode } from "react";
import styles from "./styles.module.css";
import getClassNameFactory from "../../lib/get-class-name-factory";
import { Heading } from "../Heading";
import { Loader } from "../Loader";
import { Breadcrumbs } from "../Breadcrumbs";

const getClassName = getClassNameFactory("SidebarSection", styles);

export const SidebarSection = ({
  children,
  title,
  background,
  showBreadcrumbs,
  noBorderTop,
  isLoading,
}: {
  children: ReactNode;
  title: ReactNode;
  background?: string;
  showBreadcrumbs?: boolean;
  noBorderTop?: boolean;
  isLoading?: boolean | null;
}) => {
  // Title bar is only rendered when there's something to put in it
  // (a title, breadcrumbs, or both). With both absent we'd otherwise show
  // an empty padded strip with a border, which looks like a layout bug.
  const showTitleBar = title !== null && title !== undefined;
  const showBreadcrumbsRow = !!showBreadcrumbs;

  return (
    <div className={getClassName({ noBorderTop })} style={{ background }}>
      {(showTitleBar || showBreadcrumbsRow) && (
        <div className={getClassName("title")}>
          <div className={getClassName("breadcrumbs")}>
            {showBreadcrumbsRow && <Breadcrumbs />}
            {showTitleBar && (
              <div className={getClassName("heading")}>
                <Heading rank="2" size="xs">
                  {title}
                </Heading>
              </div>
            )}
          </div>
        </div>
      )}
      <div className={getClassName("content")}>{children}</div>
      {isLoading && (
        <div className={getClassName("loadingOverlay")}>
          <Loader size={32} />
        </div>
      )}
    </div>
  );
};
