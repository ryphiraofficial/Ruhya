import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config/api';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        phoneNumber: '+91 97455 80881',
        emailId: 'contact@ruhya.com',
        instagramLink: '',
        facebookLink: ''
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`${API_URL}/settings`);
                const data = await response.json();
                if (response.ok) {
                    setSettings(data);
                }
            } catch (error) {
                console.error('Error fetching site settings:', error);
            }
        };

        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={settings}>
            {children}
        </SettingsContext.Provider>
    );
};
