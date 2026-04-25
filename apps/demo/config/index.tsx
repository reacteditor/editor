import { Typography } from "./components/typography";
import { Image } from "./components/image";
import { Button } from "./components/button";
import { Section } from "./components/section";
import { Container } from "./components/container";
import { Grid } from "./components/grid";
import { Stack } from "./components/stack";
import { Row } from "./components/row";
import { Columns } from "./components/columns";
import { Accordion } from "./components/accordion";
import { FeatureCard } from "./components/feature-card";
import { TestimonialCard } from "./components/testimonial-card";
import { PriceCard } from "./components/price-card";
import { TeamCard } from "./components/team-card";
import { Hero } from "./components/hero";
import { Logos } from "./components/logos";
import { Features } from "./components/features";
import { Testimonials } from "./components/testimonials";
import { Pricing } from "./components/pricing";
import { Team } from "./components/team";
import { CTA } from "./components/cta";
import { FAQ } from "./components/faq";
import { Navigation } from "./components/navigation";
import { Footer } from "./components/footer";

import Root from "./root";
import { UserConfig } from "./types";
import { initialData } from "./initial-data";

export const conf: UserConfig = {
  root: Root,
  categories: {
    layout: { title: "Layout" },
    navigation: { title: "Navigation" },
    sections: { title: "Sections" },
    cards: { title: "Cards" },
    elements: { title: "Elements" },
  },
  components: {
    "typography": Typography,
    "image": Image,
    "button": Button,
    "section": Section,
    "container": Container,
    "grid": Grid,
    "stack": Stack,
    "row": Row,
    "columns": Columns,
    "accordion": Accordion,
    "feature-card": FeatureCard,
    "testimonial-card": TestimonialCard,
    "price-card": PriceCard,
    "team-card": TeamCard,
    "hero": Hero,
    "logos": Logos,
    "features": Features,
    "testimonials": Testimonials,
    "pricing": Pricing,
    "team": Team,
    "cta": CTA,
    "faq": FAQ,
    "navigation": Navigation,
    "footer": Footer,
  },
};

export const componentKey = Buffer.from(
  `${Object.keys(conf.components).join("-")}-${JSON.stringify({ initialData })}`
).toString("base64");

export default conf;
