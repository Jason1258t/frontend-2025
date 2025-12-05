type Text = {
  value: string;
  fontFamily: string;
  fontSize: number;
  color: string;
}

type Image = {
  src: string;
}

type Position = {
 x: number, y: number
} 

type Size = {
  width: number; height: number
}

type BaseSlideObject = {
  id: string;
  position: Position;
  zIndex: number;
  rect: Size;
};

type TextObject = BaseSlideObject & {
  type: 'text';
  content: Text;
};

type ImageObject = BaseSlideObject & {
  type: 'image';
  content: Image;
};

export const TEXT_RECT = { width: 200, height: 50 };
export const IMAGE_RECT = { width: 200, height: 150 };

type SlideObject = TextObject | ImageObject;

export type { Text, Image, SlideObject, Position, TextObject, ImageObject, Size };