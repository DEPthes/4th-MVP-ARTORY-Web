import type { RouteObject } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupJobPage from "../pages/SignupJobPage";
import SignupProfilePage from "../pages/SignupProfilePage";
import GoogleAuthCallback from "../pages/GoogleAuthCallback";
import ProfilePage from "../pages/ProfilePage";
import CollectionPage from "../pages/CollectionPage"; // 🔹 컬렉션 페이지 import
import ExhibitionPage from "../pages/ExhibitionPage"; // ⬅️ 새로 추가
import ContestPage from "../pages/ContestPage";
import ArtistNotePage from "../pages/ArtistNotePage";
import SearchResultPage from "../pages/SearchResultPage";
import ArtistDetailPage from "../pages/ArtistDetailPage";

export const routes = [
  { path: "/", element: <HomePage /> },
  { path: "/note", element: <ArtistNotePage /> },
  { path: "/artist/:artistId", element: <ArtistDetailPage /> },
  { path: "/collection", element: <CollectionPage /> },
  { path: "/exhibition", element: <ExhibitionPage /> },
  { path: "/contest", element: <ContestPage /> },
  { path: "/search", element: <SearchResultPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup/job", element: <SignupJobPage /> },
  { path: "/signup/profile", element: <SignupProfilePage /> },
  { path: "/auth/google/callback", element: <GoogleAuthCallback /> },
  { path: "/profile/me", element: <ProfilePage /> }, // 내 프로필
  { path: "/profile/:userId", element: <ProfilePage /> },
] satisfies RouteObject[];
