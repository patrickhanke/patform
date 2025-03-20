import { ApplicationTypes } from "@repo/types";

export type CommentInterfaceProps = {
  comments: ApplicationTypes.Comment[];
  addComment: (C: ApplicationTypes.Comment[]) => void;
};

export type CreateCommentProps = {
  addCommentHandler: (
    C: ApplicationTypes.Comment,
  ) => CommentInterfaceProps["addCommentHandler"];
};
