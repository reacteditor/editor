/* eslint-disable @next/next/no-img-element */
import React from "react";
import { ComponentConfig } from "@/core/types";
import { getClassNameFactory } from "@/core/lib";
import {
  createFieldShopifyProduct,
  ShopifyProduct as ShopifyProductEntry,
} from "@/field-shopify";
import styles from "./styles.module.css";
import { withLayout, WithLayout } from "../../components/Layout";

const getClassName = getClassNameFactory("ShopifyProduct", styles);

const productField = createFieldShopifyProduct({
  storeDomain: "mock.shop",
});

export type ShopifyProductProps = WithLayout<{
  product: ShopifyProductEntry | null;
}>;

const ShopifyProductInner: ComponentConfig<ShopifyProductProps> = {
  fields: {
    product: productField,
  },
  render: ({ product }) => {
    if (!product) {
      return (
        <div className={getClassName()}>
          <div className={getClassName("placeholder")}>
            Select a Shopify product
          </div>
        </div>
      );
    }

    const price = product.priceRange?.minVariantPrice;

    return (
      <div className={getClassName()}>
        {product.featuredImage?.url ? (
          <img
            className={getClassName("image")}
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
          />
        ) : (
          <div className={getClassName("placeholder")}>No image</div>
        )}
        {product.vendor ? (
          <div className={getClassName("vendor")}>{product.vendor}</div>
        ) : null}
        <div className={getClassName("title")}>{product.title}</div>
        {price ? (
          <div className={getClassName("price")}>
            {price.amount} {price.currencyCode}
          </div>
        ) : null}
        {product.description ? (
          <div className={getClassName("description")}>
            {product.description}
          </div>
        ) : null}
      </div>
    );
  },
};

export const ShopifyProduct = withLayout(ShopifyProductInner);
