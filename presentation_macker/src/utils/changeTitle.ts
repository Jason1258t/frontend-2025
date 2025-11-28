import type { Presentation } from "@/types/presentation";
import { deepCopy } from "./deepCopy";

export const changeTitle = (
  presentation: Presentation,
  newTitle: string
): Presentation => {
  const newPresentation = deepCopy(presentation);
  newPresentation.title = newTitle;
  newPresentation.updatedAt = new Date();
  return newPresentation;
};
