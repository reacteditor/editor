# field-shopify

Select [products](https://shopify.dev/docs/api/storefront/latest/objects/Product) and [collections](https://shopify.dev/docs/api/storefront/latest/objects/Collection) from a [Shopify](https://www.shopify.com) store via the Storefront API.

## Quick start

```sh
npm i @reacteditor/field-shopify @shopify/storefront-api-client
```

```jsx
import {
  createFieldShopifyProduct,
  createFieldShopifyCollection,
} from "@reacteditor/field-shopify";

const config = {
  components: {
    ProductCard: {
      fields: {
        product: createFieldShopifyProduct({
          storeDomain: "my-shop.myshopify.com",
          // storefrontAccessToken is optional — tokenless storefront queries
          // are supported as of 2026.
        }),
      },
      render: ({ product }) => (
        <p>{product?.title ?? "No product selected"}</p>
      ),
    },
    CollectionGrid: {
      fields: {
        collection: createFieldShopifyCollection({
          storeDomain: "my-shop.myshopify.com",
        }),
      },
      render: ({ collection }) => (
        <p>{collection?.title ?? "No collection selected"}</p>
      ),
    },
  },
};
```

## Options

Both `createFieldShopifyProduct` and `createFieldShopifyCollection` take the same options object.

| Param                   | Example                  | Type                   | Status                              |
| ----------------------- | ------------------------ | ---------------------- | ----------------------------------- |
| `storeDomain`           | `"my-shop.myshopify.com"`| String                 | Required (unless using `client`)    |
| `storefrontAccessToken` | `"abc123"`               | String                 | Optional (tokenless works in 2026+) |
| `apiVersion`            | `"2026-01"`              | String                 | Optional                            |
| `client`                | `createStorefrontApiClient()` | `StorefrontApiClient` | Optional                        |
| `first`                 | `20`                     | Number                 | Optional (default `20`)             |
| `titleField`            | `"title"`                | String                 | Optional (default `"title"`)        |
| `filterFields`          | `{ vendor: { type: "text" } }` | Object           | Optional                            |
| `initialFilters`        | `{ vendor: "Acme" }`     | Object                 | Optional                            |

### Tokenless queries

As of Shopify API version 2026, public storefront queries no longer require a `storefrontAccessToken` for unauthenticated shops. Omit the token and the client will issue unauthenticated requests against your `storeDomain`.

If your store still requires a token, supply `storefrontAccessToken` and it will be passed through to the client.

### Reusing a client

```jsx
import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import { createFieldShopifyProduct } from "@reacteditor/field-shopify";

const client = createStorefrontApiClient({
  storeDomain: "my-shop.myshopify.com",
  apiVersion: "2026-01",
});

const productField = createFieldShopifyProduct({ client });
```

### Filtering

`filterFields` values are forwarded to Shopify's Storefront [search syntax](https://shopify.dev/docs/api/usage/search-syntax) as `key:value` clauses and combined with the search string using `AND`.

```jsx
createFieldShopifyProduct({
  storeDomain: "my-shop.myshopify.com",
  filterFields: {
    vendor: { type: "text" },
    product_type: { type: "text" },
  },
  initialFilters: {
    vendor: "Acme",
  },
});
```

## Returns

Both helpers return an [External field](https://editoreditor.com/docs/api-reference/fields/external) that stores the selected product or collection object.

## TypeScript

```tsx
import {
  createFieldShopifyProduct,
  type ShopifyProduct,
} from "@reacteditor/field-shopify";

type MyProps = {
  ProductCard: {
    product: ShopifyProduct;
  };
};
```

## License

MIT © [The React Editor Contributors](https://github.com/reacteditor/editor/graphs/contributors)
