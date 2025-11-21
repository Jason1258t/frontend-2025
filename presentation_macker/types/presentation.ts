export default interface Presentation {
  id: string;
  title: string;
  description?: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}