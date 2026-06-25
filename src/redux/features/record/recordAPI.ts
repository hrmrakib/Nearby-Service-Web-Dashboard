import baseAPI from "@/redux/api/api";

const recordAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getRecords: builder.query({
      query: (params) => ({
        url: `/record`,
        method: "GET",
        params,
      }),
    }),

    markAsPaid: builder.mutation({
      query: (recordId) => ({
        url: `/record/paid/${recordId}`,
        method: "PATCH",
      }),
    }),
  }),
});

export const { useGetRecordsQuery, useMarkAsPaidMutation } = recordAPI;
