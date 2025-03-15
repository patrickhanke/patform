import { useQuery } from "@apollo/client";
import { generateGraphQLQuery, paramsHandler } from "@repo/provider";
import { UserFindFormHook } from "../types";

const useFindForm: UserFindFormHook = ({ moduleId, filters }) => {
  const { loading, data, refetch } = useQuery(
    generateGraphQLQuery({
      type: "find",
      objectName: "Form",
      fields: ["objectId", "name", "createdAt", "description", "categories"],
    }),
    {
      variables: { params: paramsHandler({ moduleId, filters }) },
      notifyOnNetworkStatusChange: true,
    },
  );

  console.log(data);

  return {
    loading,
    forms: data ? data.objects.findForm.results : undefined,
    refetch,
  };
};

export default useFindForm;
