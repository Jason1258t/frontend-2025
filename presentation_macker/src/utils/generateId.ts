import { nanoid } from "nanoid";

export const generateId = (prefix?: string) => {
    let id = "";
    if (prefix) id += prefix + "_";
    return id + nanoid();
};
