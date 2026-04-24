import { Config, Data } from "@/core";
import { TypographyProps } from "./blocks/Typography";
import { ImageProps } from "./blocks/Image";
import { ButtonBlockProps } from "./blocks/Button";
import { SectionProps } from "./blocks/Section";
import { ContainerProps } from "./blocks/Container";
import { GridProps } from "./blocks/Grid";
import { StackProps } from "./blocks/Stack";
import { RowProps } from "./blocks/Row";
import { ColumnsProps } from "./blocks/Columns";
import { AccordionProps } from "./blocks/Accordion";
import { FeatureCardProps } from "./blocks/FeatureCard";
import { TestimonialCardProps } from "./blocks/TestimonialCard";
import { PriceCardProps } from "./blocks/PriceCard";
import { TeamCardProps } from "./blocks/TeamCard";
import { HeroProps } from "./blocks/Hero";
import { LogosProps } from "./blocks/Logos";
import { FeaturesProps } from "./blocks/Features";
import { TestimonialsProps } from "./blocks/Testimonials";
import { PricingProps } from "./blocks/Pricing";
import { TeamProps } from "./blocks/Team";
import { CTAProps } from "./blocks/CTA";
import { FAQProps } from "./blocks/FAQ";
import { NavigationProps } from "./blocks/Navigation";
import { NavBarProps } from "./blocks/NavBar";
import { FooterProps } from "./blocks/Footer";

import { RootProps } from "./root";

export type { RootProps } from "./root";

export type Components = {
  Typography: TypographyProps;
  Image: ImageProps;
  Button: ButtonBlockProps;
  Section: SectionProps;
  Container: ContainerProps;
  Grid: GridProps;
  Stack: StackProps;
  Row: RowProps;
  Columns: ColumnsProps;
  Accordion: AccordionProps;
  FeatureCard: FeatureCardProps;
  TestimonialCard: TestimonialCardProps;
  PriceCard: PriceCardProps;
  TeamCard: TeamCardProps;
  Hero: HeroProps;
  Logos: LogosProps;
  Features: FeaturesProps;
  Testimonials: TestimonialsProps;
  Pricing: PricingProps;
  Team: TeamProps;
  CTA: CTAProps;
  FAQ: FAQProps;
  Navigation: NavigationProps;
  NavBar: NavBarProps;
  Footer: FooterProps;
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
