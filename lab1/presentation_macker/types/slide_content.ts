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

type SlideObject = {
  id: string;
  content: Text | Image;
  position: Position;
  zIndex: number;
  rect: { width: number, height: number }
}

export type { Text, Image, SlideObject, Position }