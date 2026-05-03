# `next` recipe

The `next` recipe showcases one of the most powerful ways to implement React Editor using to provide an authoring tool for any route in your Next app.

## Demonstrates

- Next.js 16 App Router implementation
- JSON database implementation with HTTP API
- Catch-all routes to use React Editor for any route on the platform

## Usage

Run the generator and enter `next` when prompted

```
npx create-react-editor my-app
```

Start the server

```
yarn dev
```

Navigate to the homepage at https://localhost:3000. To edit the homepage, access the React Editor editor at https://localhost:3000/edit.

You can do this for any route on the application, **even if the page doesn't exist**. For example, visit https://localhost:3000/hello/world and you'll receive a 404. You can author and publish a page by visiting https://localhost:3000/hello/world/edit. After publishing, go back to the original URL to see your page.

## Using this recipe

To adopt this recipe you will need to:

- **IMPORTANT** Add authentication to `/edit` routes. This can be done by modifying the example API routes in `/app/api/editor/route.ts` and server component in `/app/[...editorPath]/page.tsx`. **If you don't do this, React Editor will be completely public.**
- Integrate your database into the API calls in `/app/api/editor/route.ts`
- Implement a custom React Editor configuration in `editor.config.tsx`

## License

MIT © [The React Editor Contributors](https://github.com/reacteditor/editor/graphs/contributors).
