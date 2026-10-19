import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import BoardsListPage from '../pages/BoardsListPage.jsx';
import BoardDetailPage from '../pages/BoardDetailPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

/**
 * Matriz de Rutas según especificación de arquitectura SPA:
 * /login           -> LoginPage         (Público)
 * /boards          -> BoardsListPage    (Protegido)
 * /boards/:boardId -> BoardDetailPage   (Protegido)
 * /                -> Redirección a /boards
 * *                -> NotFoundPage
 */
export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Redirección raíz a /boards */}
        <Route index element={<Navigate to="/boards" replace />} />

        {/* Ruta Pública */}
        <Route path="login" element={<LoginPage />} />

        {/* Rutas Protegidas */}
        <Route
          path="boards"
          element={
            <ProtectedRoute>
              <BoardsListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="boards/:boardId"
          element={
            <ProtectedRoute>
              <BoardDetailPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
