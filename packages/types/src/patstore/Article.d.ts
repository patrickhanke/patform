import { ClassProperties, ClassState } from "../patflow/Classes";
import { PersonClass } from "../patflow/Person";

export type ArticleClass = ClassProperties & {
  title: string;
  image: string;
  createdAt: string;
  text: string;
  gallery: string[];
  date: string;
  state: ClassState["value"];
  author: PersonClass;
};
