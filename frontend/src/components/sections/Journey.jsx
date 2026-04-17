import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';
import '../css/Journey.css';

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

const Journey = () => {
    const { emailId } = useSettings();
    return (
        <section className="journey" id="journey">
            <div className="journey-container">
                <SectionReveal>
                    <h2 className="journey-title">
                        Begin Your Journey
                    </h2>
                </SectionReveal>

                <SectionReveal delay={0.2}>
                    <p className="journey-subtitle">
                        Your healing journey starts with a single step. Reach out to schedule your first session.
                    </p>
                </SectionReveal>

                <SectionReveal delay={0.4}>
                    {/* <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = `mailto:${emailId}`}
                        className="journey-button"
                    >
                        Get In Touch
                    </motion.button> */}
                </SectionReveal>
            </div>
        </section>
    );
};

export default Journey;
