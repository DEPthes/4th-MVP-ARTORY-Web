import type { RouteObject } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import SignupJobPage from "../pages/SignupJobPage";
import GoogleAuthCallback from "../pages/GoogleAuthCallback";

export const routes = [
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/signup/job", element: <SignupJobPage /> },
  { path: "/auth/google/callback", element: <GoogleAuthCallback /> },
] satisfies RouteObject[];
