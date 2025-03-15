import { Filter, FilterOperator } from "@repo/types";
import { ParamsHandlerType } from "../types";

type FilterObject = { [key: string]: { [key in FilterOperator]: any } };

const paramsHandler: ParamsHandlerType = ({ projectId, moduleId, filters }) => {
  const filterObject: FilterObject = {};

  if (projectId) {
    filterObject.project = { _eq: projectId } as {
      [key in FilterOperator]: any;
    };
  }

  if (moduleId) {
    filterObject.module = { _eq: moduleId } as { [key in FilterOperator]: any };
  }

  let additionalFilters = {};

  if (filters && filters?.length > 0) {
    additionalFilters = filters?.reduce(
      (
        acc: { [key: string]: { [key in FilterOperator]: any } },
        filter: Filter
      ) => {
        acc[filter.key] = { [filter.operator]: filter.value } as {
          [key in FilterOperator]: any;
        };
        return acc;
      },
      {}
    );
  }

  return { ...filterObject, ...additionalFilters };
};

export default paramsHandler;
