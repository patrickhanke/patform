import { ApplicationTypes } from "@types";

export type CommentInterfaceProps = {
  comments: ApplicationTypes.Comment[];
  addComment: (C: ApplicationTypes.Comment[]) => void;
};

export type CreateCommentProps = {
  addCommentHandler: (
    C: ApplicationTypes.Comment,
  ) => CommentInterfaceProps["addCommentHandler"];
};
