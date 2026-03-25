import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import '../css/Footer.css';

const Footer = () => {
    const { instagramLink, facebookLink, emailId } = useSettings();
    return (
        <footer className="site-footer" id="site-footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <h3 className="footer-title">Ruh'ya</h3>
                    <p className="footer-tagline">Holistic Healing & Conscious Living</p>
                </div>

                <div className="footer-links">
                    <a href={instagramLink || "#"} target="_blank" rel="noopener noreferrer" className="footer-link">Instagram</a>
                    <a href={facebookLink || "#"} target="_blank" rel="noopener noreferrer" className="footer-link">Facebook</a>
                    <a href={`mailto:${emailId}`} className="footer-link">Email</a>
                </div>

                <div className="footer-copyright">
                    <p className="copyright-text">© 2026 Ruh'ya. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
