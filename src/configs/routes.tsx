import type { RouteObject } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupJobPage from "../pages/SignupJobPage";
import SignupProfilePage from "../pages/SignupProfilePage";
import GoogleAuthCallback from "../pages/GoogleAuthCallback";

export const routes = [
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup/job", element: <SignupJobPage /> },
  { path: "/signup/profile", element: <SignupProfilePage /> },
  { path: "/auth/google/callback", element: <GoogleAuthCallback /> },
] satisfies RouteObject[];
