import type { Presentation } from "@/types";
import { createMaximalPresentation } from "@/tests/testData";

let editor: Presentation = createMaximalPresentation();
let editorChangeHandler: () => void | null;

function setEditor(newEditor: Presentation) {
  editor = newEditor;
}

export const useEditor = () => [editor, dispatch];

export function getEditor(): Presentation {
  return editor;
}

export function addEditorChangeHandler(handler: () => any) {
  editorChangeHandler = handler;
}

export function dispatch(
  modifyFunc: (presentation: Presentation, payload: any) => Presentation,
  payload: any
) {
  const newEditor = modifyFunc(editor, payload);
  setEditor(newEditor);
  if (editorChangeHandler) {
    editorChangeHandler();
  }
}
