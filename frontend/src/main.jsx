import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AdminLogin from './admin/pages/AdminLogin.jsx'
import AdminDashboard from './admin/pages/AdminDashboard.jsx'
import PrivateRoute from './admin/components/PrivateRoute.jsx'
import { Toaster } from 'react-hot-toast'
import { SettingsProvider } from './context/SettingsContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <SettingsProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } />
        </Routes>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>,
)
