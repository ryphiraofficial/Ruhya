import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { BASE_URL, getImageUrl } from '../../config/api';import '../css/About.css';
import imgProfile from '../../assets/927b46439c6a089ede1d1e33aed952de81476f46.png';

// Section Reveal Animation Component
function SectionReveal({ children, delay = 0 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
}

const About = () => {
    const [content, setContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAboutContent = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/content/about`);
                const data = await response.json();
                if (response.ok && data) {
                    setContent(data);
                }
            } catch (err) {
                console.error('Error fetching about content:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAboutContent();
    }, []);

    // Default static content if backend is empty
    const displayTitle = content?.title || "About Me";
    const displaySubheading = content?.subtitle || "My Story";
    const displayImage = content?.imageUrl ? getImageUrl(content.imageUrl) : imgProfile;

    // Split body by newlines into paragraphs
    const displayParagraphs = content?.body
        ? content.body.split('\n').filter(p => p.trim() !== '')
        : [
            "Ruh'ya was born from an inner inclination that has been with me for as long as I can remember.",
            "From a very young age, I was naturally drawn to understanding people — their emotions, unspoken dynamics, inner worlds, and the deeper reasons behind behaviour. I was sensitive to atmospheres, relationships, and emotional undercurrents, often noticing what went unsaid. This intuitive awareness was not something I learned; it was something I carried.",
            "As life unfolded, experiences deepened this natural sensitivity and gave it form. I came to understand that emotional awareness, when supported with the right tools, can become a powerful pathway for healing, clarity, and integration — both for oneself and for others.",
            "My journey into therapeutic work was therefore not driven by fixing or searching, but by a growing clarity that this is the language my system understands — working with emotions, the subconscious, the body, creativity, and the unseen layers that shape our lives.",
            "Through both training and practice, I witnessed how many struggles — anxiety, emotional overwhelm, self-doubt, relationship patterns, and inner conflict — are not flaws to be corrected, but signals inviting awareness and compassion. When these signals are met with presence rather than pressure, transformation happens naturally.",
            "Ruh'ya is a space grounded in this understanding. Therapy here is not reserved for moments of crisis. It is for anyone seeking deeper self-connection, emotional regulation, clarity, or growth. You do not need to be broken to begin — you only need to be willing to listen inward.",
            "My approach is collaborative, intuitive, and grounded. I offer a steady, non-judgmental presence, creating space for your nervous system to settle, your emotions to be acknowledged, and your inner wisdom to emerge. Healing, in my experience, is not something we impose — it is something we allow."
        ];

    return (
        <section className="about">
            <div className="about-container">
                <div className="about-content">
                    {/* Heading */}
                    <SectionReveal>
                        <h2 className="about-heading">
                            {displayTitle}
                        </h2>
                    </SectionReveal>

                    {/* Image */}
                    <SectionReveal delay={0.2}>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.5 }}
                            className="about-image-wrapper"
                        >
                            <div className="about-image">
                                <img
                                    alt="Founder of Ruh'ya"
                                    src={displayImage}
                                />
                                <div className="about-image-overlay" />
                            </div>

                            {/* Decorative ring */}
                            <motion.div
                                className="about-decorative-ring"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.div>
                    </SectionReveal>

                    {/* Subheading */}
                    <SectionReveal delay={0.3}>
                        <h3 className="about-subheading">
                            {displaySubheading}
                        </h3>
                    </SectionReveal>

                    {/* Bio Text */}
                    <SectionReveal delay={0.4}>
                        <div className="about-bio">
                            {displayParagraphs.map((para, index) => (
                                <p key={index}>{para}</p>
                            ))}

                            <div className="about-bio-inner-box">
                                <p className="bio-quote-title">
                                    Ruh'ya means inner guidance
                                </p>
                                <p className="bio-quote-subtitle">
                                    Guidance that comes from within yourself.
                                </p>
                                <p className="bio-quote-text">
                                    It reflects my belief that when we slow down and listen — to the body, the mind, and the deeper self — clarity and healing naturally follow.
                                </p>
                            </div>

                            <p className="bio-footer-text">
                                You are welcome here, exactly as you are.
                            </p>
                        </div>
                    </SectionReveal>
                </div>
            </div>
        </section>
    );
};

export default About;
