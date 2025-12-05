import { useAppSelector } from "@/store";
import styles from "./PropertiesPanel.module.css";
import { selectEditingElement } from "@/store/selectors/objectsSelectors";
import { TextPropertiesPanel, ImagePropertiesPanel } from "./panels";

const PropertiesPanel = () => {
    const element = useAppSelector(selectEditingElement)!;

    return (
        <div className={styles.panel}>
            <h3 className={styles.title}>Свойства элемента</h3>
            <div className={styles.grid}>
                {element.type === "text" && (
                    <TextPropertiesPanel element={element} />
                )}
                {element.type === "image" && (
                    <ImagePropertiesPanel element={element} />
                )}
            </div>
        </div>
    );
};

export default PropertiesPanel;
