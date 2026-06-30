import { useRef } from 'react';
import { motion } from 'framer-motion';

const FLAVORS = [
  {
    id: 1,
    name: 'Morango Silvestre',
    bg: '#F6B8C6',
    border: '#4A2B18',
    textColor: '#4A2B18',
    imageSrc: '/inicial/ezgif-frame-001.jpg',
    desc: 'Morangos frescos colhidos no ponto perfeito de doçura.',
  },
  {
    id: 2,
    name: 'Chocolate Belga',
    bg: '#F6B8C6',
    border: '#4A2B18',
    textColor: '#4A2B18',
    imageSrc: '/inicial/ezgif-frame-295.jpg',
    desc: 'Intenso, cremoso e com pedaços de puro chocolate belga.',
  },
  {
    id: 3,
    name: 'Baunilha Clássica',
    bg: '#F6B8C6',
    border: '#4A2B18',
    textColor: '#4A2B18',
    imageSrc: '/inicial/ezgif-frame-361.jpg',
    desc: 'Feito com favas de baunilha de Madagascar.',
  },
  {
    id: 4,
    name: 'Menta com Flocos',
    bg: '#F6B8C6',
    border: '#4A2B18',
    textColor: '#4A2B18',
    imageSrc: '/inicial/ezgif-frame-120.jpg',
    desc: 'O frescor da menta com a crocância de flocos amargos.',
  },
];

export function ClassicsShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="sabores"
      ref={containerRef}
      className="relative bg-chocolate py-32 z-10 rounded-t-[3rem] shadow-2xl"
      style={{ marginTop: '-1px' }}
    >
      {/* Section Header */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 mb-24">
        <motion.h2
          className="font-display font-extrabold text-4xl md:text-6xl text-white max-w-lg leading-tight mb-6"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Nossos Sabores Clássicos
        </motion.h2>
        <motion.p
          className="font-body text-white/80 max-w-md text-lg"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
        >
          Sabores que encantam e criam memórias inesquecíveis.<br className="hidden sm:block" /> Cada colherada revela ingredientes selecionados de todas as partes do mundo.
        </motion.p>
      </div>

      {/* Stacked Cards */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 pb-[10vh]">
        {FLAVORS.map((flavor, index) => {
          const topOffset = `calc(12vh + ${index * 24}px)`;

          return (
            <motion.div
              key={flavor.id}
              className="sticky w-full rounded-[2rem] px-8 py-10 md:px-8 md:py-12 flex flex-col md:flex-row items-center gap-8"
              style={{
                top: topOffset,
                marginBottom: '35vh',
                backgroundColor: flavor.bg,
                border: `4px solid ${flavor.border}`,
                boxShadow: `
                  0 0 0 1px ${flavor.border}44,
                  0 0 24px ${flavor.border}55,
                  0 20px 60px rgba(0,0,0,0.12)
                `,
              }}
              initial={{ opacity: 0, y: 120 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {/* Image */}
              <div
                className="w-full md:w-1/2 h-60 md:h-72 rounded-2xl overflow-hidden"
                style={{ boxShadow: `inset 0 0 0 2px ${flavor.border}33` }}
              >
                <img
                  src={flavor.imageSrc}
                  alt={`Sorvete sabor ${flavor.name}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Text */}
              <div className="w-full md:w-1/2 text-left">
                <h3
                  className="font-display font-bold text-3xl md:text-4xl mb-3"
                  style={{ color: flavor.textColor }}
                >
                  {flavor.name}
                </h3>
                <p className="font-body text-base" style={{ color: `${flavor.textColor}cc` }}>
                  {flavor.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
