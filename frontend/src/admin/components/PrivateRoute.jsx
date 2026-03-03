import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('ruhiya_admin_token');

    // If token exists, render child components, otherwise redirect to login
    return token ? children : <Navigate to="/admin/login" replace />;
};

export default PrivateRoute;

