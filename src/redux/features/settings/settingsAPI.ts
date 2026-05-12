import { baseAPI } from "@/redux/api/api";

const settingsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: `/user/profile`,
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/user/update-profile`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    updatePassword: builder.mutation({
      query: (data) => ({
        url: `/auth/change-password`,
        method: "POST",
        body: data,
      }),
    }),

    getTermsAndConditions: builder.query({
      query: () => ({
        url: `/terms`,
        method: "GET",
      }),
      providesTags: ["TermsAndConditions"],
    }),

    setTermsAndConditions: builder.mutation({
      query: (data) => ({
        url: `/terms`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["TermsAndConditions"],
    }),

    getTrustAndSafety: builder.query({
      query: () => ({
        url: `/trust-and-safety`,
        method: "GET",
      }),
    }),

    setTrustAndSafety: builder.mutation({
      query: (data) => ({
        url: `/trust-and-safety`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useGetTermsAndConditionsQuery,
  useSetTermsAndConditionsMutation,
} = settingsAPI;
export default settingsAPI;
