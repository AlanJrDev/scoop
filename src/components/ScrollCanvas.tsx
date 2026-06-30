import { useRef } from 'react';
import { useImageSequence } from '../hooks/useImageSequence';

interface ScrollCanvasProps {
  frameCount: number;
  framePath: (i: number) => string;
  scrollTriggerStart?: string;
  scrollTriggerEnd?: string;
  scrub?: boolean | number;
  children: React.ReactNode;
  className?: string;
  canvasHeight?: string;
  onProgress?: (progress: number) => void;
}

export function ScrollCanvas({
  frameCount,
  framePath,
  scrollTriggerStart = "top top",
  scrollTriggerEnd = "+1000",
  scrub = 0.5,
  children,
  className = "",
  canvasHeight = "1000px",
  onProgress
}: ScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useImageSequence({
    frameCount,
    framePath,
    canvasRef,
    containerRef,
    scrollTriggerStart,
    scrollTriggerEnd,
    scrub,
    onProgress,
  });

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{ height: canvasHeight }}
    >
      {/* Pinned Canvas */}
      <div className="absolute top-0 left-0 w-full h-screen overflow-hidden -z-10 bg-chocolate">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />
      </div>

      {/* Pinned Text Overlays */}
      {children && (
        <div className="absolute top-0 left-0 w-full h-screen overflow-visible z-10 pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
}
