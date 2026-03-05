import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../css/Testimonials.css';

import imgRectangle18 from "../../assets/d68b2f1d148172a6f22490a658ef2f976ac7d368.png";
import imgRectangle17 from "../../assets/5e98859f89dfd1e6d64d53e934328a8aa61c9fed.png";
import imgRectangle19 from "../../assets/1674709d7e2e3706185e5699932ba4a2ee107b43.png";

import { BASE_URL } from '../../config/api';

const defaultTestimonials = [
//     {
//         id: 1,
//         name: 'Amritha',
//         image: imgRectangle18,
//         text: 'Replace this with actual client testimonial. Share their transformation story, what they appreciated about your work, and how the healing sessions impacted their life. Keep it authentic and heartfelt.',
//         service: 'Inner Child Healing'
//     },
//     {
//         id: 2,
//         name: 'Midhun',
//         image: imgRectangle17,
//         text: 'Replace this with actual client testimonial. Share their transformation story, what they appreciated about your work, and how the healing sessions impacted their life. Keep it authentic and heartfelt.',
//         service: 'Family Constellation Therapy'
//     },
//     {
//         id: 3,
//         name: 'Roopa',
//         image: imgRectangle19,
//         text: 'Replace this with actual client testimonial. Share their transformation story, what they appreciated about your work, and how the healing sessions impacted their life. Keep it authentic and heartfelt.',
//         service: 'Holistic Healing Sessions'
//     },
//     {
//         id: 4,
//         name: 'Aiswarya',
//         image: imgRectangle18,
//         text: 'Add more testimonials as you receive them. Each testimonial helps build trust with potential clients and showcases the transformative power of your healing work.',
//         service: 'Reiki & Energy Healing'
//     }
];

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

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState(defaultTestimonials);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/testimonials`);
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        const mappedTestimonials = data.map((testimonial, index) => ({
                            id: testimonial._id,
                            name: testimonial.name,
                            service: testimonial.service,
                            text: testimonial.text,
                            image: testimonial.imageUrl ? `${BASE_URL}${testimonial.imageUrl}` : defaultTestimonials[index]?.image || defaultTestimonials[0].image
                        }));
                        // Merge: New ones from DB + Default ones
                        setTestimonials([...mappedTestimonials, ...defaultTestimonials]);
                    }
                }
            } catch (err) {
                console.error('Error fetching testimonials:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    const sliderSettings = {
        dots: true,
        infinite: testimonials.length > 1,
        speed: 600,
        slidesToShow: 3, // Default to desktop view
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        arrows: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1, // Correctly show 1 slide on mobile
                    slidesToScroll: 1,
                    arrows: false,
                    dots: true
                }
            }
        ],
        useTransform: true,
        accessibility: true,
        focusOnSelect: false
    };

    return (
        <section className="testimonials-section">
            <div className="testimonials-container">
                <SectionReveal>
                    <h2 className="testimonials-title">
                        Testimonials
                    </h2>
                </SectionReveal>

                <SectionReveal delay={0.2}>
                    <p className="testimonials-subtitle">
                        Stories of transformation and healing from those who have walked this path
                    </p>
                </SectionReveal>

                <SectionReveal delay={0.3}>
                    <div className="testimonials-slider">
                        <Slider key={testimonials.length} {...sliderSettings}>
                            {testimonials.map((testimonial) => (
                                <div key={testimonial.id}>
                                    <div className="testimonial-card-wrapper">
                                        <div className="testimonial-card">
                                            {/* Client Image */}
                                            <div className="testi-img-container">
                                                <div className="testi-img-inner">
                                                    <div className="testi-avatar">
                                                        <img
                                                            src={testimonial.image}
                                                            alt={testimonial.name}
                                                        />
                                                    </div>
                                                    {/* Quotation mark overlay */}
                                                    <div className="testi-quote-badge">
                                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Testimonial text */}
                                            <p className="testi-quote-text">
                                                "{testimonial.text}"
                                            </p>

                                            {/* Client info */}
                                            <div className="testi-author-info">
                                                <p className="testi-author-name">
                                                    {testimonial.name}
                                                </p>
                                                <p className="testi-author-service">
                                                    {testimonial.service}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </SectionReveal>
            </div>
        </section>
    );
};

export default Testimonials;
