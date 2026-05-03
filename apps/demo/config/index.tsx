import { typographyEditor } from "@/components/typography/typography.editor";
import { imageEditor } from "@/components/image/image.editor";
import { buttonEditor } from "@/components/button/button.editor";
import { sectionEditor } from "@/components/section/section.editor";
import { containerEditor } from "@/components/container/container.editor";
import { gridEditor } from "@/components/grid/grid.editor";
import { stackEditor } from "@/components/stack/stack.editor";
import { rowEditor } from "@/components/row/row.editor";
import { columnsEditor } from "@/components/columns/columns.editor";
import { accordionEditor } from "@/components/accordion/accordion.editor";
import { featureCardEditor } from "@/components/feature-card/feature-card.editor";
import { testimonialCardEditor } from "@/components/testimonial-card/testimonial-card.editor";
import { priceCardEditor } from "@/components/price-card/price-card.editor";
import { teamCardEditor } from "@/components/team-card/team-card.editor";
import { heroEditor } from "@/components/hero/hero.editor";
import { logosEditor } from "@/components/logos/logos.editor";
import { featuresEditor } from "@/components/features/features.editor";
import { testimonialsEditor } from "@/components/testimonials/testimonials.editor";
import { pricingEditor } from "@/components/pricing/pricing.editor";
import { teamEditor } from "@/components/team/team.editor";
import { ctaEditor } from "@/components/cta/cta.editor";
import { faqEditor } from "@/components/faq/faq.editor";
import { navigationEditor } from "@/components/navigation/navigation.editor";
import { footerEditor } from "@/components/footer/footer.editor";

import Root from "./root";
import { UserConfig } from "./types";

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
    "typography": typographyEditor,
    "image": imageEditor,
    "button": buttonEditor,
    "section": sectionEditor,
    "container": containerEditor,
    "grid": gridEditor,
    "stack": stackEditor,
    "row": rowEditor,
    "columns": columnsEditor,
    "accordion": accordionEditor,
    "feature-card": featureCardEditor,
    "testimonial-card": testimonialCardEditor,
    "price-card": priceCardEditor,
    "team-card": teamCardEditor,
    "hero": heroEditor,
    "logos": logosEditor,
    "features": featuresEditor,
    "testimonials": testimonialsEditor,
    "pricing": pricingEditor,
    "team": teamEditor,
    "cta": ctaEditor,
    "faq": faqEditor,
    "navigation": navigationEditor,
    "footer": footerEditor,
  },
};

export const componentKey = Buffer.from(
  Object.keys(conf.components).join("-")
).toString("base64");

export default conf;
