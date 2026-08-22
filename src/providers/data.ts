import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";
import { API_BASE_URL } from "./constants";
import { ListResponse } from "@/types";

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,

    buildQueryParams: async ({ resource, pagination, filters, sorters }) => {
      const page = pagination?.currentPage ?? 1;
      const limit = pagination?.pageSize ?? 10;

      const params: Record<string, string | number> = { page, limit };

      const sorter = sorters && sorters.length > 0 ? sorters[0] : null;
      params.sort = sorter?.field ?? "id";
      params.order = sorter?.order ?? "desc";

      filters?.forEach((filter) => {
        const field = "field" in filter ? filter.field : "";
        const value = String(filter.value);

        if (resource === "subjects") {
          if (field === "department") params.department = value;
          if (field === "name" || field === "code") params.search = value;
        }
      });

      return params;
    },

    mapResponse: async (response) => {
      const payload: ListResponse = await response.clone().json();

      return payload.data ?? [];
    },
    getTotalCount: async (response) => {
      const payload: ListResponse = await response.clone().json();

      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },
};

export const { dataProvider } = createDataProvider(API_BASE_URL, options);
