import React, { useEffect, useRef } from 'react';

// Cursor em dois círculos, só em telas com mouse: o anel segue o mouse e, dentro dele, uma bolinha
// sólida com inércia, que fica para trás, bate suavemente na parede do anel e volta. No celular não aparece.
export const CursorJornada: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const bolinha = useRef<HTMLDivElement>(null);
  const rotulo = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const el = ref.current;
    const dot = bolinha.current;
    if (!el || !dot) return;

    let x = -100, y = -100, cx = -100, cy = -100;     // alvo (mouse) e anel (com atraso)
    let px = -100, py = -100, vx = 0, vy = 0;          // bolinha
    let grande = false, raf = 0;

    const mover = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      el.style.opacity = '1';
      dot.style.opacity = '1';
      const alvo = (e.target as HTMLElement | null)?.closest('a,button,[data-cursor]');
      grande = !!alvo;
      el.classList.toggle('jr-cursor--grande', grande);
      const rot = (e.target as HTMLElement | null)?.closest('[data-rotulo]')?.getAttribute('data-rotulo') || '';
      if (rotulo.current) rotulo.current.textContent = rot;
    };
    const sair = () => { el.style.opacity = '0'; dot.style.opacity = '0'; };

    const loop = () => {
      // anel: persegue o mouse
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      el.style.transform = `translate3d(${cx}px,${cy}px,0)`;

      // bolinha: é puxada de leve para o centro do anel e tem inércia, então bate na parede quando o anel se move
      vx += (cx - px) * 0.014; vy += (cy - py) * 0.014;
      vx *= 0.93; vy *= 0.93;
      px += vx; py += vy;
      const limite = (grande ? 32 : 18) - 5;           // raio do anel menos o raio da bolinha
      const dx = px - cx, dy = py - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > limite && dist > 0) {
        const nx = dx / dist, ny = dy / dist;
        px = cx + nx * limite; py = cy + ny * limite;
        const vn = vx * nx + vy * ny;
        if (vn > 0) { vx -= 1.65 * vn * nx; vy -= 1.65 * vn * ny; }   // quica, perdendo um pouco de força
      }
      dot.style.transform = `translate3d(${px}px,${py}px,0)`;
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

  return (
    <>
      <div ref={ref} className="jr-cursor" aria-hidden="true"><span ref={rotulo} /></div>
      <div ref={bolinha} className="jr-cursor-bolinha" aria-hidden="true" />
    </>
  );
};
