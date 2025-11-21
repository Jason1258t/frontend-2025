import type Presentation from "../types/presentation.js";

export default function changeTitle(presentation: Presentation, newTitle: string): Presentation {
  let newPresentation = {...presentation};
  newPresentation.title = newTitle;
  return newPresentation;
}