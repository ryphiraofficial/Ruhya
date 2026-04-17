import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit2, Trash2, Save, ArrowUp, ArrowDown } from 'lucide-react';
import api from '../utils/api';
import '../css/ManageServices.css'; // Reusing some styles

const ManageTherapyNeeds = () => {
    const [needs, setNeeds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingNeed, setEditingNeed] = useState(null);
    const [formData, setFormData] = useState({ text: '' });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchNeeds();
    }, []);

    const fetchNeeds = async () => {
        try {
            const response = await api.get('/therapy-needs');
            setNeeds(response.data);
        } catch (err) {
            console.error('Error fetching therapy needs:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ text: e.target.value });
    };

    const handleNew = () => {
        setEditingNeed(null);
        setFormData({ text: '' });
        setIsEditing(true);
    };

    const handleEdit = (need) => {
        setEditingNeed(need);
        setFormData({ text: need.text });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            await api.delete(`/therapy-needs/${id}`);
            setMessage({ type: 'success', text: 'Deleted successfully!' });
            fetchNeeds();
        } catch (err) {
            console.error('Delete failed:', err);
            setMessage({ type: 'error', text: 'Failed to delete.' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            if (editingNeed) {
                await api.put(`/therapy-needs/${editingNeed._id}`, formData);
                setMessage({ type: 'success', text: 'Updated successfully!' });
            } else {
                await api.post('/therapy-needs', formData);
                setMessage({ type: 'success', text: 'Created successfully!' });
            }
            setIsEditing(false);
            fetchNeeds();
        } catch (err) {
            console.error('Save failed:', err);
            setMessage({ type: 'error', text: 'Failed to save.' });
        }
    };

    const moveItem = async (index, direction) => {
        const newNeeds = [...needs];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        
        if (newIndex < 0 || newIndex >= newNeeds.length) return;

        [newNeeds[index], newNeeds[newIndex]] = [newNeeds[newIndex], newNeeds[index]];
        
        // Optimistic update
        setNeeds(newNeeds);

        try {
            const orders = newNeeds.map((need, i) => ({ id: need._id, order: i }));
            await api.put('/therapy-needs/reorder', { orders });
        } catch (err) {
            console.error('Reorder failed:', err);
            fetchNeeds(); // Revert on failure
        }
    };

    return (
        <div className="manage-page">
            <header className="manage-header">
                <Link to="/admin/dashboard" className="back-btn">
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </Link>
                <h1>Manage Therapy Needs</h1>
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
                    <h2>{editingNeed ? 'Edit Need' : 'Add New Need'}</h2>
                    <form onSubmit={handleSubmit} className="edit-form">
                        <div className="form-group">
                            <label>Need Text</label>
                            <input
                                type="text"
                                name="text"
                                value={formData.text}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g. Stress and anxiety"
                            />
                        </div>

                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="save-btn">
                                <Save size={20} />
                                {editingNeed ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            ) : (
                <div className="items-list">
                    <button className="add-new-btn" onClick={handleNew}>
                        <Plus size={20} />
                        Add New Need
                    </button>

                    {isLoading ? (
                        <div className="loading-state">Loading...</div>
                    ) : needs.length === 0 ? (
                        <div className="empty-state">No needs found.</div>
                    ) : (
                        <div className="items-grid list-view">
                            {needs.map((need, index) => (
                                <motion.div
                                    key={need._id}
                                    className="item-card horizontal"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div className="item-info">
                                        <h3>{need.text}</h3>
                                    </div>
                                    <div className="item-actions">
                                        <div className="reorder-btns">
                                            <button 
                                                className="order-btn" 
                                                onClick={() => moveItem(index, 'up')}
                                                disabled={index === 0}
                                            >
                                                <ArrowUp size={18} />
                                            </button>
                                            <button 
                                                className="order-btn" 
                                                onClick={() => moveItem(index, 'down')}
                                                disabled={index === needs.length - 1}
                                            >
                                                <ArrowDown size={18} />
                                            </button>
                                        </div>
                                        <button className="edit-btn" onClick={() => handleEdit(need)}>
                                            <Edit2 size={18} />
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDelete(need._id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <style>{`
                .items-grid.list-view {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    max-width: 800px;
                }
                .item-card.horizontal {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .reorder-btns {
                    display: flex;
                    gap: 0.5rem;
                    margin-right: 1rem;
                }
                .order-btn {
                    padding: 0.5rem;
                    border: 1px solid #ddd;
                    background: #f9f9f9;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .order-btn:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }
                .order-btn:hover:not(:disabled) {
                    background: #eee;
                }
            `}</style>
        </div>
    );
};

export default ManageTherapyNeeds;
