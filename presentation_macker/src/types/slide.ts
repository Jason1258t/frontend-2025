import type { SlideObject } from "./slide-content";
import type { SlideTheme } from "./slide-theme";

type Slide = {
  id: string;
  preview: string;
  theme: SlideTheme;
  content: SlideObject[];
}

type SlidesCollection = {
  id: string;
  slides: Slide[];
}

export type { Slide, SlidesCollection };