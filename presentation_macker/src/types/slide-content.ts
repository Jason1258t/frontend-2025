type Text = {
  id: string;
  value: string;
  fontFamily: string;
  fontSize: number;
  color: string;
}

type Image = {
  id: string;
  src: string;
}

type Position = {
 x: number, y: number
} 

type BaseSlideObject = {
  id: string;
  position: Position;
  zIndex: number;
  rect: { width: number; height: number };
};

type TextObject = BaseSlideObject & {
  type: 'text';
  content: Text;
};

type ImageObject = BaseSlideObject & {
  type: 'image';
  content: Image;
};

type SlideObject = TextObject | ImageObject;

export type { Text, Image, SlideObject, Position }