import type { RouteObject } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";

export const routes = [
  { path: "/", element: <HomePage /> },
  { path: "/profile/:userId", element: <ProfilePage /> },
] satisfies RouteObject[];
