import { Typography } from "./components/Typography";
import { Image } from "./components/Image";
import { Button } from "./components/Button";
import { Section } from "./components/Section";
import { Container } from "./components/Container";
import { Grid } from "./components/Grid";
import { Stack } from "./components/Stack";
import { Row } from "./components/Row";
import { Columns } from "./components/Columns";
import { Accordion } from "./components/Accordion";
import { FeatureCard } from "./components/FeatureCard";
import { TestimonialCard } from "./components/TestimonialCard";
import { PriceCard } from "./components/PriceCard";
import { TeamCard } from "./components/TeamCard";
import { Hero } from "./components/Hero";
import { Logos } from "./components/Logos";
import { Features } from "./components/Features";
import { Testimonials } from "./components/Testimonials";
import { Pricing } from "./components/Pricing";
import { Team } from "./components/Team";
import { CTA } from "./components/CTA";
import { FAQ } from "./components/FAQ";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";

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
    Typography,
    Image,
    Button,
    Section,
    Container,
    Grid,
    Stack,
    Row,
    Columns,
    Accordion,
    FeatureCard,
    TestimonialCard,
    PriceCard,
    TeamCard,
    Hero,
    Logos,
    Features,
    Testimonials,
    Pricing,
    Team,
    CTA,
    FAQ,
    Navigation,
    Footer,
  },
};

export const componentKey = Buffer.from(
  `${Object.keys(conf.components).join("-")}-${JSON.stringify({ initialData })}`
).toString("base64");

export default conf;
