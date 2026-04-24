import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit2, Trash2, Image as ImageIcon, User, Save, Loader } from 'lucide-react';
import api from '../utils/api';
import '../css/ManageTestimonials.css';
import { BASE_URL, getImageUrl } from '../../config/api';

// Sub-component for handling image errors reliably
// Sub-component for handling image errors reliably
const TestimonialImage = ({ imageUrl, name }) => {
    const [hasError, setHasError] = useState(false);

    const finalUrl = imageUrl ? getImageUrl(imageUrl) : null;
    
    // Strict validation
    const isValid = 
        finalUrl && 
        typeof finalUrl === 'string' && 
        !finalUrl.includes('undefined') && 
        !finalUrl.includes('null');

    if (!isValid || hasError) {
        return (
            <div className="no-image-placeholder profile-placeholder-icon" 
                 style={{ 
                    width: '100%', 
                    height: '100%', 
                    background: '#f5f5f5', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '60px', height: '60px', color: '#8fa194' }}>
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
            </div>
        );
    }

    return (
        <div 
            style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '50%',
                backgroundImage: `url(${finalUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#f5f5f5'
            }}
            title={name}
        >
            {/* Hidden loader to detect if the URL is actually broken */}
            <img 
                src={finalUrl} 
                alt="" 
                style={{ display: 'none' }} 
                onError={() => setHasError(true)} 
            />
        </div>
    );
};

const ManageTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    // ... rest of the existing state ...

    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        service: '',
        text: '',
        imageUrl: ''
    });
    const [isUploading, setIsUploading] = useState(false);
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
                                {getImageUrl(formData.imageUrl) ? (
                                    <img src={getImageUrl(formData.imageUrl)} alt="Preview" className="image-preview" />
                                ) : (
                                    <div className="no-image profile-placeholder-icon" style={{ background: '#f5f5f5', borderRadius: '50%', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '80px', height: '80px', color: '#8fa194' }}>
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                        </svg>
                                    </div>
                                )}
                                <label className="upload-label" style={{ opacity: isUploading ? 0.7 : 1, cursor: isUploading ? 'not-allowed' : 'pointer' }}>
                                    {isUploading ? (
                                        <>
                                            <Loader size={20} style={{ animation: 'spin 2s linear infinite' }} />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <ImageIcon size={20} />
                                            Choose Image
                                        </>
                                    )}
                                    <input type="file" onChange={handleFileUpload} hidden accept="image/*" disabled={isUploading} />
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
                                        <TestimonialImage imageUrl={testimonial.imageUrl} name={testimonial.name} />   
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
