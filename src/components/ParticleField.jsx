import { useEffect, useRef } from 'react';

// Floating motes that drift with the sector theme and scatter from the pointer.
export default function ParticleField({ particle, density = 70 }) {
  const canvasRef = useRef(null);
  const particleRef = useRef(particle);
  particleRef.current = particle;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let frame = 0;
    const pointer = { x: -9999, y: -9999 };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const spawn = (anywhere) => {
      const [min, max] = particleRef.current.size;
      return {
        x: Math.random() * width,
        y: anywhere ? Math.random() * height : particleRef.current.rise < 0 ? height + 10 : -10,
        r: min + Math.random() * (max - min),
        speed: 0.4 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
        vx: 0,
        vy: 0,
      };
    };
    const motes = Array.from({ length: density }, () => spawn(true));

    const draw = (time) => {
      const { color, drift, rise } = particleRef.current;
      ctx.clearRect(0, 0, width, height);
      for (const m of motes) {
        const dx = m.x - pointer.x;
        const dy = m.y - pointer.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 140 * 140) {
          const force = (1 - Math.sqrt(dist2) / 140) * 0.6;
          m.vx += (dx / 140) * force;
          m.vy += (dy / 140) * force;
        }
        m.vx *= 0.94;
        m.vy *= 0.94;
        m.x += drift * m.speed + Math.sin(time / 1400 + m.phase) * 0.25 + m.vx;
        m.y += rise * m.speed + m.vy;
        if (m.y < -20 || m.y > height + 20 || m.x < -20 || m.x > width + 20) Object.assign(m, spawn(false));

        const alpha = 0.35 + Math.sin(time / 600 + m.phase) * 0.25;
        const glow = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 4);
        glow.addColorStop(0, `rgba(${color}, ${alpha})`);
        glow.addColorStop(1, `rgba(${color}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduced) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    const onMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
    };
  }, [density]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} aria-hidden="true" />;
}
