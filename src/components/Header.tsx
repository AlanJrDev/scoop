import { useState } from 'react';

export function Header() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12 md:py-8 flex items-center justify-between transition-colors duration-300 ${
        isHovered ? 'bg-pastel-green shadow-sm' : 'bg-transparent'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Brand */}
      <div className="flex-1">
        <span className="font-display font-extrabold text-chocolate text-xl md:text-2xl tracking-tighter cursor-pointer">
          The Sweet Scoop.
        </span>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-8">
        <a href="#sabores" className="font-body font-bold text-sm tracking-widest text-chocolate hover:text-pink-bubblegum transition-colors uppercase">
          Sabores
        </a>
        <a href="#historia" className="font-body font-bold text-sm tracking-widest text-chocolate hover:text-pink-bubblegum transition-colors uppercase">
          Nossa História
        </a>
      </nav>

      {/* Hamburger */}
      <div className="flex-1 flex justify-end md:hidden">
        <button className="w-10 h-10 rounded-full bg-glass-bg backdrop-blur-md border border-glass-border flex flex-col items-center justify-center gap-1.5 hover:bg-white/50 transition-colors">
          <span className="w-5 h-0.5 bg-chocolate rounded-full"></span>
          <span className="w-5 h-0.5 bg-chocolate rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
