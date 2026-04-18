import React, { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import Hero from './components/sections/Hero';
import Therapy from './components/sections/Therapy';
import Services from './components/sections/Services';
import About from './components/sections/About';
import Testimonials from './components/sections/Testimonials';
import EmailSection from './components/sections/EmailSection';
import Journey from './components/sections/Journey';
import Footer from './components/sections/Footer';
import WhatsAppSticky from './components/WhatsAppSticky';
import './index.css';
import './App.css';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="app-container">
      <div className="content-wrapper-sticky" style={{ position: 'relative' }}>
        <Hero />
        <Therapy />
        <Services />
        <About />
        <Testimonials />
        <EmailSection />
        <Journey />
        <WhatsAppSticky />
      </div>
      <Footer />
    </div>
  );
}

export default App;
