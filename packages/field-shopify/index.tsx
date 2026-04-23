import React from "react";
import { ExternalField } from "@/core/types";

import {
  createStorefrontApiClient,
  StorefrontApiClient,
} from "@shopify/storefront-api-client";

export { createStorefrontApiClient };

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

export type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string[];
  featuredImage: ShopifyImage | null;
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
};

export type ShopifyCollection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
};

type SharedOptions = {
  client?: StorefrontApiClient;
  storeDomain?: string;
  storefrontAccessToken?: string;
  apiVersion?: string;
  titleField?: string;
  filterFields?: ExternalField["filterFields"];
  initialFilters?: ExternalField["initialFilters"];
};

const DEFAULT_API_VERSION = "2026-01";

function createShopifyClient(storeDomain: string): StorefrontApiClient {
  const endpoint = `https://${storeDomain.replace(/^https?:\/\//, "")}/api`;

  const request: StorefrontApiClient["request"] = async (query, options) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: options?.variables }),
    });
    return response.json();
  };

  return { request } as StorefrontApiClient;
}

function resolveClient(options: SharedOptions): StorefrontApiClient {
  if (options.client) return options.client;

  if (!options.storeDomain) {
    throw new Error('field-shopify: Must either specify "client" or "storeDomain"');
  }

  if (!options.storefrontAccessToken) {
    return createShopifyClient(options.storeDomain);
  }

  return createStorefrontApiClient({
    storeDomain: options.storeDomain,
    apiVersion: options.apiVersion ?? DEFAULT_API_VERSION,
    publicAccessToken: options.storefrontAccessToken,
  });
}

const PRODUCT_FIELDS = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    vendor
    productType
    tags
    featuredImage {
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
  }
`;

const PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_FIELDS}
  query PuckProducts($query: String, $first: Int!) {
    products(first: $first, query: $query) {
      edges {
        node {
          ...ProductFields
        }
      }
    }
  }
`;

const COLLECTION_FIELDS = /* GraphQL */ `
  fragment CollectionFields on Collection {
    id
    handle
    title
    description
    image {
      url
      altText
      width
      height
    }
  }
`;

const COLLECTIONS_QUERY = /* GraphQL */ `
  ${COLLECTION_FIELDS}
  query PuckCollections($query: String, $first: Int!) {
    collections(first: $first, query: $query) {
      edges {
        node {
          ...CollectionFields
        }
      }
    }
  }
`;

function buildShopifyQuery(
  search: string | undefined,
  filters: Record<string, unknown>
): string | undefined {
  const parts: string[] = [];

  if (search) parts.push(`title:*${search}*`);

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === "") continue;
    parts.push(`${key}:${value}`);
  }

  return parts.length ? parts.join(" AND ") : undefined;
}

export function createFieldShopifyProduct<T extends ShopifyProduct = ShopifyProduct>(
  options: SharedOptions & { first?: number } = {}
) {
  const {
    titleField = "title",
    filterFields,
    initialFilters,
    first = 20,
  } = options;

  const client = resolveClient(options);

  const field: ExternalField<T> = {
    type: "external",
    placeholder: "Select a Shopify product",
    showSearch: true,
    fetchList: async ({ query, filters = {} }) => {
      const { data, errors } = await client.request(PRODUCTS_QUERY, {
        variables: {
          query: buildShopifyQuery(query, filters),
          first,
        },
      });

      if (errors?.graphQLErrors?.length) {
        throw new Error(errors.graphQLErrors.map((e) => e.message).join("; "));
      }

      return (data?.products?.edges ?? []).map(
        (edge: { node: T }) => edge.node
      );
    },
    mapRow: (item) => ({
      image: item.featuredImage?.url ? (
        <img
          src={item.featuredImage.url}
          alt={item.featuredImage.altText ?? ""}
          style={{
            width: 40,
            height: 40,
            objectFit: "cover",
            borderRadius: 4,
            display: "block",
          }}
        />
      ) : (
        ""
      ),
      title: (item as any)[titleField],
      vendor: item.vendor,
      price: `${item.priceRange.minVariantPrice.amount} ${item.priceRange.minVariantPrice.currencyCode}`,
    }),
    getItemSummary: (item) => (item as any)[titleField],
    filterFields,
    initialFilters,
  };

  return field;
}

export function createFieldShopifyCollection<
  T extends ShopifyCollection = ShopifyCollection
>(options: SharedOptions & { first?: number } = {}) {
  const {
    titleField = "title",
    filterFields,
    initialFilters,
    first = 20,
  } = options;

  const client = resolveClient(options);

  const field: ExternalField<T> = {
    type: "external",
    placeholder: "Select a Shopify collection",
    showSearch: true,
    fetchList: async ({ query, filters = {} }) => {
      const { data, errors } = await client.request(COLLECTIONS_QUERY, {
        variables: {
          query: buildShopifyQuery(query, filters),
          first,
        },
      });

      if (errors?.graphQLErrors?.length) {
        throw new Error(errors.graphQLErrors.map((e) => e.message).join("; "));
      }

      return (data?.collections?.edges ?? []).map(
        (edge: { node: T }) => edge.node
      );
    },
    mapRow: (item) => ({
      title: (item as any)[titleField],
      handle: item.handle,
    }),
    getItemSummary: (item) => (item as any)[titleField],
    filterFields,
    initialFilters,
  };

  return field;
}
