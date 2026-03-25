import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BASE_URL } from '../../config/api';
import '../css/Therapy.css';

const Therapy = () => {
    const [needs, setNeeds] = useState([]);
    const [content, setContent] = useState({
        title: 'Therapy Is For Everyone',
        subtitle: 'Healing is not only for those in crisis. You don\'t have to "be broken" to benefit from support.\nSome come to therapy for:',
        body: 'In Ruh\'ya, therapy is a space for anyone who wants support, clarity, or integration — regardless of background, age, or past experience.'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch dynamic needs
                const needsRes = await fetch(`${BASE_URL}/api/therapy-needs`).then(res => res.json());
                setNeeds(needsRes);

                // Fetch section content
                const contentRes = await fetch(`${BASE_URL}/api/content/therapy`).then(res => res.json());
                if (contentRes) {
                    setContent({
                        title: contentRes.title || content.title,
                        subtitle: contentRes.subtitle || content.subtitle,
                        body: contentRes.body || content.body
                    });
                }
            } catch (err) {
                console.error('Error fetching therapy content:', err);
                // Fallback to defaults
                setNeeds([
                    { text: 'Emotional overwhelm' },
                    { text: 'Stress and anxiety' },
                    { text: 'Life transitions' },
                    { text: 'Relationship challenges' },
                    { text: 'Self-understanding' },
                    { text: 'Inner confidence and presence' },
                    { text: 'Creative or intuitive blocks' },
                    { text: 'Exploring deeper personal identity' }
                ]);
            }
        };

        fetchData();
    }, []);

    return (
        <section className="therapy">
            <motion.div
                className="therapy-header"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2>{content.title}</h2>
                <div className="intro-text">
                    {content.subtitle.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                    ))}
                </div>
            </motion.div>

            <div className="needs-grid">
                {needs.map((need, index) => (
                    <motion.div
                        key={need._id || index}
                        className="need-item"
                        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <span className="dot"></span>
                        <span>{need.text}</span>
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
                {content.body}
            </motion.p>
        </section>
    );
};

export default Therapy;
