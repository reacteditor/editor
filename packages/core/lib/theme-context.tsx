import { createContext, useContext } from "react";

export type EditorTheme = "light" | "dark";

type ThemeContextValue = {
  theme: EditorTheme;
  toggleTheme: () => void;
};

/**
 * Editor-scoped light/dark theme. Layout owns the state and drives the
 * `data-theme` attribute on the editor root; Canvas's bottom toolbar
 * consumes it to render the toggle button.
 */
export const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
});

export const useEditorTheme = () => useContext(ThemeContext);
