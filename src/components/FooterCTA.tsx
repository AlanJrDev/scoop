import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function FooterCTA() {
  const [clicked, setClicked] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  const handleOrder = () => {
    if (clicked) return;
    setClicked(true);
    // Checkmark at 80% fill (1.44s of 1.8s)
    setTimeout(() => setShowCheck(true), 1440);
    // Reset after 8 seconds
    setTimeout(() => {
      setShowCheck(false);
      setClicked(false);
    }, 8000);
  };

  return (
    <footer className="bg-bg-neutral text-chocolate pt-24 pb-12 px-6 md:px-12 rounded-t-[3rem] -mt-10 relative z-20 shadow-2xl">
      <div className="max-w-[1280px] mx-auto">

        {/* Centered CTA */}
        <div className="flex flex-col items-center justify-center text-center mb-24 max-w-3xl mx-auto pt-12">
          <motion.h2
            className="font-display font-extrabold text-5xl md:text-7xl mb-8 leading-none tracking-tight text-chocolate"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Pronto para viver essa experiência?
          </motion.h2>
          <motion.p
            className="font-body text-xl md:text-2xl mb-12 text-chocolate/70 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Peça agora e receba a magia da The Sweet Scoop direto na sua casa.
          </motion.p>

          {/* Button wrapper (for particles) */}
          <div className="relative inline-flex items-center justify-center">
            {/* Button — overflow-hidden clips the water fill to the rounded shape */}
            <motion.button
              onClick={handleOrder}
              disabled={clicked}
              className="relative overflow-hidden rounded-full font-display font-bold text-lg md:text-xl px-10 inline-flex items-center justify-center min-w-[240px] h-[64px] transition-none"
              animate={{
                backgroundColor: 'var(--color-chocolate)',
                color: 'var(--color-bg-neutral)',
              }}
              whileHover={!clicked ? {
                backgroundColor: 'var(--color-pink-bubblegum)',
                color: 'var(--color-chocolate)',
              } : undefined}
              transition={{ duration: 0.25 }}
            >
              {/* Water fill — above button bg but below text (z-index 5 vs 10) */}
              <motion.div
                className="absolute bottom-0 left-0 w-full bg-pastel-green"
                style={{ zIndex: 5 }}
                animate={{ height: clicked ? '100%' : '0%' }}
                transition={clicked
                  ? { duration: 1.8, ease: [0.65, 0, 0.35, 1] }
                  : { duration: 0.3, ease: 'easeOut' }
                }
              />

              {/* Content — above fill */}
              <span className="relative z-10 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {showCheck ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.3, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.3, type: 'spring', stiffness: 400, damping: 15 }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
                      Faça seu Pedido
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </motion.button>

            {/* Particles — outside button's overflow-hidden, burst freely */}
            <AnimatePresence>
              {showCheck && Array.from({ length: 16 }, (_, i) => {
                const angle = (i / 16) * Math.PI * 2;
                const dist = 80 + Math.random() * 80;
                const size = 2 + Math.random() * 3;
                return (
                  <motion.div
                    key={`p-${i}`}
                    className="absolute rounded-full bg-white pointer-events-none"
                    style={{
                      width: size,
                      height: size,
                      left: '50%',
                      top: '50%',
                      marginLeft: -size / 2,
                      marginTop: -size / 2,
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
        </div>

        {/* Footer Bar */}
        <div className="border-t border-chocolate/10 pt-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 font-body text-sm font-medium text-left">
          <div>
            <h4 className="font-display font-bold text-xl mb-4 text-chocolate">
              The Sweet Scoop.
            </h4>
            <p className="text-chocolate/60">© 2026 Todos os direitos reservados.</p>
          </div>

          <nav className="flex gap-8">
            <a href="#" className="hover:text-pink-bubblegum transition-colors">Instagram</a>
            <a href="#" className="hover:text-pink-bubblegum transition-colors">TikTok</a>
            <a href="#" className="hover:text-pink-bubblegum transition-colors">iFood</a>
          </nav>

          <div className="md:text-right">
            <p className="mb-1">Rua dos Doces, 123 - Jardins</p>
            <p className="text-chocolate/60">Ter a Dom, 12h às 22h</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
