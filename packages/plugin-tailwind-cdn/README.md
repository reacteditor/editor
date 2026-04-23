# plugin-tailwind-cdn

Inject the [Tailwind CSS v4 browser CDN](https://tailwindcss.com/docs/installation/play-cdn) into the Frontend editor iframe so utility classes work without build-time setup.

## Quick start

```sh
npm i @frontendai/plugin-tailwind-cdn
```

```jsx
import { Editor } from "@frontendai/react-editor";
import createTailwindCdnPlugin from "@frontendai/plugin-tailwind-cdn";

const tailwindCdn = createTailwindCdnPlugin();

export function Page() {
  return <Editor config={config} data={data} plugins={[tailwindCdn]} />;
}
```

The plugin injects:

```html
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
```

into the iframe's `<head>` the first time the iframe mounts.

## Args

| Param       | Example                                                   | Type   | Status   |
| ----------- | --------------------------------------------------------- | ------ | -------- |
| [`src`](#src) | `https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.1.0` | String | Optional |

### Optional args

#### `src`

Override the script URL, e.g. to pin a specific version. Defaults to `https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4`.

## Notes

- The CDN bundle is intended for prototyping. For production, build Tailwind into your rendered output instead of relying on the CDN.
- The plugin only affects the editor iframe. Your public `<Render />` output still needs Tailwind styles wired in separately.

## License

MIT © [The Frontend Contributors](https://github.com/frontend-inc/react-editor/graphs/contributors)
