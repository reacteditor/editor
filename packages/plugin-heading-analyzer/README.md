# plugin-heading-analyzer

Visualise your heading outline structure and identify missing heading levels. Respects WCAG 2.

<img src="https://i.imgur.com/POqtgHu.jpg" alt="example" width="156px" />

## Quick start

```sh
npm i @editoreditor/plugin-heading-analyzer
```

```jsx
import { Puck } from "@editoreditor/core";
import headingAnalyzer from "@editoreditor/plugin-heading-analyzer";
import "@editoreditor/plugin-heading-analyzer/dist/index.css";

...

// Render Puck
export function Page() {
  return <Puck
    config={config}
    data={data}
    plugins={[
        headingAnalyzer
    ]}
  />;
}
```

## License

MIT © [The Puck Contributors](https://github.com/editoreditor/editor/graphs/contributors)
