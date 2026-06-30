import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollCanvas } from './ScrollCanvas';
import { Header } from './Header';
import { Snowflakes } from './Snowflakes';

// ─── DISTRIBUIÇÃO DE TEMPO ─────────────────────────────────────────────────
// Canvas: 2000px (viewport ~641px → ~1359px de scroll efetivo = 3.28px/frame)
// Frames: 001-414 (gatilhos para as animações dos textos)
//
// frame 10  (2.42%)  : herói inicia saída → desliza esquerda + fade
// frame 44  (10.65%) : herói totalmente transparente (reversível ao scrollar)
// frame 166 (40.00%) : texto verde surge da esquerda
// frame 178 (43.00%) : texto verde totalmente visível (opacidade rápida)
// frame 269 (65.00%) : texto verde inicia saída (antecipada)
// frame 310 (75.00%) : texto verde totalmente transparente
// frame 381 (92.00%) : "muito mais do que sorvete" → azul (janela ampliada)
// ──────────────────────────────────────────────────────────────────────────

const F = {
  HERO_EXIT_START: 0.0242,
  HERO_EXIT_END: 0.1065,
  GREEN_ENTER: 0.40,
  GREEN_FULL: 0.43,
  GREEN_EXIT_START: 0.65,
  GREEN_EXIT_END: 0.75,
  BLUE_ENTER: 0.92,
};

const getFramePath = (i: number) => {
  const frameNumber = (i + 1).toString().padStart(3, '0');
  return `/inicial/ezgif-frame-${frameNumber}.jpg`;
};

function SaibaMaisButton() {
  const [clicked, setClicked] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  const handleClick = () => {
    if (clicked) return;
    setClicked(true);
    setTimeout(() => setShowCheck(true), 1440);
    setTimeout(() => {
      setShowCheck(false);
      setClicked(false);
    }, 8000);
  };

  return (
    <div className="relative inline-flex items-center justify-center mt-10 pointer-events-auto">
      <motion.button
        onClick={handleClick}
        disabled={clicked}
        className="relative overflow-hidden rounded-full font-display font-bold text-lg tracking-wide inline-flex items-center justify-center min-w-[200px] h-[56px] shadow-lg transition-none"
        animate={{
          backgroundColor: '#4A2B18',
          color: '#FAFAFA',
          border: '2px solid rgba(255,255,255,0.2)',
        }}
        whileHover={!clicked ? {
          backgroundColor: '#F6B8C6',
          color: '#4A2B18',
          borderColor: '#F6B8C6',
        } : undefined}
        whileTap={!clicked ? {
          scale: 0.92,
        } : undefined}
        transition={{ duration: 0.25 }}
      >
        {/* Water fill — azul (#5FC9D6) */}
        <motion.div
          className="absolute bottom-0 left-0 w-full"
          style={{ zIndex: 5, backgroundColor: '#5FC9D6' }}
          animate={{ height: clicked ? '100%' : '0%' }}
          transition={clicked
            ? { duration: 1.8, ease: [0.65, 0, 0.35, 1] }
            : { duration: 0.3, ease: 'easeOut' }
          }
        />

        <span className="relative z-10 flex items-center justify-center px-8">
          <AnimatePresence mode="wait">
            {showCheck ? (
              <motion.span
                key="check"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.3, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 400, damping: 15 }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.span>
            ) : (
              <motion.span
                key="text"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                Saiba Mais
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </motion.button>

      {/* Particles — fora do overflow-hidden do botão */}
      <AnimatePresence>
        {showCheck && Array.from({ length: 16 }, (_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const dist = 60 + Math.random() * 60;
          const size = 2 + Math.random() * 3;
          return (
            <motion.div
              key={`p-${i}`}
              className="absolute rounded-full bg-white pointer-events-none"
              style={{
                width: size, height: size,
                left: '50%', top: '50%',
                marginLeft: -size / 2, marginTop: -size / 2,
              }}
              initial={{ opacity: 1, x: 0, y: 0 }}
              animate={{
                opacity: 0,
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist,
              }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.02 }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export function MainSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const greenRef = useRef<HTMLDivElement>(null);
  const blueRef = useRef<HTMLDivElement>(null);
  const snowflakesRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);

  const progressRef = useRef<(p: number) => void>();

  // ── Estados iniciais ────────────────────────────────────────────────────
  useEffect(() => {
    const hero = heroRef.current;
    const green = greenRef.current;
    const blue = blueRef.current;
    if (!hero || !green || !blue) return;
    gsap.set(green, { opacity: 0, xPercent: -110 });
    gsap.set(blue, { opacity: 0, xPercent: -110 });
    gsap.set(hero, { opacity: 1, xPercent: 0, visibility: 'visible' });
  }, []);

  // ── Callback de progresso compartilhado com o canvas ────────────────────
  if (!progressRef.current) {
    progressRef.current = (p: number) => {
      const hero = heroRef.current;
      const green = greenRef.current;
      const blue = blueRef.current;
      const snowflakes = snowflakesRef.current;
      const canvasWrap = canvasWrapRef.current;
      if (!hero || !green || !blue || !snowflakes || !canvasWrap) return;

      // End: hide everything so 0-height container doesn't overflow over Classics
      if (p >= 1) {
        gsap.set(hero, { opacity: 0, visibility: 'hidden' });
        gsap.set(green, { opacity: 0, xPercent: -15, visibility: 'hidden' });
        gsap.set(blue, { opacity: 0, xPercent: -110, visibility: 'hidden' });
        gsap.set(snowflakes, { opacity: 0 });
        gsap.set(canvasWrap, { opacity: 0, visibility: 'hidden' });
        return;
      }

      // HERO
      if (p < F.HERO_EXIT_START) {
        gsap.set(hero, { opacity: 1, xPercent: 0, visibility: 'visible' });
      } else if (p < F.HERO_EXIT_END) {
        const t = (p - F.HERO_EXIT_START) / (F.HERO_EXIT_END - F.HERO_EXIT_START);
        gsap.set(hero, { opacity: 1 - t, xPercent: -15 * t, visibility: 'visible' });
      } else {
        gsap.set(hero, { opacity: 0, xPercent: -15, visibility: 'hidden' });
      }

      // SNOWFLAKES
      if (p >= F.GREEN_ENTER && p < F.GREEN_EXIT_END) {
        gsap.set(snowflakes, { opacity: 1 });
      } else {
        gsap.set(snowflakes, { opacity: 0 });
      }

      // GREEN
      if (p < F.GREEN_ENTER) {
        gsap.set(green, { opacity: 0, xPercent: -110 });
      } else if (p < F.GREEN_FULL) {
        const t = (p - F.GREEN_ENTER) / (F.GREEN_FULL - F.GREEN_ENTER);
        gsap.set(green, { opacity: t, xPercent: -110 + t * 110 });
      } else if (p < F.GREEN_EXIT_START) {
        gsap.set(green, { opacity: 1, xPercent: 0 });
      } else if (p < F.GREEN_EXIT_END) {
        const t = (p - F.GREEN_EXIT_START) / (F.GREEN_EXIT_END - F.GREEN_EXIT_START);
        gsap.set(green, { opacity: 1 - t, xPercent: -15 * t });
      } else {
        gsap.set(green, { opacity: 0, xPercent: -15 });
      }

      // BLUE (sem saída — fica visível até o fim, reversível ao scrollar pra cima)
      if (p < F.BLUE_ENTER) {
        gsap.set(blue, { opacity: 0, xPercent: -110 });
      } else {
        const t = (p - F.BLUE_ENTER) / (1 - F.BLUE_ENTER);
        gsap.set(blue, { opacity: Math.min(t, 1), xPercent: -110 + Math.min(t, 1) * 110 });
      }
    };
  }

  const pinkNeon = "0 0 18px rgba(246,184,198,1), 0 0 50px rgba(246,184,198,0.7), 0 4px 12px rgba(0,0,0,0.3)";
  const greenNeon = "0 0 18px rgba(60,160,110,0.95), 0 0 50px rgba(60,160,110,0.65), 0 4px 12px rgba(0,0,0,0.4)";
  const blueNeon = "0 0 18px rgba(95,201,214,0.95), 0 0 45px rgba(95,201,214,0.55), 0 4px 12px rgba(0,0,0,0.35)";

  return (
    <div ref={containerRef} className="relative z-0">
      <Header />

      <div ref={canvasWrapRef}>
        <ScrollCanvas
          frameCount={414}
          framePath={getFramePath}
          scrollTriggerStart="top top"
          scrollTriggerEnd="+=1350"
          canvasHeight="0"
          scrub={true}
          onProgress={progressRef.current}
        >
        {/* Snowflakes */}
        <div ref={snowflakesRef} className="absolute inset-0 z-0 pointer-events-none" style={{ opacity: 0 }}>
          <Snowflakes />
        </div>

        {/* 1 ─ HERÓI: desliza esquerda e fica transparente */}
        <div
          ref={heroRef}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <h1
            className="font-display font-extrabold text-white text-center px-6"
            style={{
              fontSize: 'clamp(2.8rem, 6.5vw, 6rem)',
              textShadow: pinkNeon,
              lineHeight: 1.1,
            }}
          >
            A Magia em<br />Cada Bola
          </h1>

          <motion.div
            className="mt-10 flex flex-col items-center gap-2 text-white/80"
            animate={{ opacity: [0.4, 1, 0.4], y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          >
            <span className="font-body text-xs uppercase tracking-[0.25em] font-semibold">
              Role para Descobrir
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 4V20M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>

        {/* 2 ─ TEXTO VERDE: lado esquerdo, alinhado à esquerda */}
        <div className="absolute inset-0 flex items-center justify-start px-8 md:px-16">
          <div ref={greenRef} className="max-w-2xl" style={{ opacity: 0 }}>
            <h2
              className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl leading-tight"
              style={{ color: 'white', textShadow: greenNeon }}
            >
              Não fazemos apenas sorvete.
              <br className="hidden md:block" />
              Criamos experiências.
            </h2>
          </div>
        </div>

        {/* 3 ─ TEXTO AZUL: lado esquerdo, texto centralizado */}
        <div className="absolute inset-0 flex items-center justify-start px-8 md:px-16">
          <div ref={blueRef} className="max-w-3xl text-center" style={{ opacity: 0 }}>
            <h2
              className="font-display text-5xl md:text-7xl leading-tight tracking-tight"
              style={{
                  color: 'white',
                  textShadow: blueNeon,
                fontStyle: 'italic',
                fontWeight: 800,
              }}
            >
              muito mais do<br />que sorvete
            </h2>

            <SaibaMaisButton />
          </div>
        </div>
      </ScrollCanvas>
      </div>
    </div>
  );
}
