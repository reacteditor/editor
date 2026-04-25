## What is React Editor?

React Editor is an open-source, visual editor for your react components. You can use React Editor to build custom drag-and-drop experiences for your application.

React Editor is a fork from [Puck](https://github.com/puckeditor), which is the foundation and inspiration for this project.

React Editor is [licensed under MIT](https://github.com/frontend-inc/react-editor?tab=MIT-1-ov-file#readme).

## Quick start

Install the package:

```sh
npm i @reacteditor/core --save # or npx create-react-editor my-app
```

Render the editor:

```jsx
// Editor.jsx
import { Editor } from "@reacteditor/core";
import "@reacteditor/core/react-editor.css";

// Create React Editor component config
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

// Render React Editor editor
export function Editor() {
  return <Editor config={config} data={initialData} onPublish={save} />;
}
```

Render the page:

```jsx
// Page.jsx
import { Render } from "@reacteditor/core";
import "@reacteditor/core/react-editor.css";

export function Page() {
  return <Render config={config} data={data} />;
}
```

## Recipes

Use `create-react-editor` to quickly spin up a a pre-configured app based on our provided [recipes](https://github.com/frontend-inc/react-editor/tree/main/recipes):

```sh
npx create-react-editor my-app
```

Available recipes include:

- [**next**](https://github.com/frontend-inc/react-editor/tree/main/recipes/next): Next.js example, using App Router and static page generation
- [**remix**](https://github.com/frontend-inc/react-editor/tree/main/recipes/remix): Remix Run v2 example, using dynamic routes at root-level
- [**react-router**](https://github.com/frontend-inc/react-editor/tree/main/recipes/react-router): React Router v7 app example, using dynamic routes to create pages at any level

## Get support

If you have any questions about React Editor, please open a [GitHub issue](https://github.com/frontend-inc/react-editor/issues).


## License

[MIT License](https://github.com/frontend-inc/react-editor/license.MD)
