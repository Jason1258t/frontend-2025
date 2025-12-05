import {
    changeFontSize,
    changeObjectColor,
    useAppDispatch,
    useAppSelector,
} from "@/store";
import styles from "./PropertiesPanel.module.css";
import { selectEditingElement } from "@/store/selectors/objectsSelectors";

const PropertiesPanel = () => {
    const element = useAppSelector(selectEditingElement)!;
    const slideId = useAppSelector((state) => state.slides.currentSlideId)!;
    const dispatch = useAppDispatch();

    return (
        <div className={styles.panel}>
            <h3 className={styles.title}>Свойства элемента</h3>
            <div className={styles.grid}>
                {element.type === "text" && (
                    <>
                        <div className={styles.field}>
                            <label className={styles.label}>
                                Размер шрифта
                            </label>
                            <input
                                type="number"
                                value={element.content.fontSize}
                                onChange={(e) =>
                                    dispatch(
                                        changeFontSize({
                                            slideId,
                                            objectId: element.id,
                                            size: parseInt(e.target.value),
                                        })
                                    )
                                }
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Цвет</label>
                            <input
                                type="color"
                                value={element.content.color}
                                onChange={(e) =>
                                    dispatch(
                                        changeObjectColor({
                                            slideId,
                                            objectId: element.id,
                                            color: e.target.value,
                                        })
                                    )
                                }
                                className={`${styles.colorInput} ${styles.input}`}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PropertiesPanel;
