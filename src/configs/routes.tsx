import type { RouteObject } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupJobPage from "../pages/SignupJobPage";
import SignupProfilePage from "../pages/SignupProfilePage";
import GoogleAuthCallback from "../pages/GoogleAuthCallback";
import ProfilePage from "../pages/ProfilePage";
import ArtistNotePage from "../pages/ArtistNotePage";
import ArtistDetailPage from "../pages/ArtistDetailPage";
import SearchResultPage from "../pages/SearchResultPage";

export const routes = [
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/search", element: <SearchResultPage /> },
  { path: "/note", element: <ArtistNotePage /> },
  { path: "/artist/:artistId", element: <ArtistDetailPage /> },
  { path: "/signup/job", element: <SignupJobPage /> },
  { path: "/signup/profile", element: <SignupProfilePage /> },
  { path: "/auth/google/callback", element: <GoogleAuthCallback /> },
  { path: "/profile/:userId", element: <ProfilePage /> },
] satisfies RouteObject[];
