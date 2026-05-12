import { baseAPI } from "@/redux/api/api";

const settingsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: `/user/profile`,
        method: "GET",
      }),
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/user/update-profile`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = settingsAPI;
export default settingsAPI;
