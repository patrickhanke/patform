import { useQuery } from "@apollo/client";
import { generateGraphQLQuery, paramsHandler } from "@repo/provider";
import { UseFindDownloadHook } from "../types";

const useFindDownload: UseFindDownloadHook = ({ moduleId, filters }) => {
  const { loading, data, refetch } = useQuery(
    generateGraphQLQuery({
      type: "find",
      objectName: "Download",
      fields: ["objectId", "label", "title", "image", "file"],
    }),
    {
      variables: { params: paramsHandler({ moduleId, filters }) },
      notifyOnNetworkStatusChange: true,
    },
  );

  return {
    loading,
    downloads: data ? data.objects.findDownload.results : undefined,
    refetch,
  };
};

export default useFindDownload;
