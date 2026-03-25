import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
    LogOut, Save, Upload, Check, RotateCcw, X, Plus,
    Layout, Type, MessageSquare, History, Settings, Heart,
    ChevronRight, Eye, Edit3, Image as ImageIcon, Trash2, Clock, ArrowUp, ArrowDown
} from 'lucide-react';
import api from '../utils/api';
import { SECTION_DEFAULTS } from '../utils/defaults';
import toast from 'react-hot-toast';
import '../css/AdminDashboard.css';

// Default images fallback
import imgProfile from '../../assets/927b46439c6a089ede1d1e33aed952de81476f46.png';
import serviceImg1 from '../../assets/826bb818b29cc44150e12970da04fd9ba5167b91.png';
import serviceImg2 from '../../assets/50890a46240fc48c66bf9036bd63303afee0193c.png';
import serviceImg3 from '../../assets/9e717de9d8db97563969ee01cf0d50526433651d.png';
import serviceImg4 from '../../assets/1674709d7e2e3706185e5699932ba4a2ee107b43.png';

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://ruhya-backend.onrender.com';
const DEFAULT_SERVICE_IMAGES = [serviceImg1, serviceImg2, serviceImg3, serviceImg4];
const DEFAULT_ABOUT_IMAGE = imgProfile;

const SECTION_CONFIG = [
    { key: 'about', label: 'About Me', icon: Type, description: 'Manage your story and profile image' },
    { key: 'therapy', label: 'Therapy Section', icon: Heart, description: 'Manage list of needs and section text' },
    { key: 'services', label: 'Core Services', icon: Layout, description: 'Manage your therapeutic offerings' },
    { key: 'testimonials', label: 'Testimonials', icon: MessageSquare, description: 'Manage client stories and feedback' },
    { key: 'settings', label: 'Site Settings', icon: Settings, description: 'Update contact info and social links' },
    { key: 'history', label: 'Change History', icon: History, description: 'View previous versions and audit trail' },
];

const AdminDashboard = () => {
    const navigate = useNavigate();

    const DEFAULT_SERVICES_CMS = [
        {
            title: 'Family Constellation Therapy',
            subtitle: 'Ancestral Healing',
            description: 'This method looks at how family dynamics and inherited patterns can affect your emotions, relationships, and life choices. By bringing awareness to these unseen influences, it helps restore balance and emotional clarity. It often brings a sense of relief, understanding, and inner alignment.'
        },
        {
            title: 'Inner Child Healing',
            subtitle: 'Emotional Restoration',
            description: 'This work focuses on the parts of us formed during early life experiences. By gently acknowledging unmet emotional needs, it supports emotional regulation and self-compassion. It helps build a stronger, more grounded sense of self in the present.'
        },
        {
            title: 'Transpersonal Hypnotherapy',
            subtitle: 'Regression Therapy',
            description: 'This is a guided, deeply relaxed state that allows you to connect with the subconscious mind. It helps identify and shift patterns, beliefs, and emotional imprints that influence your present life. Sessions are safe, conscious, and guided — you remain aware and in control throughout.'
        },
        {
            title: 'Holistic Integrated Creative Arts Therapy',
            subtitle: 'Personalized Healing',
            description: 'This approach uses simple creative processes like drawing, movement, symbols, and expression to help you access emotions that are difficult to put into words. You do not need to be artistic — the focus is on expression, not performance. It helps release emotional blocks and supports self-awareness in a gentle, natural way.'
        }
    ];

    const [activeSection, setActiveSection] = useState('about');
    const [aboutData, setAboutData] = useState(null);
    const [services, setServices] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [therapyNeeds, setTherapyNeeds] = useState([]);
    const [therapyContent, setTherapyContent] = useState(null);
    const [revisions, setRevisions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Editing states
    const [editingAbout, setEditingAbout] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [addingTestimonial, setAddingTestimonial] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const [editingTherapy, setEditingTherapy] = useState(false);
    const [editingNeed, setEditingNeed] = useState(null);
    const [selectedRevision, setSelectedRevision] = useState(null);

    // Form states
    const [aboutForm, setAboutForm] = useState({ title: '', subtitle: '', body: '', imageUrl: '' });
    const [serviceForm, setServiceForm] = useState({ title: '', subtitle: '', description: '', imageUrl: '' });
    const [testimonialForm, setTestimonialForm] = useState({ name: '', service: '', text: '', imageUrl: '' });
    const [settingsForm, setSettingsForm] = useState({ phoneNumber: '', emailId: '', instagramLink: '', facebookLink: '' });
    const [therapyForm, setTherapyForm] = useState({ title: '', subtitle: '', body: '' });
    const [needForm, setNeedForm] = useState({ text: '' });

    // File/Preview states
    const [imgFile, setImgFile] = useState(null);
    const [imgPreview, setImgPreview] = useState(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setIsLoading(true);
        try {
            const [aboutRes, therapyRes, therapyNeedsRes, servicesRes, testimonialsRes] = await Promise.all([
                api.get('/content/about').catch(() => ({ data: SECTION_DEFAULTS.about })),
                api.get('/content/therapy').catch(() => ({ data: SECTION_DEFAULTS.therapy })),
                api.get('/therapy-needs').catch(() => ({ data: [] })),
                api.get('/services').catch(() => ({ data: [] })),
                api.get('/testimonials').catch(() => ({ data: [] }))
            ]);

            console.log('Services from API:', servicesRes.data);

            setAboutData(aboutRes.data);
            setTherapyContent(therapyRes.data);
            setTherapyNeeds(therapyNeedsRes.data || []);

            // If no services from API, use the 4 defaults as placeholders
            if (servicesRes.data && servicesRes.data.length > 0) {
                setServices(servicesRes.data);
            } else {
                setServices(DEFAULT_SERVICES_CMS);
            }

            setTestimonials(testimonialsRes.data || []);

            const settingsRes = await api.get('/settings');
            setSettingsForm(settingsRes.data);
        } catch (err) {
            console.error('Initial fetch failed:', err);
        } finally {
            setIsLoading(false);
            fetchHistory();
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await api.get('/history');
            setRevisions(res.data);
        } catch (err) {
            console.error('History fetch failed:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('ruhiya_admin_token');
        navigate('/admin/login');
    };

    const getImageSrc = (url) => {
        if (!url) return null;
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        return `${BACKEND_URL}${url}`;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImgFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImgPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const clearStates = () => {
        setEditingAbout(false);
        setEditingService(null);
        setAddingTestimonial(false);
        setEditingTestimonial(null);
        setAboutForm({ title: '', subtitle: '', body: '', imageUrl: '' });
        setServiceForm({ title: '', subtitle: '', description: '', imageUrl: '' });
        setTestimonialForm({ name: '', service: '', text: '', imageUrl: '' });
        setImgFile(null);
        setImgPreview(null);
        setSelectedRevision(null);
        setEditingTherapy(false);
        setEditingNeed(null);
        setNeedForm({ text: '' });
    };

    // --- ABOUT ACTIONS ---
    const startEditAbout = () => {
        setAboutForm({
            title: aboutData?.title || SECTION_DEFAULTS.about.title,
            subtitle: aboutData?.subtitle || SECTION_DEFAULTS.about.subtitle,
            body: aboutData?.body || SECTION_DEFAULTS.about.body,
            imageUrl: aboutData?.imageUrl || ''
        });
        setEditingAbout(true);
    };

    const saveAbout = async () => {
        setIsSaving(true);
        try {
            let finalUrl = aboutForm.imageUrl;
            if (imgFile) {
                const formData = new FormData();
                formData.append('image', imgFile);
                const res = await api.post('/upload', formData);
                finalUrl = res.data.filePath; // Fixed: .filePath from backend
            }
            const res = await api.put('/content/about', { ...aboutForm, imageUrl: finalUrl });
            setAboutData(res.data);
            toast.success('About section updated!');
            setEditingAbout(false);
            setImgFile(null);
            setImgPreview(null);
        } catch (err) {
            toast.error('Update failed.');
        } finally {
            setIsSaving(true);
            setTimeout(() => { setIsSaving(false); }, 500);
        }
    };

    // --- RESET ACTIONS ---
    const resetAboutText = () => {
        if (window.confirm("Reset all text content for the About section?")) {
            setAboutForm(prev => ({ ...prev, ...SECTION_DEFAULTS.about, imageUrl: prev.imageUrl }));
        }
    };

    const resetAboutImage = () => {
        if (window.confirm("Restore the original profile picture?")) {
            setAboutForm(prev => ({ ...prev, imageUrl: '' }));
            setImgFile(null);
            setImgPreview(null);
        }
    };

    const resetServiceText = () => {
        const index = editingService._index ?? 0;
        if (window.confirm("Reset all text for this service offering?")) {
            setServiceForm(prev => ({ ...prev, ...DEFAULT_SERVICES_CMS[index], imageUrl: prev.imageUrl }));
        }
    };

    const resetServiceImage = () => {
        if (window.confirm("Restore the original image for this service?")) {
            setServiceForm(prev => ({ ...prev, imageUrl: '' }));
            setImgFile(null);
            setImgPreview(null);
        }
    };

    // --- SERVICE ACTIONS ---
    const startEditService = (service, index) => {
        setEditingService({ ...service, _index: index });
        setServiceForm({
            title: service.title || '',
            subtitle: service.subtitle || '',
            description: service.description || '',
            imageUrl: service.imageUrl || ''
        });
    };

    const saveService = async () => {
        setIsSaving(true);
        try {
            let finalUrl = serviceForm.imageUrl;
            if (imgFile) {
                const formData = new FormData();
                formData.append('image', imgFile);
                const res = await api.post('/upload', formData);
                finalUrl = res.data.filePath; // Fixed: .filePath from backend
            }
            if (editingService._id) {
                await api.put(`/services/${editingService._id}`, { ...serviceForm, imageUrl: finalUrl });
            } else {
                // If it was a placeholder from DEFAULT_SERVICES_CMS (no _id), create it
                await api.post('/services', { ...serviceForm, imageUrl: finalUrl });
            }
            fetchInitialData();
            toast.success('Service saved successfully!');
            clearStates();
        } catch (err) {
            console.error('Service save error:', err);
            toast.error('Failed to save service.');
        } finally {
            setIsSaving(false);
        }
    };

    // --- TESTIMONIAL ACTIONS ---
    const startAddTestimonial = () => {
        setAddingTestimonial(true);
        setTestimonialForm({ name: '', service: '', text: '', imageUrl: '' });
    };

    const handleSaveTestimonial = async () => {
        setIsSaving(true);
        try {
            let finalUrl = testimonialForm.imageUrl;
            if (imgFile) {
                const formData = new FormData();
                formData.append('image', imgFile);
                const res = await api.post('/upload', formData);
                finalUrl = res.data.filePath; // Fixed: .filePath from backend
            }

            if (editingTestimonial) {
                await api.put(`/testimonials/${editingTestimonial._id}`, { ...testimonialForm, imageUrl: finalUrl });
            } else {
                await api.post('/testimonials', { ...testimonialForm, imageUrl: finalUrl });
            }

            fetchInitialData();
            toast.success(editingTestimonial ? 'Testimonial updated!' : 'Testimonial added!');
            clearStates();
        } catch (err) {
            toast.error('Operation failed.');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteTestimonial = async (id) => {
        if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
        try {
            await api.delete(`/testimonials/${id}`);
            fetchInitialData();
            toast.success('Testimonial deleted.');
        } catch (err) {
            toast.error('Delete failed.');
        }
    };

    const handleClearHistory = async () => {
        if (!window.confirm('Delete all history records? This action cannot be undone.')) return;
        try {
            await api.delete('/history/clear');
            toast.success('History cleared.');
            fetchHistory();
        } catch (err) {
            toast.error('Failed to clear history.');
        }
    };

    // --- THERAPY ACTIONS ---
    const startEditTherapy = () => {
        setTherapyForm({
            title: therapyContent?.title || SECTION_DEFAULTS.therapy.title,
            subtitle: therapyContent?.subtitle || SECTION_DEFAULTS.therapy.subtitle,
            body: therapyContent?.body || SECTION_DEFAULTS.therapy.body
        });
        setEditingTherapy(true);
    };

    const saveTherapyContent = async () => {
        setIsSaving(true);
        try {
            const res = await api.put('/content/therapy', therapyForm);
            setTherapyContent(res.data);
            toast.success('Therapy section text updated!');
            setEditingTherapy(false);
        } catch (err) {
            toast.error('Update failed.');
        } finally {
            setIsSaving(false);
        }
    };

    const saveNeed = async () => {
        setIsSaving(true);
        try {
            if (editingNeed) {
                await api.put(`/therapy-needs/${editingNeed._id}`, needForm);
                toast.success('Need updated!');
            } else {
                await api.post('/therapy-needs', needForm);
                toast.success('Need added!');
            }
            const res = await api.get('/therapy-needs');
            setTherapyNeeds(res.data);
            clearStates();
        } catch (err) {
            toast.error('Failed to save need.');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteNeed = async (id) => {
        if (!window.confirm('Delete this need?')) return;
        try {
            await api.delete(`/therapy-needs/${id}`);
            setTherapyNeeds(prev => prev.filter(n => n._id !== id));
            toast.success('Need removed.');
        } catch (err) {
            toast.error('Delete failed.');
        }
    };

    const saveReorder = async (values) => {
        try {
            const orders = values.map((n, i) => ({ id: n._id, order: i }));
            await api.put('/therapy-needs/reorder', { orders });
        } catch (err) {
            console.error('Reorder failed:', err);
            toast.error('Failed to sync order with server.');
        }
    };

    const handleReorder = (newOrder) => {
        setTherapyNeeds(newOrder);
        saveReorder(newOrder);
    };

    // --- RENDERS ---

    const renderAbout = () => {
        const displayData = aboutData || SECTION_DEFAULTS.about;
        const profileImg = getImageSrc(displayData.imageUrl) || DEFAULT_ABOUT_IMAGE;

        return (
            <div className="admin-about-view">
                <div className="preview-header">
                    <h3>Visual Preview</h3>
                    {!editingAbout && (
                        <button className="cms-edit-btn" onClick={startEditAbout}>
                            <Edit3 size={16} /> Edit About Me
                        </button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {editingAbout ? (
                        <motion.div key="edit" className="cms-edit-form-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="cms-form-columns">
                                <div className="cms-form-left">
                                    <div className="cms-field">
                                        <label>Title</label>
                                        <input type="text" value={aboutForm.title} onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })} />
                                    </div>
                                    <div className="cms-field">
                                        <label>Subheading</label>
                                        <input type="text" value={aboutForm.subtitle} onChange={(e) => setAboutForm({ ...aboutForm, subtitle: e.target.value })} />
                                    </div>
                                    <div className="cms-field">
                                        <label>Body Bio (Use newlines for paragraphs)</label>
                                        <textarea rows={12} value={aboutForm.body} onChange={(e) => setAboutForm({ ...aboutForm, body: e.target.value })} />
                                    </div>
                                </div>
                                <div className="cms-form-right">
                                    <div className="header-with-action">
                                        <label>Profile Image</label>
                                        <button className="text-action-btn" onClick={resetAboutImage}>
                                            <RotateCcw size={12} /> Reset Image
                                        </button>
                                    </div>
                                    <div className="cms-image-upload-about">
                                        <img src={imgPreview || getImageSrc(aboutForm.imageUrl) || DEFAULT_ABOUT_IMAGE} alt="Profile" />
                                        <label className="cms-upload-label-overlay">
                                            <Upload size={18} /> Change Image
                                            <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                                        </label>
                                    </div>

                                    <div className="cms-reset-text-zone">
                                        <button className="cms-reset-all-text-btn" onClick={resetAboutText}>
                                            <RotateCcw size={14} /> Reset all bio text to default
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="cms-form-actions">
                                <button className="cms-cancel-btn" onClick={() => setEditingAbout(false)}>Cancel</button>
                                <button className="cms-save-btn" onClick={saveAbout} disabled={isSaving}>
                                    <Save size={18} /> {isSaving ? 'Saving...' : 'Update Section'}
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="view" className="live-alike-about">
                            <div className="live-about-content">
                                <div className="live-about-text">
                                    <h2 className="live-h2">{displayData.title}</h2>
                                    <h3 className="live-h3">{displayData.subtitle}</h3>
                                    <div className="live-bio">
                                        {displayData.body?.split('\n').filter(p => p.trim()).map((p, i) => <p key={i}>{p}</p>)}
                                    </div>
                                </div>
                                <div className="live-about-image">
                                    <div className="live-img-wrapper">
                                        <img src={profileImg} alt="Profile" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    const renderServices = () => {
        return (
            <div className="admin-services-view">
                <div className="preview-header">
                    <h3>Service Offerings</h3>
                    <p className="hint-text">Edit each therapeutic offering below</p>
                </div>

                <div className="admin-services-grid">
                    {services.map((service, index) => (
                        <div key={service._id || `placeholder-${index}`} className="admin-service-card">
                            <div className="admin-service-img">
                                <img src={getImageSrc(service.imageUrl) || DEFAULT_SERVICE_IMAGES[index] || DEFAULT_SERVICE_IMAGES[0]} alt={service.title} />
                                {!service._id && <div className="placeholder-badge">New / Default</div>}
                            </div>
                            <div className="admin-service-info">
                                <h4>{service.title}</h4>
                                <span className="service-tag">{service.subtitle}</span>
                                <p className="service-desc-short">{service.description?.substring(0, 100)}...</p>
                                <button className="admin-card-edit-btn" onClick={() => startEditService(service, index)}>
                                    <Edit3 size={14} /> Edit Offering
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <AnimatePresence>
                    {editingService && (
                        <motion.div className="cms-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="cms-modal">
                                <div className="modal-header">
                                    <h4>Edit Service: {editingService.title}</h4>
                                    <button onClick={clearStates}><X size={20} /></button>
                                </div>
                                <div className="modal-body">
                                    <div className="cms-field">
                                        <label>Title</label>
                                        <input type="text" value={serviceForm.title} onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })} />
                                    </div>
                                    <div className="cms-field">
                                        <label>Subheading/Tag</label>
                                        <input type="text" value={serviceForm.subtitle} onChange={e => setServiceForm({ ...serviceForm, subtitle: e.target.value })} />
                                    </div>
                                    <div className="cms-field">
                                        <label>Full Description (Show in detail modal)</label>
                                        <textarea rows={5} value={serviceForm.description} onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })} />
                                    </div>
                                    <div className="cms-field">
                                        <div className="header-with-action">
                                            <label>Image</label>
                                            <button className="text-action-btn" onClick={resetServiceImage}>
                                                <RotateCcw size={12} /> Reset Image
                                            </button>
                                        </div>
                                        <div className="modal-img-upload">
                                            <img src={imgPreview || getImageSrc(serviceForm.imageUrl) || DEFAULT_SERVICE_IMAGES[editingService._index ?? 0]} alt="Service" />
                                            <label className="cms-upload-label-overlay">
                                                <Upload size={18} /> Upload New
                                                <input type="file" hidden onChange={handleFileChange} />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="modal-footer-secondary">
                                        <button className="cms-reset-all-text-btn" onClick={resetServiceText}>
                                            <RotateCcw size={14} /> Reset text to default
                                        </button>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="cms-cancel-btn" onClick={clearStates}>Cancel</button>
                                    <button className="cms-save-btn" onClick={saveService} disabled={isSaving}>
                                        <Save size={18} /> Save Changes
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    const renderTestimonials = () => {
        return (
            <div className="admin-testimonials-view">
                <div className="preview-header">
                    <h3>Client Feedback ({testimonials.length} added)</h3>
                    <button className="cms-add-btn" onClick={startAddTestimonial}>
                        <Plus size={16} /> Add New Testimonial
                    </button>
                </div>

                {testimonials.length === 0 && (
                    <div className="cms-empty-notice">
                        <MessageSquare size={32} />
                        <p>No testimonials added yet. The website is currently showing placeholder testimonials.</p>
                        <p className="hint-text">Click "Add New Testimonial" to add real client stories. They will appear on the live site alongside any existing ones.</p>
                    </div>
                )}

                <div className="cms-testimonials-grid">
                    {testimonials.map(t => (
                        <div key={t._id} className="cms-testimonial-card">
                            <div className="testi-card-top">
                                <div className="testi-avatar-small">
                                    <img src={getImageSrc(t.imageUrl)} alt={t.name} />
                                </div>
                                <div className="testi-meta">
                                    <h5>{t.name}</h5>
                                    <span>{t.service}</span>
                                </div>
                            </div>
                            <p className="testi-quote-text">"{t.text?.substring(0, 150)}..."</p>
                            <div className="testi-card-actions">
                                <button className="icon-btn" onClick={() => {
                                    setEditingTestimonial(t);
                                    setTestimonialForm({ name: t.name, service: t.service, text: t.text, imageUrl: t.imageUrl });
                                    setAddingTestimonial(true);
                                }}>
                                    <Edit3 size={14} />
                                </button>
                                <button className="icon-btn delete" onClick={() => deleteTestimonial(t._id)}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <AnimatePresence>
                    {addingTestimonial && (
                        <motion.div className="cms-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="cms-modal">
                                <div className="modal-header">
                                    <h4>{editingTestimonial ? 'Update Testimonial' : 'New Testimonial'}</h4>
                                    <button onClick={clearStates}><X size={20} /></button>
                                </div>
                                <div className="modal-body">
                                    <div className="cms-field">
                                        <label>Client Name</label>
                                        <input type="text" value={testimonialForm.name} onChange={e => setTestimonialForm({ ...testimonialForm, name: e.target.value })} />
                                    </div>
                                    <div className="cms-field">
                                        <label>Service Received</label>
                                        <input type="text" value={testimonialForm.service} onChange={e => setTestimonialForm({ ...testimonialForm, service: e.target.value })} />
                                    </div>
                                    <div className="cms-field">
                                        <label>Testimonial Content</label>
                                        <textarea rows={4} value={testimonialForm.text} onChange={e => setTestimonialForm({ ...testimonialForm, text: e.target.value })} />
                                    </div>
                                    <div className="cms-field">
                                        <label>Client Photo</label>
                                        <div className="modal-img-upload square-avatar">
                                            <img src={imgPreview || getImageSrc(testimonialForm.imageUrl)} alt="Client" />
                                            <label className="cms-upload-label-overlay">
                                                <Upload size={18} /> Select Photo
                                                <input type="file" hidden onChange={handleFileChange} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="cms-cancel-btn" onClick={clearStates}>Cancel</button>
                                    <button className="cms-save-btn" onClick={handleSaveTestimonial} disabled={isSaving}>
                                        <Save size={18} /> {editingTestimonial ? 'Update' : 'Add Testimonial'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    const renderHistory = () => {
        return (
            <div className="admin-history-view">
                <div className="preview-header">
                    <h3>Tracked Changes</h3>
                    <div className="header-actions">
                        {revisions?.length > 0 && (
                            <button className="cms-delete-history-btn" onClick={handleClearHistory}>
                                <Trash2 size={16} /> Clear All History
                            </button>
                        )}
                        {!revisions?.length && <p className="hint-text">No history entries found.</p>}
                    </div>
                </div>

                {revisions.length === 0 ? (
                    <div className="cms-empty-notice">
                        <Clock size={32} />
                        <p>No changes tracked yet. Every save creates a snapshot here.</p>
                    </div>
                ) : (
                    <div className="cms-history-timeline">
                        {revisions.map((rev) => (
                            <div key={rev._id} className="history-item" onClick={() => setSelectedRevision(rev)}>
                                <div className="history-dot"></div>
                                <div className="history-card clickable">
                                    <div className="history-meta">
                                        <span className="history-tag">{rev.section.toUpperCase()}</span>
                                        <span className="history-date">
                                            {new Date(rev.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <h4>{rev.content?.title || 'Section Update'}</h4>
                                    <p className="history-preview">
                                        {(rev.content?.body || rev.content?.description || "").substring(0, 160)}...
                                    </p>
                                    <div className="history-details-grid">
                                        {rev.content?.subtitle && (
                                            <div className="detail-pill">Tag: {rev.content.subtitle}</div>
                                        )}
                                        {rev.content?.imageUrl && (
                                            <div className="detail-pill img"><ImageIcon size={10} /> Image Updated</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <AnimatePresence>
                    {selectedRevision && (
                        <motion.div
                            className="cms-modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedRevision(null)}
                        >
                            <motion.div
                                className="cms-modal detail-modal"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="modal-header">
                                    <div>
                                        <h2>Revision Details</h2>
                                        <p className="history-date">{new Date(selectedRevision.createdAt).toLocaleString()} • {selectedRevision.section.toUpperCase()}</p>
                                    </div>
                                    <button className="cms-close-btn" onClick={() => setSelectedRevision(null)}><X size={20} /></button>
                                </div>
                                <div className="modal-body history-full-detail">
                                    <div className="detail-section">
                                        <label>Title</label>
                                        <div className="static-field">{selectedRevision.content?.title || 'Untitled'}</div>
                                    </div>
                                    {selectedRevision.content?.subtitle && (
                                        <div className="detail-section">
                                            <label>Subtitle / Tag</label>
                                            <div className="static-field">{selectedRevision.content.subtitle}</div>
                                        </div>
                                    )}
                                    <div className="detail-section">
                                        <label>Content</label>
                                        <div className="static-field content-text">
                                            {selectedRevision.content?.body || selectedRevision.content?.description || 'No detailed content.'}
                                        </div>
                                    </div>
                                    {selectedRevision.content?.imageUrl && (
                                        <div className="detail-section">
                                            <label>Included Image</label>
                                            <img
                                                src={getImageSrc(selectedRevision.content.imageUrl)}
                                                alt="Revision"
                                                className="revision-detail-img"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button className="cms-cancel-btn" onClick={() => setSelectedRevision(null)}>Close</button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    const renderSettings = () => {
        return (
            <div className="admin-settings-view">
                <div className="preview-header">
                    <h3>Global Site Configuration</h3>
                    <p className="hint-text">Manage contact information and social media presence</p>
                </div>

                <div className="settings-card">
                    <div className="settings-grid">
                        <div className="cms-field">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                value={settingsForm.phoneNumber}
                                onChange={e => setSettingsForm({ ...settingsForm, phoneNumber: e.target.value })}
                                placeholder="+91 00000 00000"
                            />
                        </div>
                        <div className="cms-field">
                            <label>Instagram Link</label>
                            <input
                                type="text"
                                value={settingsForm.instagramLink}
                                onChange={e => setSettingsForm({ ...settingsForm, instagramLink: e.target.value })}
                                placeholder="https://instagram.com/yourprofile"
                            />
                        </div>
                        <div className="cms-field">
                            <label>Facebook Link</label>
                            <input
                                type="text"
                                value={settingsForm.facebookLink}
                                onChange={e => setSettingsForm({ ...settingsForm, facebookLink: e.target.value })}
                                placeholder="https://facebook.com/yourpage"
                            />
                        </div>
                    </div>

                    <div className="settings-actions">
                        <button className="cms-save-btn" onClick={async () => {
                            setIsSaving(true);
                            try {
                                await api.put('/settings', settingsForm);
                                toast.success('Settings updated successfully!');
                            } catch (err) {
                                toast.error('Failed to update settings');
                            } finally {
                                setIsSaving(false);
                            }
                        }} disabled={isSaving}>
                            <Save size={18} /> {isSaving ? 'Updating...' : 'Save Site Settings'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading) return <div className="cms-loading"><div className="cms-spinner" /></div>;

    return (
        <div className="cms-dashboard">
            <aside className="cms-sidebar">
                <div className="cms-brand">
                    <h2>Ruh'ya Admin</h2>
                    <span>CMS Panel</span>
                </div>
                <nav className="cms-nav">
                    {SECTION_CONFIG.map(s => (
                        <button key={s.key} className={`cms-nav-link ${activeSection === s.key ? 'active' : ''}`} onClick={() => { setActiveSection(s.key); clearStates(); }}>
                            <s.icon size={18} />
                            <div className="link-info">
                                <strong>{s.label}</strong>
                                <span>{s.description}</span>
                            </div>
                            <ChevronRight size={14} className="arrow" />
                        </button>
                    ))}
                </nav>
                <button className="cms-logout" onClick={handleLogout}><LogOut size={18} /> Sign Out</button>
            </aside>

            <main className="cms-main">
                <header className="cms-header">
                    <div className="cms-header-title">
                        <h1>{SECTION_CONFIG.find(s => s.key === activeSection)?.label}</h1>
                        <p>{SECTION_CONFIG.find(s => s.key === activeSection)?.description}</p>
                    </div>
                    <a href="/" target="_blank" className="view-live-link"><Eye size={16} /> Go to Website</a>
                </header>

                <div className="cms-body">
                    {activeSection === 'about' && renderAbout()}
                    {activeSection === 'therapy' && (
                        <div className="admin-therapy-view">
                            <div className="preview-header">
                                <h3>Section Content</h3>
                                {!editingTherapy && (
                                    <button className="cms-edit-btn" onClick={startEditTherapy}>
                                        <Edit3 size={16} /> Edit Text
                                    </button>
                                )}
                            </div>

                            {editingTherapy ? (
                                <div className="cms-edit-form-full">
                                    <div className="cms-field">
                                        <label>Title</label>
                                        <input type="text" value={therapyForm.title} onChange={e => setTherapyForm({...therapyForm, title: e.target.value})} />
                                    </div>
                                    <div className="cms-field">
                                        <label>Intro Text (appears before the list)</label>
                                        <textarea rows={4} value={therapyForm.subtitle} onChange={e => setTherapyForm({...therapyForm, subtitle: e.target.value})} />
                                    </div>
                                    <div className="cms-field">
                                        <label>Footer Text (appears after the list)</label>
                                        <textarea rows={3} value={therapyForm.body} onChange={e => setTherapyForm({...therapyForm, body: e.target.value})} />
                                    </div>
                                    <div className="cms-form-actions">
                                        <button className="cms-cancel-btn" onClick={() => setEditingTherapy(false)}>Cancel</button>
                                        <button className="cms-save-btn" onClick={saveTherapyContent} disabled={isSaving}>
                                            <Save size={18} /> {isSaving ? 'Saving...' : 'Update Section'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="live-alike-therapy">
                                    <h4>{therapyContent?.title || 'Therapy Is For Everyone'}</h4>
                                    <p>{therapyContent?.subtitle || 'Healing is not only for those in crisis...'}</p>
                                </div>
                            )}

                            <div className="preview-header" style={{ marginTop: '40px' }}>
                                <h3>Manage Needs List</h3>
                                <button className="cms-add-btn" onClick={() => { setEditingNeed(null); setNeedForm({text: ''}); }}>
                                    <Plus size={16} /> Add Need
                                </button>
                            </div>

                            {(editingNeed !== null || needForm.text !== '') && (
                                <div className="cms-inline-edit-form">
                                    <input 
                                        type="text" 
                                        value={needForm.text} 
                                        onChange={e => setNeedForm({text: e.target.value})} 
                                        placeholder="Enter need text..."
                                        autoFocus
                                    />
                                    <div className="form-actions">
                                        <button className="cms-cancel-btn" onClick={() => { setEditingNeed(null); setNeedForm({text: ''}); }}>Cancel</button>
                                        <button className="cms-save-btn" onClick={saveNeed} disabled={isSaving}>
                                            <Save size={16} /> Save
                                        </button>
                                    </div>
                                </div>
                            )}

                            <Reorder.Group 
                                axis="y" 
                                values={therapyNeeds} 
                                onReorder={handleReorder}
                                className="cms-needs-list"
                            >
                                {therapyNeeds.map((need) => (
                                    <Reorder.Item 
                                        key={need._id} 
                                        value={need}
                                        className="cms-need-item draggable"
                                    >
                                        <div className="drag-handle">
                                            <div className="drag-icon">⋮⋮</div>
                                            <span className="need-text">{need.text}</span>
                                        </div>
                                        <div className="item-actions">
                                            <button className="icon-btn" onClick={() => { setEditingNeed(need); setNeedForm({text: need.text}); }}>
                                                <Edit3 size={14} />
                                            </button>
                                            <button className="icon-btn delete" onClick={() => deleteNeed(need._id)}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>
                        </div>
                    )}
                    {activeSection === 'services' && renderServices()}
                    {activeSection === 'testimonials' && renderTestimonials()}
                    {activeSection === 'settings' && renderSettings()}
                    {activeSection === 'history' && renderHistory()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
