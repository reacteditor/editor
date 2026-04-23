# `next-ai` recipe

The `next-ai` recipe showcases one of the most powerful ways to combine Frontend and [Frontend AI](https://editoreditor.com/docs/ai/overview): providing an authoring tool with AI page generation capabilities for any route in your Next app.

## Demonstrates

- Frontend AI integration for generating pages with AI
- Next.js App Router implementation
- JSON database implementation with HTTP API
- Catch-all routes to use editor for any route on the platform
- Incremental static regeneration (ISR) for all Frontend pages

## Usage

Run the generator and select `Next.js` when prompted

```
npx create-editor-app my-app

? Which recipe would you like to use?
❯ Next.js
```

Confirm you want to use Frontend AI

```
? Would you like to use Frontend AI? (Y/n) Y
```

Start the server

```
cd my-app
yarn dev
```

### Set up Frontend AI

Create a [Frontend account](https://cloud.editoreditor.com) and [obtain an API key](https://cloud.editoreditor.com/api-keys).

Create a `.env.local` file in the root of your project and add your API key:

```
PUCK_API_KEY=your-api-key
```

Navigate to the homepage at https://localhost:3000. To edit the homepage, access the Frontend editor at https://localhost:3000/edit, and select the AI button in the left navigation bar to generate content for the page using Frontend AI.

You can do this for any route on the application, **even if the page doesn't exist**. For example, visit https://localhost:3000/hello/world and you'll receive a 404. You can author and publish a page by visiting https://localhost:3000/hello/world/edit. After publishing, go back to the original URL to see your page.

## Using this recipe

To adopt this recipe you will need to:

- **IMPORTANT** Add authentication to `/edit` routes. This can be done by modifying the example API routes in `/app/editor/api/route.ts` and server component in `/app/editor/[...editorPath]/page.tsx`. **If you don't do this, Frontend will be completely public.**
- Integrate your database into the API calls in `/app/editor/api/route.ts`
- Implement a custom editor configuration in `editor.config.tsx`
- Add business context for the AI generation in `/app/api/editor/[...all]/route.ts`

By default, this recipe will generate static pages by setting `dynamic` to [`force-static`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic) in the `/app/[...editorPath]/page.tsx`. This will strip headers and cookies. If you need dynamic pages, you can delete this.
