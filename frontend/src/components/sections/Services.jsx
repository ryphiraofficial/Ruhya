import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../css/Services.css';
import OfferingDetailModal from './OfferingDetailModal';

import service1 from '../../assets/826bb818b29cc44150e12970da04fd9ba5167b91.png';
import service2 from '../../assets/50890a46240fc48c66bf9036bd63303afee0193c.png';
import service3 from '../../assets/9e717de9d8db97563969ee01cf0d50526433651d.png';
import service4 from '../../assets/1674709d7e2e3706185e5699932ba4a2ee107b43.png';

import { BASE_URL, getImageUrl } from '../../config/api';

const defaultServices = [
    {
        id: 'inner-child-healing',
        title: 'Inner Child Healing',
        subtitle: 'Emotional Restoration',
        image: service2
    },
    {
        id: 'transpersonal-hypnotherapy',
        title: 'Transpersonal Hypnotherapy',
        subtitle: 'Regression Therapy',
        image: service3
    },
    {
        id: 'holistic-healing',
        title: 'Holistic Integrated Creative Arts Therapy',
        subtitle: 'Personalized Healing',
        image: service4
    },
    {
        id: 'family-constellation',
        title: 'Family Constellation Therapy',
        subtitle: 'Ancestral Healing',
        image: service1
    }
];

// Desired display order for services
const desiredOrder = [
    'Inner Child Healing',
    'Transpersonal Hypnotherapy',
    'Holistic Integrated Creative Arts Therapy',
    'Family Constellation Therapy'
];

// Map keywords to their fallback images for reliable matching
const imageFallbackMap = {
    'inner child': service2,
    'transpersonal': service3,
    'holistic': service4,
    'family constellation': service1,
    'constellation': service1
};

const Services = () => {
    const [services, setServices] = useState(defaultServices);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/services`);
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        const mappedServices = data.map((service) => {
                            // Find fallback image by matching keywords in title
                            const titleLower = service.title.toLowerCase();
                            let fallbackImage = defaultServices[0].image;
                            for (const [keyword, img] of Object.entries(imageFallbackMap)) {
                                if (titleLower.includes(keyword)) {
                                    fallbackImage = img;
                                    break;
                                }
                            }

                            return {
                                id: service._id,
                                title: service.title,
                                subtitle: service.subtitle,
                                description: service.description,
                                fallbackImage: fallbackImage,
                                image: service.imageUrl ? getImageUrl(service.imageUrl) : fallbackImage
                            };
                        });

                        // Sort by desired order
                        mappedServices.sort((a, b) => {
                            const indexA = desiredOrder.findIndex(t => a.title.toLowerCase().includes(t.toLowerCase().split(' ')[0].toLowerCase()));
                            const indexB = desiredOrder.findIndex(t => b.title.toLowerCase().includes(t.toLowerCase().split(' ')[0].toLowerCase()));
                            return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
                        });

                        setServices(mappedServices);
                    }
                }
            } catch (err) {
                console.error('Error fetching services:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchServices();
    }, []);

    const handleOpenModal = (service) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    return (
        <section className="services">
            <motion.h2
                className="section-title"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                Core Services
            </motion.h2>

            <div className="services-grid">
                {services.map((service, index) => (
                    <motion.div
                        key={service.id || index}
                        className="service-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        onClick={() => handleOpenModal(service)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="oval-image-container">
                            <img src={service.image} alt={service.title} onError={(e) => { if (service.fallbackImage) e.target.src = service.fallbackImage; }} />
                        </div>
                        <h3>{service.title}</h3>
                        <p>{service.subtitle}</p>
                    </motion.div>
                ))}
            </div>

            <OfferingDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                serviceData={selectedService}
            />
        </section >
    );
};

export default Services;
