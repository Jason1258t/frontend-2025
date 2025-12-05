import React from "react";
import Sidebar from "./view/Sidebar";
import Toolbar from "./view/Toolbar";
import Canvas from "./view/Canvas";
import PropertiesPanel from "./view/PropertiesPanel";

import styles from "./App.module.css";
import { useAppDispatch, useAppSelector } from "./store/store";
import { setTitle } from "./store/slices/presentationSlice";
import { selectEditingElement } from "./store/selectors/objectsSelectors";

const App = () => {
    const dispatch = useAppDispatch();
    const { title } = useAppSelector((state) => state.presentation);
    const selectedElement = useAppSelector(selectEditingElement);

    const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
        console.log(
            "Mouse Down on Element",
            elementId,
            "at",
            e.clientX,
            e.clientY
        );
    };
    const handleMouseMove = (e: React.MouseEvent) => {
        console.log("Mouse Move", e.clientX, e.clientY);
    };
    const handleMouseUp = () => {
        console.log("Mouse Up");
    };

    return (
        <div className={styles.app}>
            <div className={styles.header}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <p className={styles.headerTitle}>Название</p>
                    <input
                        className={styles.headerInput}
                        value={title}
                        onChange={(e) => {
                            let value = e.target.value;
                            if (value.length === 0) {
                                value = "Новая презентация";
                            }
                            dispatch(setTitle(value));
                        }}
                    />
                </div>
            </div>
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                <Sidebar />
                <div className={styles.mainArea}>
                    <Toolbar />
                    <Canvas />
                    {selectedElement && <PropertiesPanel />}
                </div>
            </div>
        </div>
    );
};

export default App;
