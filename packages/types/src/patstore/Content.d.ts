import { ClassProperties } from "./Classes";

export type ContentClass = ClassProperties & {
  type: 'text' | 'image' | 'video';
  content: string;
  name: string;
  active: boolean;
  content_id: string;
};