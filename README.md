<br /><br /><br />

<div align="center">

<a href="https://frontend.co?utm_source=readme&utm_medium=code&utm_campaign=repo&utm_contents=logo">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://res.cloudinary.com/die3nptcg/image/upload/Frontend_Logo_White_RGB_j2rwgg.svg" height="100px" aria-label="Frontend logo">
    <img src="https://res.cloudinary.com/die3nptcg/image/upload/Frontend_Logo_Black_RGB_dqsjag.svg" height="100px" aria-label="Frontend logo">
  </picture>
</a>

_The visual editor for React_

[Documentation](https://frontend.co/docs?utm_source=readme&utm_medium=code&utm_campaign=repo&utm_contents=docs_link) • [Demo](https://demo.frontend.co/edit?utm_source=readme&utm_medium=code&utm_campaign=repo&utm_contents=demo_link) • [Discord](https://discord.gg/V9mDAhuxyZ) • [Contributing](https://github.com/frontend-inc/react-editor/blob/main/CONTRIBUTING.md)

⭐️ Enjoying Frontend? Please [leave a star](https://github.com/frontend-inc/react-editor)!

<br />

[![GIF showing a page being created in the Frontend Editor, with components being added, arranged, and customized in real time](https://github.com/user-attachments/assets/25e1ae25-ca5e-450f-afa0-01816830b731)](https://demo.frontend.co/edit)

</div>

## What is Frontend?

Frontend is a modular, open-source visual editor for React.js. You can use Frontend to build custom drag-and-drop experiences with your own application and React components.

Because Frontend is just a React component, it plays well with all React.js environments, including Next.js. You own your data and there’s no vendor lock-in.

Frontend is also [licensed under MIT](https://github.com/frontend-inc/react-editor?tab=MIT-1-ov-file#readme), making it suitable for both internal systems and commercial applications.

## Quick start

Install the package:

```sh
npm i @frontendai/react-editor --save # or npx create-frontend-app my-app
```

Render the editor:

```jsx
// Editor.jsx
import { Editor } from "@frontendai/react-editor";
import "@frontendai/react-editor/frontend.css";

// Create Frontend component config
const config = {
  components: {
    HeadingBlock: {
      fields: {
        children: {
          type: "text",
        },
      },
      render: ({ children }) => {
        return <h1>{children}</h1>;
      },
    },
  },
};

// Describe the initial data
const initialData = {};

// Save the data to your database
const save = (data) => {};

// Render Frontend editor
export function Editor() {
  return <Editor config={config} data={initialData} onPublish={save} />;
}
```

Render the page:

```jsx
// Page.jsx
import { Render } from "@frontendai/react-editor";
import "@frontendai/react-editor/frontend.css";

export function Page() {
  return <Render config={config} data={data} />;
}
```

## Recipes

Use `create-frontend-app` to quickly spin up a a pre-configured app based on our provided [recipes](https://github.com/frontend-inc/react-editor/tree/main/recipes):

```sh
npx create-frontend-app my-app
```

Available recipes include:

- [**next**](https://github.com/frontend-inc/react-editor/tree/main/recipes/next): Next.js example, using App Router and static page generation
- [**remix**](https://github.com/frontend-inc/react-editor/tree/main/recipes/remix): Remix Run v2 example, using dynamic routes at root-level
- [**react-router**](https://github.com/frontend-inc/react-editor/tree/main/recipes/react-router): React Router v7 app example, using dynamic routes to create pages at any level

## Get support

If you have any questions about Frontend, please open a [GitHub issue](https://github.com/frontend-inc/react-editor/issues) or join us on [Discord](https://discord.gg/D9e4E3MQVZ).

Or [book a discovery call](https://calendly.com/rami-bitar/30min) for hands-on support and consultancy.

## License

MIT © [The Frontend Contributors](https://github.com/frontend-inc/react-editor/graphs/contributors)
