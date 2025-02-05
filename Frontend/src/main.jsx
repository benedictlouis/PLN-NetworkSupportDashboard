import React from 'react';

import ReactDOM from 'react-dom/client';
import App from './App';


import ErrorPage from './pages/page404';
import DashboardPage from './pages/dashboardpage';
import LoginPage from './pages/loginpage';
import ListPage from './pages/listpage';
import DetailPage from './pages/detailpage';
import AddPage from './pages/addpage';
import EditPage from './pages/editpage';
import AccManagePage from './pages/accManagePage';
import RegisterPage from './pages/registerpage';
import ValidationPage from './pages/validationpage';

import './index.css';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, Navigate } from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<DashboardPage />} />
      <Route path="*" element={<ErrorPage />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="home" element={<Navigate to="/dashboard" replace />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="list" element={<ListPage />} />
      <Route path="data/:id" element={<DetailPage />} />
      <Route path="add" element={<AddPage />} />
      <Route path="edit/:id" element={<EditPage />} />
      <Route path="accountManagement" element={<AccManagePage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="validation" element={<ValidationPage />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}>
    </RouterProvider>
  </React.StrictMode>
);