import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
import { API_URL, MOCK_SUBJECTS } from "./constants";
import { BaseRecord, DataProvider, GetListParams, GetListResponse } from "@refinedev/core";
// export const { dataProvider, kyInstance } = createSimpleRestDataProvider({
//   apiURL: API_URL,
// });

export const dataProvider: DataProvider = {
      getList: async <TData extends BaseRecord = BaseRecord>({ resource } : GetListParams) : Promise<GetListResponse<TData>> => {
          if(resource !== "subjects") {
              return { data: [] as TData[], total: 0 };
          }

          return {  
            data: MOCK_SUBJECTS as unknown as TData[],
            total: MOCK_SUBJECTS.length
           }
      },

      getOne: async () => { throw new Error("This func is not presented yet") },
      create: async () => { throw new Error("This func is not presented yet") },
      update: async () => { throw new Error("This func is not presented yet") },
      deleteOne: async () => { throw new Error("This func is not presented yet") },

      getApiUrl: () => ''
}
