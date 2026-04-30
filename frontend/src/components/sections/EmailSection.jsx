import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ExternalLink } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import ContactModal from './ContactModal';
import '../css/EmailSection.css';

const EmailSection = () => {
    const { emailId, phoneNumber } = useSettings();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="email-section" id="contact">
            <div className="email-container">
                <motion.div 
                    className="email-content"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="email-visual">
                        <motion.div 
                            className="email-icon-wrapper"
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Mail size={40} strokeWidth={1.5} />
                        </motion.div>
                    </div>

                    <div className="email-text">
                        <h2 className="email-heading">Let's Begin Your Journey</h2>
                        <p className="email-description">
                            Whether you have a specific question or simply want to explore how we can work together, 
                            I'm here to listen. Reach out via email and let's start a conversation.
                        </p>
                        
                        <div className="email-display-card">
                            <span className="email-label">Direct Email</span>
                            <a href={`mailto:${emailId}`} className="email-address">
                                {emailId}
                                <ExternalLink size={16} className="link-icon" />
                            </a>
                        </div>

                        <div className="email-actions">
                            {/* Original Modal Trigger: */}
                            {/* <button 
                                className="email-cta-btn"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Send a Message <ArrowRight size={18} />
                            </button> */}

                            {/* New Direct WhatsApp Trigger: */}
                            <button 
                                className="email-cta-btn"
                                onClick={() => {
                                    const whatsappNumber = phoneNumber ? phoneNumber.replace(/\D/g, '') : '919745580881';
                                    const message = encodeURIComponent("Hello! I'd like to start a conversation with Ruh'ya.");
                                    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
                                }}
                            >
                                Send a Message <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="email-decor-blob blob-1"></div>
                <div className="email-decor-blob blob-2"></div>
            </div>

            {/* <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> */}
        </section>
    );
};

export default EmailSection;
