import type { RouteObject } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import SignupJobPage from '../pages/SignupJobPage';
import SignupProfilePage from '../pages/SignupProfilePage';
import GoogleAuthCallback from '../pages/GoogleAuthCallback';
import ProfilePage from '../pages/ProfilePage';
import ArtistNotePage from '../pages/ArtistNotePage';
import ArtistDetailPage from '../pages/ArtistDetailPage';
import SearchResultPage from '../pages/SearchResultPage';
import type { RouteObject } from 'react-router-dom';

import CollectionPage from '../pages/CollectionPage'; // 🔹 컬렉션 페이지 import
import ExhibitionPage from '../pages/ExhibitionPage'; // ⬅️ 새로 추가
import ContestPage from '../pages/ContestPage';

export const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/collection', element: <CollectionPage /> },
  { path: '/exhibition', element: <ExhibitionPage /> },
  { path: '/contest', element: <ContestPage /> },
] satisfies RouteObject[];
