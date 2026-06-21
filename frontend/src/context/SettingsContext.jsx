import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config/api';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(() => {
        try {
            const cached = localStorage.getItem('ruhiya_site_settings');
            if (cached) {
                return JSON.parse(cached);
            }
        } catch (error) {
            console.error('Error reading settings from localStorage:', error);
        }
        return {
            phoneNumber: '+971558967123',
            emailId: 'Ruhyasoul@gmail.com',
            instagramLink: '',
            facebookLink: ''
        };
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`${API_URL}/settings`);
                if (response.ok) {
                    const data = await response.json();
                    setSettings(data);
                    try {
                        localStorage.setItem('ruhiya_site_settings', JSON.stringify(data));
                    } catch (error) {
                        console.error('Error saving settings to localStorage:', error);
                    }
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
