import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContactModal from './ContactModal';
import '../css/OfferingDetailModal.css';

import imgRectangle4 from '../../assets/50890a46240fc48c66bf9036bd63303afee0193c.png';
import imgRectangle11 from '../../assets/5cbc70f0f08ac73d976f30440f7ba90f72685c00.png';
import imgRectangle12 from '../../assets/826bb818b29cc44150e12970da04fd9ba5167b91.png';

const offerings = [
    {
        id: 'family-constellation',
        image: imgRectangle12,
        title: 'Family Constellation Therapy',
        subtitle: 'Ancestral Healing',
        description: 'This method looks at how family dynamics and inherited patterns can affect your emotions, relationships, and life choices. By bringing awareness to these unseen influences, it helps restore balance and emotional clarity. It often brings a sense of relief, understanding, and inner alignment.',
        // benefits: [
        //     'Deep understanding of multi-generational family patterns',
        //     'Release of inherited ancestral trauma and burdens',
        //     'Healing of current family relationships and conflicts',
        //     'Freedom from unconscious family loyalties that limit you',
        //     'Restoration of natural order and balance in family systems',
        //     'Resolution of recurring life challenges with systemic roots',
        //     'Improved emotional wellbeing and relationship health'
        // ],
        details: 'In a Family Constellation session, we work with representatives or symbolic elements to create a living map of your family system. This spatial representation allows hidden dynamics—such as excluded family members, interrupted movements of love, or carried burdens—to become visible and available for healing. The process is both gentle and profound, often bringing immediate relief and clarity. This powerful work can catalyze deep shifts in your relationships, physical health, emotional well-being, and life direction. It\'s especially helpful for addressing relationship patterns, health issues with no clear cause, feelings of not belonging, and life transitions.'
    },
    {
        id: 'inner-child-healing',
        image: imgRectangle4,
        title: 'Inner Child Healing',
        subtitle: 'Emotional Restoration',
        description: 'This work focuses on the parts of us formed during early life experiences. By gently acknowledging unmet emotional needs, it supports emotional regulation and self-compassion. It helps build a stronger, more grounded sense of self in the present.',
        // benefits: [
        //     'Healing of early emotional wounds and childhood trauma',
        //     'Release of abandonment pain and feelings of unworthiness',
        //     'Transformation of patterns of over-responsibility and perfectionism',
        //     'Freedom from chronic fear and anxiety rooted in the past',
        //     'Development of healthy self-compassion and self-nurturing',
        //     'Reclamation of joy, playfulness, and spontaneity',
        //     'Improved capacity for healthy relationships and boundaries'
        // ],
        details: 'Inner Child Healing sessions provide a safe, nurturing space to connect with the younger parts of yourself that are still carrying pain, fear, or unmet needs. Through gentle guided processes, visualization, somatic awareness, and compassionate dialogue, we help your inner child feel seen, heard, and loved—often for the first time. This work is particularly powerful for those who experienced neglect, emotional unavailability, criticism, or trauma in childhood, and for anyone who feels stuck in patterns of self-criticism, people-pleasing, or emotional shutdown. As you heal your inner child, you naturally develop greater self-acceptance, emotional resilience, and the capacity to live with more freedom and authenticity.'
    },
    {
        id: 'transpersonal-hypnotherapy',
        image: imgRectangle11,
        title: 'Transpersonal Hypnotherapy',
        subtitle: 'Regression Therapy',
        description: 'This is a guided, deeply relaxed state that allows you to connect with the subconscious mind. It helps identify and shift patterns, beliefs, and emotional imprints that influence your present life. Sessions are safe, conscious, and guided — you remain aware and in control throughout.',
        // benefits: [
        //     'Gentle access to subconscious memories and root causes',
        //     'Release of deep-seated emotional blocks and trauma',
        //     'Understanding of how past experiences influence present patterns',
        //     'Transformation of limiting beliefs formed in the past',
        //     'Enhanced connection to your higher self and spiritual wisdom',
        //     'Resolution of anxiety, phobias, and unexplained fears',
        //     'Accelerated personal and spiritual growth'
        // ],
        details: 'Through guided hypnotic states and regression techniques, you\'ll explore the depths of your subconscious mind in a safe, nurturing environment. Our transpersonal approach honors both psychological and spiritual dimensions of healing. This therapy gently accesses subconscious memories, beliefs, and emotional imprints that may be creating blocks or challenges in your current life. Sessions may include age regression to childhood experiences, past life exploration for those open to it, parts therapy, and spiritual connection work. This is particularly effective for addressing anxiety, phobias, recurring patterns, relationship difficulties, and creating lasting positive change. All work is done at your own pace and with your full consent and comfort.'
    },
    {
        id: 'holistic-healing',
        image: imgRectangle12,
        title: 'Holistic Integrated Creative Arts Therapy',
        subtitle: 'Personalized Healing',
        description: 'This approach uses simple creative processes like drawing, movement, symbols, and expression to help you access emotions that are difficult to put into words. You do not need to be artistic — the focus is on expression, not performance. It helps release emotional blocks and supports self-awareness in a gentle, natural way.',
        // benefits: [
        //     'Fully personalized healing tailored to your unique journey',
        //     'Integration of multiple therapeutic approaches in one session',
        //     'Honoring of your own inner wisdom and healing pace',
        //     'Holistic support for emotional, mental, physical, and spiritual wellbeing',
        //     'Safe space for whatever needs to emerge and be processed',
        //     'Creative and somatic approaches alongside traditional talk therapy',
        //     'Flexible, responsive support that evolves with your needs'
        // ],
        details: 'These intuitive sessions are truly client-led, meaning we follow what your system is ready to work with in each moment. A session might include compassionate listening and talk therapy, guided visualization or meditation, breathwork, creative expression through art or writing, gentle somatic awareness and body-centered healing, or elements of inner child work, parts therapy, or energy healing—whatever serves your highest healing in that moment. This integrative approach is ideal for those who resonate with a holistic perspective and want the flexibility to explore healing in a way that feels authentic and organic. No two sessions are exactly alike, as each one responds to what you bring and what is ready to unfold.'
    }
];

const OfferingDetailModal = ({ isOpen, onClose, serviceData }) => {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    // Resolve which data to show
    // We try to match passed data with static data by title to get benefits/details
    const getFinalData = () => {
        if (!serviceData) return null;

        const staticMatch = offerings.find(o =>
            o.title.toLowerCase() === serviceData.title?.toLowerCase() ||
            o.id === serviceData.id
        );

        return {
            ...staticMatch, // Spread static first (has benefits, details)
            ...serviceData, // Spread passed data second (has latest title, subtitle, image)
            // Use the image already resolved in the parent component
            image: serviceData.image || (staticMatch?.image)
        };
    };

    const offering = getFinalData();

    if (!offering) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="offering-modal-overlay"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 30 }}
                        transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
                        className="offering-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {offering && (
                            <>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="offering-close-btn"
                                >
                                    <svg className="offering-close-icon" fill="none" stroke="#245e2f" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </motion.button>

                                <div className="offering-scroll-area custom-scrollbar" data-lenis-prevent>
                                    <div className="offering-hero-section">
                                        <div className="offering-grid">
                                            <motion.div
                                                initial={{ opacity: 0, x: -30 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.6, delay: 0.1 }}
                                            >
                                                <div className="offering-image-container">
                                                    <motion.img
                                                        whileHover={{ scale: 1.05 }}
                                                        transition={{ duration: 0.6 }}
                                                        alt={offering.title}
                                                        className="offering-image"
                                                        src={offering.image}
                                                    />
                                                    <div className="offering-image-overlay" />
                                                </div>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, x: 30 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.6, delay: 0.2 }}
                                                className="offering-info"
                                            >
                                                <p className="offering-subtitle">
                                                    {offering.subtitle}
                                                </p>
                                                <h1 className="offering-title">
                                                    {offering.title}
                                                </h1>
                                                <p className="offering-description">
                                                    {offering.description}
                                                </p>
                                            </motion.div>
                                        </div>
                                    </div>

                                    <div className="offering-cta-section">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: 0.4 }}
                                        >
                                            <h2 className="offering-cta-title">
                                                Ready to Begin Your Journey?
                                            </h2>
                                            <p className="offering-cta-subtitle">
                                                Take the first step towards holistic healing and transformation.
                                            </p>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setIsContactModalOpen(true)}
                                                className="offering-cta-btn"
                                            >
                                                Connect With Us Today
                                            </motion.button>
                                        </motion.div>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>

                    {offering && (
                        <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} serviceName={offering.title} />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OfferingDetailModal;
