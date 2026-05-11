import { baseAPI } from "@/redux/api/api";

const reportAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query({
      query: (params) => ({
        url: `/report`,
        method: "GET",
        params,
      }),
    }),
  }),
});

export const { useGetReportsQuery } = reportAPI;
export default reportAPI;
