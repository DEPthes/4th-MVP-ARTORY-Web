import type { RouteObject } from 'react-router-dom';
import HomePage from '../pages/HomePage';

import CollectionPage from '../pages/CollectionPage'; // 🔹 컬렉션 페이지 import

export const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/collection', element: <CollectionPage /> }, // 🔹 새로운 경로 추가
] satisfies RouteObject[];
