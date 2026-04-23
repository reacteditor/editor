import {
  AlignHorizontalJustifyStart,
  BarChart3,
  CreditCard,
  FileText,
  Heading as HeadingIcon,
  Images,
  LayoutGrid,
  LayoutTemplate,
  Megaphone,
  MousePointerClick,
  Move,
  PanelTop,
  PanelBottom,
  ShoppingBag,
  Type,
} from "lucide-react";

import { Button } from "./blocks/Button";
import { Card } from "./blocks/Card";
import { Grid } from "./blocks/Grid";
import { Hero } from "./blocks/Hero";
import { Heading } from "./blocks/Heading";
import { Flex } from "./blocks/Flex";
import { Logos } from "./blocks/Logos";
import { Stats } from "./blocks/Stats";
import { Template } from "./blocks/Template";
import { Text } from "./blocks/Text";
import { Space } from "./blocks/Space";
import { RichText } from "./blocks/RichText";
import { ShopifyProduct } from "./blocks/ShopifyProduct";
import { SiteHeader } from "./blocks/SiteHeader";
import { SiteFooter } from "./blocks/SiteFooter";

import Root from "./root";
import { UserConfig } from "./types";
import { initialData } from "./initial-data";

// We avoid the name config as next gets confused
export const conf: UserConfig = {
  root: Root,
  categories: {
    layout: { title: "Layout" },
    typography: { title: "Typography" },
    interactive: { title: "Actions" },
    other: { title: "Other" },
    commerce: { title: "Commerce" },
    site: { title: "Site" },
  },
  components: {
    Button,
    Card,
    Grid,
    Hero,
    Heading,
    Flex,
    Logos,
    Stats,
    Template,
    Text,
    Space,
    RichText,
    ShopifyProduct,
    SiteHeader,
    SiteFooter,
  },
  blocks: {
    Grid: {
      label: "Grid",
      icon: <LayoutGrid size={16} />,
      category: "layout",
      component: "Grid",
    },
    Flex: {
      label: "Flex",
      icon: <AlignHorizontalJustifyStart size={16} />,
      category: "layout",
      component: "Flex",
    },
    Space: {
      label: "Space",
      icon: <Move size={16} />,
      category: "layout",
      component: "Space",
    },
    Heading: {
      label: "Heading",
      icon: <HeadingIcon size={16} />,
      category: "typography",
      component: "Heading",
    },
    Text: {
      label: "Text",
      icon: <Type size={16} />,
      category: "typography",
      component: "Text",
    },
    RichText: {
      label: "Rich text",
      icon: <FileText size={16} />,
      category: "typography",
      component: "RichText",
      props: { richtext: "<h2>Heading</h2><p>Body</p>" },
    },
    Button: {
      label: "Button",
      icon: <MousePointerClick size={16} />,
      category: "interactive",
      component: "Button",
    },
    Card: {
      label: "Card",
      icon: <CreditCard size={16} />,
      category: "other",
      component: "Card",
    },
    Hero: {
      label: "Hero",
      icon: <Megaphone size={16} />,
      category: "other",
      component: "Hero",
      props: { description: "<p>Description</p>", padding: "64px" },
    },
    Logos: {
      label: "Logos",
      icon: <Images size={16} />,
      category: "other",
      component: "Logos",
    },
    Stats: {
      label: "Stats",
      icon: <BarChart3 size={16} />,
      category: "other",
      component: "Stats",
    },
    Template: {
      label: "Template",
      icon: <LayoutTemplate size={16} />,
      category: "other",
      component: "Template",
      props: { template: "example_1" },
    },
    ShopifyProduct: {
      label: "Shopify product",
      icon: <ShoppingBag size={16} />,
      category: "commerce",
      component: "ShopifyProduct",
      props: { product: null },
    },
    ProductGrid: {
      label: "Product grid",
      icon: <ShoppingBag size={16} />,
      category: "commerce",
      content: {
        type: "Grid",
        props: {
          numColumns: 3,
          gap: 24,
          items: [
            { type: "ShopifyProduct", props: {} },
            { type: "ShopifyProduct", props: {} },
            { type: "ShopifyProduct", props: {} },
          ],
        },
      },
    },
    SiteHeader: {
      label: "Site header",
      icon: <PanelTop size={16} />,
      category: "site",
      component: "SiteHeader",
    },
    SiteFooter: {
      label: "Site footer",
      icon: <PanelBottom size={16} />,
      category: "site",
      component: "SiteFooter",
    },
  },
};

export const componentKey = Buffer.from(
  `${Object.keys(conf.components).join("-")}-${JSON.stringify({
    initialData,
  })}`
).toString("base64");

export default conf;
