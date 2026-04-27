import { render } from "@testing-library/react";
import createTailwindCdnPlugin from "../index";

const SCRIPT_ID = "frontend-tailwind-cdn";
const DEFAULT_SRC = "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4";

const renderIframe = (
  plugin: ReturnType<typeof createTailwindCdnPlugin>,
  doc: Document
) => {
  const Iframe = plugin.overrides!.iframe!;
  return render(<Iframe document={doc}>child</Iframe> as any);
};

describe("createTailwindCdnPlugin", () => {
  it("appends a script tag with the default CDN URL to the iframe document head", () => {
    const doc = document.implementation.createHTMLDocument("test");
    const plugin = createTailwindCdnPlugin();

    renderIframe(plugin, doc);

    const script = doc.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    expect(script).not.toBeNull();
    expect(script!.tagName).toBe("SCRIPT");
    expect(script!.src).toBe(DEFAULT_SRC);
    expect(script!.parentElement).toBe(doc.head);
  });

  it("uses a custom src when provided", () => {
    const doc = document.implementation.createHTMLDocument("test");
    const customSrc = "https://example.com/tailwind.js";
    const plugin = createTailwindCdnPlugin({ src: customSrc });

    renderIframe(plugin, doc);

    const script = doc.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    expect(script!.src).toBe(customSrc);
  });

  it("does not append a duplicate script when re-rendered", () => {
    const doc = document.implementation.createHTMLDocument("test");
    const plugin = createTailwindCdnPlugin();

    const { rerender } = renderIframe(plugin, doc);
    rerender(
      (() => {
        const Iframe = plugin.overrides!.iframe!;
        return <Iframe document={doc}>child</Iframe> as any;
      })()
    );

    const matches = doc.querySelectorAll(`#${SCRIPT_ID}`);
    expect(matches.length).toBe(1);
  });

  it("does nothing when document is not yet available", () => {
    const plugin = createTailwindCdnPlugin();
    const Iframe = plugin.overrides!.iframe!;

    expect(() =>
      render(<Iframe document={undefined}>child</Iframe> as any)
    ).not.toThrow();
  });

  it("renders children inside the override", () => {
    const doc = document.implementation.createHTMLDocument("test");
    const plugin = createTailwindCdnPlugin();
    const Iframe = plugin.overrides!.iframe!;

    const { getByText } = render(
      <Iframe document={doc}>
        <span>iframe-content</span>
      </Iframe> as any
    );

    expect(getByText("iframe-content")).toBeTruthy();
  });
});
