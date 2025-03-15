import { FIND_PROPERY_DOCUMENTS } from "@queries";
import { useQuery } from "@apollo/client";

const paramsHandler = (id?: string, type?: string) => {
  if (id && type === "all") return { object: { _eq: id } };
  if (id && type === "task")
    return { object: { _eq: id }, _and: { type: { _eq: "task" } } };
  if (id && type === "object")
    return { object: { _eq: id }, _and: { type: { _eq: "object" } } };
  return undefined;
};

const useFindObjectsDocuments = ({
  id,
  type,
}: {
  id: string;
  type: string;
}) => {
  const { data, loading, refetch } = useQuery(FIND_PROPERY_DOCUMENTS, {
    notifyOnNetworkStatusChange: true,
    variables: { params: paramsHandler(id, type) },
  });

  return {
    loading,
    data: data ? data.objects.findDocument.results : undefined,
    refetch,
  };
};

export default useFindObjectsDocuments;
