import React from 'react';

import ReactDOM from 'react-dom/client';
import App from './App';

import DashboardPage from './pages/dashboardpage';
import LoginPage from './pages/loginpage';
import ListPage from './pages/listpage';

import './index.css';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<DashboardPage />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="list" element={<ListPage />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}>
    </RouterProvider>
  </React.StrictMode>
);