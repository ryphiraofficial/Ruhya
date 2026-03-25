import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit2, Trash2, Image as ImageIcon, Save } from 'lucide-react';
import api from '../utils/api';
import '../css/ManageTestimonials.css';

import { BASE_URL } from '../../config/api';

const ManageTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        service: '',
        text: '',
        imageUrl: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const response = await api.get('/testimonials');
            setTestimonials(response.data);
        } catch (err) {
            console.error('Error fetching testimonials:', err);
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
        setEditingTestimonial(null);
        setFormData({ name: '', service: '', text: '', imageUrl: '' });
        setIsEditing(true);
    };

    const handleEdit = (testimonial) => {
        setEditingTestimonial(testimonial);
        setFormData({
            name: testimonial.name || '',
            service: testimonial.service || '',
            text: testimonial.text || '',
            imageUrl: testimonial.imageUrl || ''
        });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this testimonial?')) return;

        try {
            await api.delete(`/testimonials/${id}`);
            setMessage({ type: 'success', text: 'Testimonial deleted successfully!' });
            fetchTestimonials();
        } catch (err) {
            console.error('Delete failed:', err);
            setMessage({ type: 'error', text: 'Failed to delete testimonial.' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            if (editingTestimonial) {
                await api.put(`/testimonials/${editingTestimonial._id}`, formData);
                setMessage({ type: 'success', text: 'Testimonial updated successfully!' });
            } else {
                await api.post('/testimonials', formData);
                setMessage({ type: 'success', text: 'Testimonial created successfully!' });
            }
            setIsEditing(false);
            fetchTestimonials();
        } catch (err) {
            console.error('Save failed:', err);
            setMessage({ type: 'error', text: 'Failed to save testimonial.' });
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditingTestimonial(null);
        setMessage({ type: '', text: '' });
    };

    return (
        <div className="manage-page">
            <header className="manage-header">
                <Link to="/admin/dashboard" className="back-btn">
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </Link>
                <h1>Manage Testimonials</h1>
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
                    <h2>{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
                    <form onSubmit={handleSubmit} className="edit-form">
                        <div className="form-group">
                            <label>Client Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Service</label>
                            <input
                                type="text"
                                name="service"
                                value={formData.service}
                                onChange={handleInputChange}
                                placeholder="e.g., Inner Child Healing"
                            />
                        </div>

                        <div className="form-group">
                            <label>Testimonial Text</label>
                            <textarea
                                name="text"
                                value={formData.text}
                                onChange={handleInputChange}
                                rows={5}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Client Image</label>
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
                                {editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            ) : (
                <div className="items-list">
                    <button className="add-new-btn" onClick={handleNew}>
                        <Plus size={20} />
                        Add New Testimonial
                    </button>

                    {isLoading ? (
                        <div className="loading-state">Loading testimonials...</div>
                    ) : testimonials.length === 0 ? (
                        <div className="empty-state">No testimonials found. Add your first testimonial!</div>
                    ) : (
                        <div className="items-grid">
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={testimonial._id}
                                    className="item-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="item-image testimonial-image">
                                        {testimonial.imageUrl ? (
                                            <img src={`${BASE_URL}${testimonial.imageUrl}`} alt={testimonial.name} />
                                        ) : (
                                            <div className="no-image-placeholder">
                                                <ImageIcon size={40} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="item-info">
                                        <h3>{testimonial.name}</h3>
                                        <p className="testimonial-service">{testimonial.service}</p>
                                        <p className="testimonial-text">{testimonial.text.substring(0, 100)}...</p>
                                    </div>
                                    <div className="item-actions">
                                        <button className="edit-btn" onClick={() => handleEdit(testimonial)}>
                                            <Edit2 size={18} />
                                            Edit
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDelete(testimonial._id)}>
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

export default ManageTestimonials;
