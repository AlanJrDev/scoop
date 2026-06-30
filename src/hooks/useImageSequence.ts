import { useEffect, useRef, RefObject } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ImageSequenceConfig {
  frameCount: number;
  framePath: (i: number) => string;
  canvasRef: RefObject<HTMLCanvasElement>;
  containerRef: RefObject<HTMLElement>;
  scrollTriggerStart: string;
  scrollTriggerEnd: string;
  scrub: boolean | number;
  onProgress?: (progress: number) => void;
}

export function useImageSequence({
  frameCount,
  framePath,
  canvasRef,
  containerRef,
  scrollTriggerStart,
  scrollTriggerEnd,
  scrub,
  onProgress
}: ImageSequenceConfig) {
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    contextRef.current = canvas.getContext('2d');
    const ctx = contextRef.current;
    if (!ctx) return;

    let mounted = true;
    const lastFrameRef = { current: 0 };

    // Responsive Canvas Resizing with Object-Fit Cover equivalent
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        // Adjust for device pixel ratio
        const dpr = window.devicePixelRatio || 1;
        canvas.width = parent.clientWidth * dpr;
        canvas.height = parent.clientHeight * dpr;
        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `${parent.clientHeight}px`;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        
        // Redraw current frame after resize
        drawFrame(lastFrameRef.current);
      }
    };

    const drawFrame = (index: number) => {
      if (!ctx || !imagesRef.current[index]) return;
      const img = imagesRef.current[index];
      
      // Make sure image is loaded
      if (!img.complete || img.naturalWidth === 0) return;

      const parent = canvas.parentElement;
      if (!parent) return;

      const canvasWidth = parent.clientWidth;
      const canvasHeight = parent.clientHeight;
      const imgWidth = img.width;
      const imgHeight = img.height;

      // Calculate object-fit: cover equivalent
      const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
      const x = (canvasWidth / 2) - (imgWidth / 2) * scale;
      const y = (canvasHeight / 2) - (imgHeight / 2) * scale;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, x, y, imgWidth * scale, imgHeight * scale);
    };

    // Preload images
    const loadImages = () => {
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = framePath(i);
        
        // Priority hint for first 20 frames
        if (i < 20) {
          (img as any).fetchPriority = 'high';
        }
        
        // When first frame loads, draw it
        if (i === 0) {
          img.onload = () => { if (mounted) drawFrame(0); };
        }
        
        imagesRef.current.push(img);
      }
    };

    loadImages();
    window.addEventListener('resize', resizeCanvas);
    
    // Initial resize to setup canvas dimensions before drawing
    // Small timeout to ensure DOM is ready
    setTimeout(resizeCanvas, 0);

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: scrollTriggerStart,
      end: scrollTriggerEnd,
      pin: true,
      scrub: scrub,
      onUpdate: (self) => {
        const frameIndex = Math.round(self.progress * (frameCount - 1));
        if (frameIndex !== lastFrameRef.current) {
          drawFrame(frameIndex);
          lastFrameRef.current = frameIndex;
        }
        onProgress?.(self.progress);
      }
    });

    return () => {
      mounted = false;
      window.removeEventListener('resize', resizeCanvas);
      trigger.kill();
    };
  }, [frameCount, framePath, canvasRef, containerRef, scrollTriggerStart, scrollTriggerEnd, scrub, onProgress]);
}
