import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Layout, Settings, Home } from 'lucide-react';
import '../css/AdminNavbar.css';

const AdminNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('ruhiya_admin_token');
        navigate('/admin/login');
    };

    return (
        <nav className="admin-navbar">
            <div className="admin-nav-container">
                <Link to="/admin/dashboard" className="admin-brand">
                    Ruh'ya CMS
                </Link>

                <div className="admin-nav-links">
                    <Link to="/admin/dashboard" className="nav-item">
                        <Layout size={18} />
                        Dashboard
                    </Link>
                    <a href="/" target="_blank" rel="noopener noreferrer" className="nav-item">
                        <Home size={18} />
                        View Site
                    </a>
                    <button onClick={handleLogout} className="admin-logout-btn">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
