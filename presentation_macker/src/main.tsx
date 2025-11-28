import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { getEditor, addEditorChangeHandler } from "@/editor/Editor.ts";

const root = createRoot(document.getElementById("root")!);

const renderApp = () => {
  root.render(
    <StrictMode>
      <App editor={getEditor()} />
    </StrictMode>
  );
};

addEditorChangeHandler(renderApp);
renderApp();
