import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";
import { API_BASE_URL } from "./constants";
import { GetOneResponse, ListResponse } from "@/types";
import { HttpError } from "@refinedev/core";

const buildHttpError = async (response: Response): Promise<HttpError> => {
  let message = "Request failed.";

  try {
    const payload = (await response.json()) as { message: string };

    if (payload?.message) message = payload.message;
  } catch {}

  return {
    message,
    statusCode: response.status,
  };
};

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

        if (resource === "classes") {
          if (field === "name") params.search = value;
          if (field === "teacher") params.teacherName = value;
          if (field === "subject") params.subjectName = value;
          if (field === "status") params.status = value;
        }
      });

      return params;
    },

    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      const payload: ListResponse = await response.clone().json();

      return payload.data ?? [];
    },
    getTotalCount: async (response) => {
      const payload: ListResponse = await response.clone().json();

      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },

  create: {
    getEndpoint: ({ resource }) => resource,

    buildBodyParams: async ({ variables }) => variables,

    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      const payload: ListResponse = await response.clone().json();

      return payload.data ?? [];
    },
  },

  getOne: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,
    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      const payload: GetOneResponse = await response.clone().json();

      return payload.data ?? [];
    },
  },
};

export const { dataProvider } = createDataProvider(API_BASE_URL, options);
