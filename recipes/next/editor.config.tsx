import type { Config } from "@reacteditor/core";
import { Hero, type HeroProps } from "@/config/components/hero";

type Props = {
  "hero": HeroProps;
};

export const config: Config<Props> = {
  components: {
    "hero": Hero,
  },
};

export default config;
