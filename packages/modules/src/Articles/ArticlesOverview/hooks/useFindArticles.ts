import { useQuery } from "@apollo/client";
import { generateGraphQLQuery, paramsHandler } from "@repo/provider";
import { UseFindArticlesHook } from "../types";

const useFindArticles: UseFindArticlesHook = ({ moduleId, filters }) => {
  const { loading, data, refetch } = useQuery(
    generateGraphQLQuery({
      type: "find",
      objectName: "Article",
      fields: [
        "objectId",
        "title",
        "image",
        "createdAt",
        "data",
        "state",
        "text",
        "gallery",
        "date",
        "categories",
        "author {objectId label portrait}",
      ],
    }),
    {
      variables: { params: paramsHandler({ moduleId, filters }) },
      notifyOnNetworkStatusChange: true,
    }
  );

  return {
    loading,
    articles: data ? data.objects.findArticle.results : undefined,
    refetch,
  };
};

export default useFindArticles;
