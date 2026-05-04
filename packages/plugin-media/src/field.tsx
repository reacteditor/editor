/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { CustomField, CustomFieldRender } from "@reacteditor/core";
import type { MediaAdapter, MediaItem } from "./types";
import { MediaPanel } from "./panel/MediaPanel";
import styles from "./panel/styles.module.css";

export type { MediaAdapter, MediaItem, MediaPage } from "./types";

export type ImageFieldOptions = {
  adapter: MediaAdapter;
  showSearch?: boolean;
  initialQuery?: string;
  accept?: string;
};

export const imageField = (options: ImageFieldOptions): CustomField<string> => ({
  type: "custom",
  render: makeImageFieldRender(options),
});

export default imageField;

const makeImageFieldRender = (
  options: ImageFieldOptions
): CustomFieldRender<string> =>
  function ImageFieldRender({ value, onChange, id, readOnly }) {
    const [open, setOpen] = useState(false);
    const close = useCallback(() => setOpen(false), []);

    // Esc closes the modal. Only mounted while open.
    useEffect(() => {
      if (!open) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") close();
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [open, close]);

    const onPicked = useCallback(
      (item: MediaItem) => {
        onChange(item.url);
        close();
      },
      [onChange, close]
    );

    const stop = (e: MouseEvent) => e.stopPropagation();

    return (
      <div className={styles.MediaField}>
        <div className={styles["MediaField-thumbWrap"]}>
          {value ? (
            <img
              src={value}
              alt=""
              className={styles["MediaField-thumb"]}
            />
          ) : (
            <div className={styles["MediaField-thumb-empty"]} aria-hidden="true" />
          )}
          {value && !readOnly && (
            <button
              type="button"
              aria-label="Clear image"
              className={styles["MediaField-thumb-clear"]}
              onClick={() => onChange("")}
            >
              <X size={12} />
            </button>
          )}
        </div>
        <button
          id={id}
          type="button"
          className={styles["MediaPanel-button"]}
          onClick={() => setOpen(true)}
          disabled={readOnly}
        >
          Choose image
        </button>

        {open &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              className={styles["MediaField-modalBackdrop"]}
              onClick={close}
              role="presentation"
            >
              <div
                className={styles["MediaField-modal"]}
                onClick={stop}
                role="dialog"
                aria-modal="true"
                aria-label="Select image"
              >
                <div className={styles["MediaField-modalHeader"]}>
                  <span>Select image</span>
                  <button
                    type="button"
                    aria-label="Close"
                    className={styles["MediaField-modalClose"]}
                    onClick={close}
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className={styles["MediaField-modalBody"]}>
                  <MediaPanel
                    options={{
                      adapter: options.adapter,
                      showSearch: options.showSearch,
                      initialQuery: options.initialQuery,
                      accept: options.accept,
                      onSelect: onPicked,
                    }}
                  />
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
    );
  };
