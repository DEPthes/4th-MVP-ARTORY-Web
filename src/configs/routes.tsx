import type { RouteObject } from "react-router-dom";
import HomePage from "../pages/HomePage";

export const routes = [
  { path: "/", element: <HomePage /> },
] satisfies RouteObject[];
