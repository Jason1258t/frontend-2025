import type { SlideObject } from "./slide_content.js";
import type { SlideTheme } from "./slide_theme.js";

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