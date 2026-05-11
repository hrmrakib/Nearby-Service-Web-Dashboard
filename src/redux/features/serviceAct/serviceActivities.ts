import { baseAPI } from "@/redux/api/api";

const serviceActivitiesAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getPublishedServiceActivities: builder.query({
      query: (params) => ({
        url: `/service-activity`,
        method: "GET",
        params,
      }),
    }),
  }),
});

export const { useGetPublishedServiceActivitiesQuery } = serviceActivitiesAPI;
export default serviceActivitiesAPI;
