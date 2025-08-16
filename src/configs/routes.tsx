import type { RouteObject } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import SignupJobPage from '../pages/SignupJobPage';
import SignupProfilePage from '../pages/SignupProfilePage';
import GoogleAuthCallback from '../pages/GoogleAuthCallback';
import ProfilePage from '../pages/ProfilePage';
import CollectionPage from '../pages/CollectionPage';
import ExhibitionPage from '../pages/ExhibitionPage';
import ContestPage from '../pages/ContestPage';
import ArtistNotePage from '../pages/ArtistNotePage';
import SearchResultPage from '../pages/SearchResultPage';
import ArtistDetailPage from '../pages/ArtistDetailPage';
import CollectionDetailPage from '../pages/CollectionDetailPage';
import ExhibitionDetailPage from '../pages/ExhibitionDetailPage';
import ContestDetailPage from '../pages/ContestDetailPage';

export const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/note', element: <ArtistNotePage /> },
  { path: '/artist/:artistId', element: <ArtistDetailPage /> },
  { path: '/collection', element: <CollectionPage /> },
  { path: '/collection/:id', element: <CollectionDetailPage /> },
  { path: '/exhibition', element: <ExhibitionPage /> },
  { path: '/exhibition/:id', element: <ExhibitionDetailPage /> },
  { path: '/contest', element: <ContestPage /> },
  { path: '/contest/:id', element: <ContestDetailPage /> },
  { path: '/search', element: <SearchResultPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup/job', element: <SignupJobPage /> },
  { path: '/signup/profile', element: <SignupProfilePage /> },
  { path: '/auth/google/callback', element: <GoogleAuthCallback /> },
  { path: '/profile/:userId', element: <ProfilePage /> },
] satisfies RouteObject[];
