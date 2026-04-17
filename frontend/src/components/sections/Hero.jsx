import React, { useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Phone, MousePointer2 } from 'lucide-react';
import '../css/Hero.css';
import heroBg from '../../assets/85eeba3b6f9eb5b8266530642de43f06c2a5fe2e.png';
import ContactModal from './ContactModal';
import { useSettings } from '../../context/SettingsContext';
import logo from '../../assets/ruhya_final_logo-01-CjittCSi.svg';

const Hero = () => {
    const { phoneNumber } = useSettings();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { scrollY } = useScroll();

    // Smooth out the scroll values using spring physics
    const smoothY = useSpring(scrollY, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const y = useTransform(smoothY, [0, 500], [0, 100]);
    const scale = useTransform(smoothY, [0, 500], [1, 1.1]);

    // Content scroll effects
    const contentOpacity = useTransform(smoothY, [0, 400], [1, 0.4]);
    const blurValue = useTransform(smoothY, [0, 400], [0, 8]);
    const contentBlur = useTransform(blurValue, v => `blur(${v}px)`);

    const titleLetters = "Holistic Healing".split("");

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.3
            }
        }
    };

    const letterVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 150, damping: 15 }
        }
    };

    return (
        <section className="hero overflow-hidden">
            <div className="hero-bg">
                <motion.img
                    src={heroBg}
                    alt="Misty Forest"
                    style={{ y, scale }}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="hero-overlay absolute inset-0 z-10"></div>
            </div>

            <motion.div
                className="hero-content relative z-20 text-center"
                style={{ opacity: contentOpacity, filter: contentBlur }}
            >
                <motion.div
                    className="logo-container"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <img src={logo} alt="Ruh'ya Logo" className="hero-logo" />
                </motion.div>

                <motion.div
                    className="hero-title-container"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <h2 className="hero-title leading-tight mb-4">
                        {titleLetters.map((letter, index) => (
                            <motion.span key={index} variants={letterVariants} style={{ display: 'inline-block' }}>
                                {letter === " " ? "\u00A0" : letter}
                            </motion.span>
                        ))}
                    </h2>
                </motion.div>

                <motion.h3
                    className="hero-subtitle mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                >
                    Conscious Living
                </motion.h3>

                <motion.p
                    className="hero-description text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.8 }}
                >
                    Ruh'ya is a space to breathe again. To reconnect. To remember your inner truth. A return to presence and the true self.
                </motion.p>

                <motion.div
                    className="hero-actions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 2.3 }}
                >
                    <div className="action-pill">
                        <div className="contact-group">
                            <motion.a
                                href={`tel:${phoneNumber.replace(/[^\d+]/g, '')}`}
                                className="phone-btn"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                title={`Call ${phoneNumber}`}
                            >
                                <Phone size={20} />
                                <span className="hero-phone-number">{phoneNumber}</span>
                            </motion.a>
                        </div>
                        <button className="connect-btn" onClick={() => setIsModalOpen(true)}>Connect With Us</button>
                    </div>
                </motion.div>

                <motion.div
                    className="scroll-indicator"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    {/* <div className="mouse-icon">
                        <div className="scroll-wheel"></div>
                    </div> */}
                </motion.div>
            </motion.div>
            <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </section>
    );
};

export default Hero;
