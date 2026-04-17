import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Upload, Check, RotateCcw, Loader } from 'lucide-react';
import api from '../utils/api';
import { SECTION_DEFAULTS } from '../utils/defaults';
import '../css/EditSection.css';

import { BASE_URL, getImageUrl } from '../../config/api';
const EditSection = () => {
    const { sectionName } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        body: '',
        imageUrl: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchSectionData();
    }, [sectionName]);

    const fetchSectionData = async () => {
        try {
            const response = await api.get(`/content/${sectionName}`);
            if (response.data) {
                setFormData({
                    title: response.data.title || '',
                    subtitle: response.data.subtitle || '',
                    body: response.data.body || '',
                    imageUrl: response.data.imageUrl || ''
                });
            }
        } catch (err) {
            console.error('Error fetching section data:', err);
            setMessage({ type: 'error', text: 'Failed to load section data.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            setIsUploading(true);
            setMessage({ type: 'info', text: 'Uploading image...' });
            const response = await api.post('/upload', uploadData);
            setFormData(prev => ({ ...prev, imageUrl: response.data.url }));
            setMessage({ type: 'success', text: 'Image uploaded successfully!' });
        } catch (err) {
            console.error('Upload failed:', err);
            setMessage({ type: 'error', text: 'Image upload failed.' });
        } finally {
            setIsUploading(false);
        }
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset this section to its original content? All your current changes will be lost.')) {
            const defaults = SECTION_DEFAULTS[sectionName.toLowerCase()];
            if (defaults) {
                setFormData({
                    title: defaults.title || '',
                    subtitle: defaults.subtitle || '',
                    body: defaults.body || '',
                    imageUrl: defaults.imageUrl || ''
                });
                setMessage({ type: 'info', text: 'Restored to original content. Click Save to publish.' });
            } else {
                setMessage({ type: 'error', text: 'No defaults found for this section.' });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await api.put(`/content/${sectionName}`, formData);
            setMessage({ type: 'success', text: 'Section updated successfully!' });
            setTimeout(() => navigate('/admin/dashboard'), 1500);
        } catch (err) {
            console.error('Save failed:', err);
            setMessage({ type: 'error', text: 'Failed to save changes.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="loading-state">Loading section editor...</div>;

    return (
        <div className="edit-section-page">
            <header className="edit-header">
                <Link to="/admin/dashboard" className="back-btn">
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </Link>
                <h1>Edit {sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} Section</h1>
            </header>

            <div className="edit-container">
                <form onSubmit={handleSubmit} className="edit-form">
                    {message.text && (
                        <div className={`status-message ${message.type}`}>
                            {message.type === 'success' && <Check size={18} />}
                            {message.text}
                        </div>
                    )}

                    <div className="fields-grid">
                        <section className="form-fields">
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Subtitle</label>
                                <input
                                    type="text"
                                    name="subtitle"
                                    value={formData.subtitle}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Body Content</label>
                                <textarea
                                    name="body"
                                    value={formData.body}
                                    onChange={handleInputChange}
                                    rows={8}
                                />
                            </div>
                        </section>

                        <section className="image-field">
                            <label>Section Image</label>
                            <div className="image-preview-container">
                                {formData.imageUrl ? (
                                    <img src={getImageUrl(formData.imageUrl)} alt="Preview" className="image-preview" />
                                ) : (
                                    <div className="no-image">No image selected</div>
                                )}
                                <label className="upload-label" style={{ opacity: isUploading ? 0.7 : 1, cursor: isUploading ? 'not-allowed' : 'pointer' }}>
                                    {isUploading ? (
                                        <>
                                            <Loader size={20} style={{ animation: 'spin 2s linear infinite' }} />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={20} />
                                            Choose New Image
                                        </>
                                    )}
                                    <input type="file" onChange={handleFileUpload} hidden accept="image/*" disabled={isUploading} />
                                </label>
                            </div>
                        </section>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="reset-btn" onClick={handleReset} disabled={isSaving}>
                            <RotateCcw size={18} />
                            Reset to Original
                        </button>
                        <button type="submit" className="save-btn" disabled={isSaving}>
                            <Save size={20} />
                            {isSaving ? 'Saving Changes...' : 'Save Section'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSection;
