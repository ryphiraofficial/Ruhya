import React from 'react';
import { motion } from 'framer-motion';
import '../css/Therapy.css';

const Therapy = () => {
    const needs = [
        'Emotional overwhelm',
        'Stress and anxiety',
        'Life transitions',
        'Relationship challenges',
        'Self-understanding',
        'Inner confidence and presence',
        'Creative or intuitive blocks',
        'Exploring deeper personal identity'
    ];

    return (
        <section className="therapy">
            <motion.div
                className="therapy-header"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2>Therapy Is For Everyone</h2>
                <p className="intro-text">
                    Healing is not only for those in crisis. You don't have to "be broken" to benefit from support.
                    Some come to therapy for:
                </p>
            </motion.div>

            <div className="needs-grid">
                {needs.map((need, index) => (
                    <motion.div
                        key={index}
                        className="need-item"
                        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <span className="dot"></span>
                        <span>{need}</span>
                    </motion.div>
                ))}
            </div>

            <motion.p
                className="footer-text"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.8 }}
            >
                In Ruh'ya, therapy is a space for anyone who wants support, clarity, or integration —
                regardless of background, age, or past experience.
            </motion.p>
        </section>
    );
};

export default Therapy;
