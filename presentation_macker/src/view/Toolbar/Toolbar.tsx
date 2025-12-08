import { Type, ImageIcon, Trash2, Palette, Undo, Redo } from "lucide-react";

import styles from "./Toolbar.module.css";
import ThemeOverlay from "./ThemeOverlay";

import { useToolbar } from "./hooks/usetToolbar";

const Toolbar = () => {
    const {
        onAddImage,
        onAddText,
        showSlideAction,
        onChangeBackground,
        undo,
        redo,
        canRedo,
        canUndo,
        deleteSelectedObjects,
        showDeleteAction,
        showOverlay,
        closeOverlay,
    } = useToolbar();

    return (
        <div className={styles.toolbar}>
            <div className={styles.toolbarContent}>
                {showSlideAction && (
                    <>
                        <button
                            onClick={onAddText}
                            className={styles.toolButton}
                        >
                            <Type size={20} />
                            Текст
                        </button>
                        <button
                            onClick={onAddImage}
                            className={styles.toolButton}
                        >
                            <ImageIcon size={20} />
                            Изображение
                        </button>
                        <button
                            onClick={onChangeBackground}
                            className={styles.toolButton}
                        >
                            <Palette size={20} />
                            Сменить фон
                        </button>
                    </>
                )}
                <button
                    onClick={undo}
                    className={styles.toolButton}
                    disabled={!canUndo}
                >
                    <Undo size={20} />
                </button>

                <button
                    onClick={redo}
                    className={styles.toolButton}
                    disabled={!canRedo}
                >
                    <Redo size={20} />
                </button>
                {showDeleteAction && (
                    <button
                        onClick={deleteSelectedObjects}
                        className={`${styles.toolButton} ${styles.deleteButton}`}
                    >
                        <Trash2 size={20} />
                        Удалить
                    </button>
                )}
            </div>
            {showOverlay && <ThemeOverlay onClose={closeOverlay} />}
        </div>
    );
};

export default Toolbar;
