import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BASE_URL } from '../../config/api';
import '../css/ContactModal.css';

const ContactModal = ({ isOpen, onClose, serviceName }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg('');

        try {
            const response = await fetch(`${BASE_URL}/api/contact/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, serviceName }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong. Please try again.');
            }

            setIsSubmitted(true);
            setTimeout(() => {
                setFormData({ name: '', email: '', phone: '', message: '' });
                setIsSubmitted(false);
                onClose();
            }, 2500);
        } catch (err) {
            setErrorMsg(err.message || 'Failed to send. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    if (!isOpen) return null;

    return (
        <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="modal-content"
                data-lenis-prevent
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="modal-close-btn">
                    <svg className="close-icon" fill="none" stroke="#245e2f" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {!isSubmitted ? (
                    <div className="modal-form-container">
                        <h2 className="modal-title">Connect With Us</h2>
                        <p className="modal-subtitle">Begin your journey to holistic healing</p>

                        {serviceName && (
                            <div className="service-badge">
                                Enquiry for: <span>{serviceName}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Your Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="form-group">
                                <label>Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91 12345 67890"
                                />
                            </div>

                            <div className="form-group">
                                <label>Message *</label>
                                <textarea
                                    name="message"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Tell us about your healing journey..."
                                />
                            </div>

                            <button type="submit" disabled={isSubmitting} className="modal-submit-btn">
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </button>

                            {errorMsg && (
                                <p className="modal-error-msg">{errorMsg}</p>
                            )}
                        </form>
                    </div>
                ) : (
                    <div className="modal-success">
                        <div className="success-icon-container">
                            <svg className="success-icon" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24">
                                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3 className="success-title">Thank You!</h3>
                        <p className="success-subtitle">We'll be in touch with you soon.</p>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default ContactModal;
