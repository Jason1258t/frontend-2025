import type { Text } from "../types/slide_content.js";

function changeTextValue(text: Text, newValue: string): Text {
  return {...text, value: newValue};
}

function changeFontSize(text: Text, size: number): Text {
  return {...text, fontSize: size};
}

function changeFontFamily(text: Text, fontFamily: string): Text {
  return {...text, fontFamily: fontFamily};
}
