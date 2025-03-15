import { Filter, ArticleClass } from "@repo/types";
import { PageCreateClassObject } from "@repo/ui";

type FilterArray = Filter[];

export type UseFindArticlesHook = ({
  moduleId: string,
  filters: FilterArray,
}) => {
  loading: boolean;
  articles?: ArticleClass[];
  refetch: () => void;
};

export type CreateArticle = (
  persons: { value: string; label: string }[]
) => PageCreateClassObject;

export type DeleteModalProps = {
  isOpen: boolean;
  confirmButtonHandler: () => void;
  header: "Bericht löschen";
};
