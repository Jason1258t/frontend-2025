import type { SlideObject } from "./slide-content";

type ObjectSelection = {
  id: string;
  objects: SlideObject[];
};

type SlideSelection = {
  id: string;
  slides: string[];
};

export type { ObjectSelection, SlideSelection };
