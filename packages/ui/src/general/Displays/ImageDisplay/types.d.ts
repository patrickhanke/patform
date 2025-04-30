import { ApplicationTypes } from "@repo/types";

export type ImageDisplayProps = {
  image: ApplicationTypes.Image;
  deleteHandler?: (I: ApplicationTypes.Image) => void;
  
};
