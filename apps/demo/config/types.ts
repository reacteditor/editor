import { Config, Data } from "@/core";
import { TypographyProps } from "./components/typography";
import { ImageProps } from "./components/image";
import { ButtonBlockProps } from "./components/button";
import { SectionProps } from "./components/section";
import { ContainerProps } from "./components/container";
import { GridProps } from "./components/grid";
import { StackProps } from "./components/stack";
import { RowProps } from "./components/row";
import { ColumnsProps } from "./components/columns";
import { AccordionProps } from "./components/accordion";
import { FeatureCardProps } from "./components/feature-card";
import { TestimonialCardProps } from "./components/testimonial-card";
import { PriceCardProps } from "./components/price-card";
import { TeamCardProps } from "./components/team-card";
import { HeroProps } from "./components/hero";
import { LogosProps } from "./components/logos";
import { FeaturesProps } from "./components/features";
import { TestimonialsProps } from "./components/testimonials";
import { PricingProps } from "./components/pricing";
import { TeamProps } from "./components/team";
import { CTAProps } from "./components/cta";
import { FAQProps } from "./components/faq";
import { NavigationProps } from "./components/navigation";
import { FooterProps } from "./components/footer";

import { RootProps } from "./root";

export type { RootProps } from "./root";

export type Components = {
  "typography": TypographyProps;
  "image": ImageProps;
  "button": ButtonBlockProps;
  "section": SectionProps;
  "container": ContainerProps;
  "grid": GridProps;
  "stack": StackProps;
  "row": RowProps;
  "columns": ColumnsProps;
  "accordion": AccordionProps;
  "feature-card": FeatureCardProps;
  "testimonial-card": TestimonialCardProps;
  "price-card": PriceCardProps;
  "team-card": TeamCardProps;
  "hero": HeroProps;
  "logos": LogosProps;
  "features": FeaturesProps;
  "testimonials": TestimonialsProps;
  "pricing": PricingProps;
  "team": TeamProps;
  "cta": CTAProps;
  "faq": FAQProps;
  "navigation": NavigationProps;
  "footer": FooterProps;
};

export type UserConfig = Config<{
  components: Components;
  root: RootProps;
  categories: [
    "layout",
    "navigation",
    "sections",
    "cards",
    "elements"
  ];
  fields: {
    userField: {
      type: "userField";
      option: boolean;
    };
  };
}>;

export type UserData = Data<Components, RootProps>;
