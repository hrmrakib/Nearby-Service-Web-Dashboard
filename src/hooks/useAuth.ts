import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export function useAuth() {
  const { user, token, profileLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  return {
    user,
    token,
    profileLoading,

    isLoggedIn: !!user && !!token,

    isVerified: user?.verified ?? false,

    isAdmin: user?.role === "ADMIN",

    isUser: user?.role === "USER",
  };
}
