import type { ObjectSelection, SlideSelection } from "./selection";
import type { SlidesCollection } from "./slide";

export default interface Presentation {
  id: string;
  title: string;
  description?: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  currentSlideId: string | null;
  slidesCollection: SlidesCollection;
  slideSelection: SlideSelection | null;
  objectSelection: ObjectSelection | null;
}