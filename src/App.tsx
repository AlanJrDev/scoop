import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { MainSequence } from './components/MainSequence';
import { ClassicsShowcase } from './components/ClassicsShowcase';
import { FooterCTA } from './components/FooterCTA';
import { CustomCursor } from './components/CustomCursor';
import { Preloader } from './components/Preloader';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Preload first frame + wait for page ready
    const img = new Image();
    img.src = '/inicial/ezgif-frame-001.jpg';
    let loaded = false;

    const done = () => {
      if (loaded) return;
      loaded = true;
      setLoading(false);
    };

    img.onload = done;
    img.onerror = done;

    // Fallback: max 4s
    const fallback = setTimeout(done, 4000);

    // Also wait for window fully loaded
    if (document.readyState === 'complete') {
      // already complete, just wait for image
    } else {
      window.addEventListener('load', done, { once: true });
    }

    return () => {
      clearTimeout(fallback);
      img.onload = null;
      img.onerror = null;
    };
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });

    // Lenis notifica ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Lenis roda no ticker do GSAP
    gsap.ticker.lagSmoothing(0);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && <Preloader />}
      </AnimatePresence>

      <main className="bg-bg-neutral min-h-screen selection:bg-pink-bubblegum selection:text-chocolate">
        <CustomCursor />
        <MainSequence />
        <ClassicsShowcase />
        <FooterCTA />
      </main>
    </>
  );
}

export default App;
