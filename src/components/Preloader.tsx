import { motion } from 'framer-motion';

export function Preloader() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-chocolate"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {/* Logo / Title */}
      <motion.h1
        className="font-display font-extrabold text-5xl md:text-7xl text-white tracking-tight mb-8"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
      >
        The Sweet Scoop
      </motion.h1>

      {/* Loading bar */}
      <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-pink-bubblegum rounded-full"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        />
      </div>

      <motion.p
        className="font-body text-white/50 text-sm mt-4 tracking-widest uppercase"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        Carregando...
      </motion.p>
    </motion.div>
  );
}
