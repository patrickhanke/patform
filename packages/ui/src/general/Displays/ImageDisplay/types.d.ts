import { ApplicationTypes } from "@types";

export type ImageDisplayProps = {
  image: ApplicationTypes.Image;
  deleteHandler?: (I: ApplicationTypes.Image) => void;
};
