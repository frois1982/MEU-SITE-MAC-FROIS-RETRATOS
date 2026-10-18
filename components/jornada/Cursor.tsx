import React, { useEffect, useRef } from 'react';

// Cursor circular só em telas com mouse. No celular não aparece e não custa nada.
export const CursorJornada: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const rotulo = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const el = ref.current;
    if (!el) return;
    let x = -100, y = -100, cx = -100, cy = -100, raf = 0;
    const mover = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      el.style.opacity = '1';
      const alvo = (e.target as HTMLElement | null)?.closest('a,button,[data-cursor]');
      el.classList.toggle('jr-cursor--grande', !!alvo);
      const rot = (e.target as HTMLElement | null)?.closest('[data-rotulo]')?.getAttribute('data-rotulo') || '';
      if (rotulo.current) rotulo.current.textContent = rot;
    };
    const sair = () => { el.style.opacity = '0'; };
    const loop = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      el.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', mover, { passive: true });
    document.addEventListener('pointerleave', sair);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', mover);
      document.removeEventListener('pointerleave', sair);
    };
  }, []);

  return <div ref={ref} className="jr-cursor" aria-hidden="true"><span ref={rotulo} /></div>;
};
