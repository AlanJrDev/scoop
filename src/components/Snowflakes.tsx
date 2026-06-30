import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation: number;
  rotSpeed: number;
}

const TWO_PI = Math.PI * 2;
const DEG60 = Math.PI / 3;

function drawBranch(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawSnowflake(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number, rotation: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  const s = size;
  const lineW = Math.max(1.2, s * 0.14);
  const color = `rgba(215,235,255,${opacity})`;

  // ── Strong glow pass (shadow layer) ──────────────────────────────────
  ctx.shadowColor = `rgba(130,200,255,${opacity * 0.85})`;
  ctx.shadowBlur = s * 6;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = s * 0.3;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineW;
  ctx.lineCap = 'round';

  // Center hexagon
  const hexR = s * 0.14;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TWO_PI - Math.PI / 6;
    const px = Math.cos(a) * hexR;
    const py = Math.sin(a) * hexR;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();

  // 12 arms: 6 main + 6 secondary (between mains)
  for (let arm = 0; arm < 12; arm++) {
    const isMain = arm % 2 === 0;
    const angle = arm * (Math.PI / 6);
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const stemLen = isMain ? s : s * 0.5;
    const bLen = isMain ? s * 0.45 : s * 0.22;
    const bAng = Math.PI / 5.5;
    const midP = isMain ? 0.55 : 0.5;
    const tipP = isMain ? 0.85 : 0.8;

    // Main stem
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(cosA * stemLen, sinA * stemLen);
    ctx.stroke();

    if (!isMain) continue;

    // Inner branch left
    const ib1 = angle + bAng * 0.8;
    drawBranch(ctx,
      cosA * stemLen * 0.35, sinA * stemLen * 0.35,
      cosA * stemLen * 0.35 + Math.cos(ib1) * bLen * 0.7,
      sinA * stemLen * 0.35 + Math.sin(ib1) * bLen * 0.7,
    );

    // Inner branch right
    const ib2 = angle - bAng * 0.8;
    drawBranch(ctx,
      cosA * stemLen * 0.35, sinA * stemLen * 0.35,
      cosA * stemLen * 0.35 + Math.cos(ib2) * bLen * 0.7,
      sinA * stemLen * 0.35 + Math.sin(ib2) * bLen * 0.7,
    );

    // Mid branch left
    const mb1 = angle + bAng;
    drawBranch(ctx,
      cosA * stemLen * midP, sinA * stemLen * midP,
      cosA * stemLen * midP + Math.cos(mb1) * bLen,
      sinA * stemLen * midP + Math.sin(mb1) * bLen,
    );

    // Mid branch right
    const mb2 = angle - bAng;
    drawBranch(ctx,
      cosA * stemLen * midP, sinA * stemLen * midP,
      cosA * stemLen * midP + Math.cos(mb2) * bLen,
      sinA * stemLen * midP + Math.sin(mb2) * bLen,
    );

    // Outer branch left (finer)
    const ob1 = angle + bAng * 1.3;
    drawBranch(ctx,
      cosA * stemLen * tipP, sinA * stemLen * tipP,
      cosA * stemLen * tipP + Math.cos(ob1) * bLen * 0.65,
      sinA * stemLen * tipP + Math.sin(ob1) * bLen * 0.65,
    );

    // Outer branch right (finer)
    const ob2 = angle - bAng * 1.3;
    drawBranch(ctx,
      cosA * stemLen * tipP, sinA * stemLen * tipP,
      cosA * stemLen * tipP + Math.cos(ob2) * bLen * 0.65,
      sinA * stemLen * tipP + Math.sin(ob2) * bLen * 0.65,
    );

    // Diamond tip
    const tipX = cosA * stemLen;
    const tipY = sinA * stemLen;
    const tipSize = s * 0.06;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY - tipSize);
    ctx.lineTo(tipX + tipSize * 0.6, tipY);
    ctx.lineTo(tipX, tipY + tipSize);
    ctx.lineTo(tipX - tipSize * 0.6, tipY);
    ctx.closePath();
    ctx.stroke();
  }

  // ── Second pass: crisp lines on top (no shadow offset, smaller blur) ─
  ctx.shadowBlur = s * 2.5;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = s * 0.12;
  ctx.shadowColor = `rgba(100,180,255,${opacity * 0.7})`;
  ctx.lineWidth = lineW * 0.7;

  // Re-draw hexagon center
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TWO_PI - Math.PI / 6;
    const px = Math.cos(a) * hexR;
    const py = Math.sin(a) * hexR;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();

  // Re-draw 6 main stems only (crisp overlay)
  for (let arm = 0; arm < 6; arm++) {
    const angle = arm * DEG60;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(cosA * s, sinA * s);
    ctx.stroke();
  }

  // Center core glow
  ctx.shadowBlur = s * 9;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowColor = `rgba(150,210,255,${opacity * 0.9})`;
  ctx.beginPath();
  ctx.arc(0, 0, s * 0.1, 0, TWO_PI);
  ctx.fillStyle = `rgba(230,245,255,${opacity * 0.95})`;
  ctx.fill();

  ctx.restore();
}

export function Snowflakes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Particle[] = [];
    const count = 30;

    for (let i = 0; i < count; i++) {
      const size = Math.random() * 12 + 6;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        speedY: Math.random() * 0.4 + 0.15,
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.4 + 0.35,
        rotation: Math.random() * TWO_PI,
        rotSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.008) * 0.3;
        p.rotation += p.rotSpeed;

        if (p.y > canvas.height + p.size) {
          p.y = -p.size;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width + p.size) p.x = -p.size;
        if (p.x < -p.size) p.x = canvas.width + p.size;

        drawSnowflake(ctx, p.x, p.y, p.size, p.opacity, p.rotation);
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
}
