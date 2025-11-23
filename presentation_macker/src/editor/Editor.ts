import type { Presentation } from "@/types";
import { createMaximalPresentation } from "@/tests/testData";

export let editor: Presentation = createMaximalPresentation();
let editorChangeHandler: () => void | null;

function setEditor(newEditor: Presentation) {
    editor = newEditor;
}

// function getEditor(): Presentation {
//     return editor;
// }

export function addEditorChangeHandler(handler: () => any) {
    editorChangeHandler = handler;
}

export function dispatch(modifyFunc: (payload: any) => Presentation, payload: any) {
    const newEditor = modifyFunc(payload);
    setEditor(newEditor);
    if (editorChangeHandler) {
        editorChangeHandler();
    }
}