import { useQuery } from "@apollo/client";
import { generateGraphQLQuery, paramsHandler } from "@repo/provider";
import { UseFindNewsHook } from "../types";

const useFindNews: UseFindNewsHook = ({ moduleId, filters }) => {
  const { loading, data, refetch } = useQuery(
    generateGraphQLQuery({
      type: "find",
      objectName: "News",
      fields: ["objectId", "title", "image", "createdAt", "text", "data"],
    }),
    {
      variables: { params: paramsHandler({ moduleId, filters }) },
      notifyOnNetworkStatusChange: true,
    },
  );

  return {
    loading,
    news: data ? data.objects.findNews.results : undefined,
    refetch,
  };
};

export default useFindNews;
