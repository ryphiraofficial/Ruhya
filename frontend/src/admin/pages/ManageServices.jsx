import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit2, Trash2, Image as ImageIcon, Save } from 'lucide-react';
import api from '../utils/api';
import '../css/ManageServices.css';

import { BASE_URL } from '../../config/api';

const ManageServices = () => {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        imageUrl: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await api.get('/services');
            setServices(response.data);
        } catch (err) {
            console.error('Error fetching services:', err);
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
            setMessage({ type: 'info', text: 'Uploading image...' });
            const response = await api.post('/upload', uploadData);
            setFormData(prev => ({ ...prev, imageUrl: response.data.url }));
            setMessage({ type: 'success', text: 'Image uploaded successfully!' });
        } catch (err) {
            console.error('Upload failed:', err);
            setMessage({ type: 'error', text: 'Image upload failed.' });
        }
    };

    const handleNew = () => {
        setEditingService(null);
        setFormData({ title: '', subtitle: '', description: '', imageUrl: '' });
        setIsEditing(true);
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setFormData({
            title: service.title || '',
            subtitle: service.subtitle || '',
            description: service.description || '',
            imageUrl: service.imageUrl || ''
        });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;

        try {
            await api.delete(`/services/${id}`);
            setMessage({ type: 'success', text: 'Service deleted successfully!' });
            fetchServices();
        } catch (err) {
            console.error('Delete failed:', err);
            setMessage({ type: 'error', text: 'Failed to delete service.' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            if (editingService) {
                await api.put(`/services/${editingService._id}`, formData);
                setMessage({ type: 'success', text: 'Service updated successfully!' });
            } else {
                await api.post('/services', formData);
                setMessage({ type: 'success', text: 'Service created successfully!' });
            }
            setIsEditing(false);
            fetchServices();
        } catch (err) {
            console.error('Save failed:', err);
            setMessage({ type: 'error', text: 'Failed to save service.' });
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditingService(null);
        setMessage({ type: '', text: '' });
    };

    return (
        <div className="manage-page">
            <header className="manage-header">
                <Link to="/admin/dashboard" className="back-btn">
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </Link>
                <h1>Manage Services</h1>
            </header>

            {message.text && (
                <div className={`status-message ${message.type}`}>
                    {message.text}
                </div>
            )}

            {isEditing ? (
                <motion.div
                    className="edit-form-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
                    <form onSubmit={handleSubmit} className="edit-form">
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
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
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                            />
                        </div>

                        <div className="form-group">
                            <label>Image</label>
                            <div className="image-preview-container">
                                {formData.imageUrl ? (
                                    <img src={`${BASE_URL}${formData.imageUrl}`} alt="Preview" className="image-preview" />
                                ) : (
                                    <div className="no-image">No image selected</div>
                                )}
                                <label className="upload-label">
                                    <ImageIcon size={20} />
                                    Choose Image
                                    <input type="file" onChange={handleFileUpload} hidden accept="image/*" />
                                </label>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={handleCancel}>
                                Cancel
                            </button>
                            <button type="submit" className="save-btn">
                                <Save size={20} />
                                {editingService ? 'Update Service' : 'Create Service'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            ) : (
                <div className="items-list">
                    <button className="add-new-btn" onClick={handleNew}>
                        <Plus size={20} />
                        Add New Service
                    </button>

                    {isLoading ? (
                        <div className="loading-state">Loading services...</div>
                    ) : services.length === 0 ? (
                        <div className="empty-state">No services found. Add your first service!</div>
                    ) : (
                        <div className="items-grid">
                            {services.map((service, index) => (
                                <motion.div
                                    key={service._id}
                                    className="item-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="item-image">
                                        {service.imageUrl ? (
                                            <img src={`${BASE_URL}${service.imageUrl}`} alt={service.title} />
                                        ) : (
                                            <div className="no-image-placeholder">
                                                <ImageIcon size={40} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="item-info">
                                        <h3>{service.title}</h3>
                                        <p>{service.subtitle}</p>
                                    </div>
                                    <div className="item-actions">
                                        <button className="edit-btn" onClick={() => handleEdit(service)}>
                                            <Edit2 size={18} />
                                            Edit
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDelete(service._id)}>
                                            <Trash2 size={18} />
                                            Delete
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageServices;
