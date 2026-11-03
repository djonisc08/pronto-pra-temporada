"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

/** Pins dos vizinhos: acendem em sequência. Coordenadas no viewBox 600×640. */
const VIZINHOS = [
  { x: 214, y: 236, destaque: true },
  { x: 344, y: 196 },
  { x: 132, y: 352 },
  { x: 372, y: 298 },
  { x: 188, y: 482 },
  { x: 96, y: 210 },
  { x: 432, y: 556 },
];
const TUA_CASA = { x: 318, y: 388 };
const PIN = "M0 0 C -9 -13 -16 -21 -16 -31 A 16 16 0 1 1 16 -31 C 16 -21 9 -13 0 0 Z";
const pct = (v: number, total: number) => `${(v / total) * 100}%`;

export function MapaVizinho({ className = "", busca = "restaurante perto de mim" }: { className?: string; busca?: string }) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const luz = useRef<SVGRadialGradientElement>(null);
  const [typed, setTyped] = useState("");
  const [lanterna, setLanterna] = useState(false);
  const uid = useId().replace(/:/g, "");

  // Digitação da busca
  useEffect(() => {
    if (reduce) {
      setTyped(busca);
      return;
    }
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      i += 1;
      setTyped(busca.slice(0, i));
      if (i < busca.length) timer = setTimeout(tick, 38);
    };
    timer = setTimeout(tick, 350);
    return () => clearTimeout(timer);
  }, [reduce, busca]);

  // Lanterna: só com mouse de verdade e sem redução de movimento
  useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const on = () => setLanterna(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [reduce]);

  // A luz segue o mouse dentro do mapa; parada, ela fica sobre o teu negócio
  useEffect(() => {
    const el = box.current;
    const g = luz.current;
    if (!el || !g || !lanterna) return;
    const area = el.parentElement ?? el;
    let raf = 0;
    const set = (x: number, y: number) => {
      g.setAttribute("cx", String(x));
      g.setAttribute("cy", String(y));
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => set(((e.clientX - r.left) / r.width) * 600, ((e.clientY - r.top) / r.height) * 640));
    };
    const leave = () => set(TUA_CASA.x, TUA_CASA.y - 20);
    area.addEventListener("pointermove", move);
    area.addEventListener("pointerleave", leave);
    return () => {
      area.removeEventListener("pointermove", move);
      area.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, [lanterna]);

  const base = 1.25; // segundos: quando os pins começam a acender
  const step = 0.16;
  const fimVizinhos = base + VIZINHOS.length * step;

  return (
    <div
      className={`relative select-none overflow-hidden ${className}`}
      style={{ containerType: "size" }}
      role="img"
      aria-label={`Mapa de uma busca por ${busca}: os pins dos vizinhos acendem e o do teu negócio fica apagado.`}
    >
      {/* caixa na proporção do desenho, cobrindo a área (como object-fit: cover) */}
      <div
        ref={box}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ aspectRatio: "600 / 640", width: "max(100cqw, calc(100cqh * 0.9375))" }}
      >
        <svg viewBox="0 0 600 640" className="h-full w-full" aria-hidden="true">
          <defs>
            <radialGradient id={`luz-${uid}`} ref={luz} gradientUnits="userSpaceOnUse" cx={TUA_CASA.x} cy={TUA_CASA.y - 20} r="190">
              <stop offset="0" stopColor="#000" />
              <stop offset=".55" stopColor="#555" />
              <stop offset="1" stopColor="#fff" />
            </radialGradient>
            <mask id={`mascara-${uid}`}>
              <rect width="600" height="640" fill={`url(#luz-${uid})`} />
            </mask>
          </defs>

          <rect width="600" height="640" fill="#123128" />
          {/* mar e faixa de areia */}
          <path d="M470 0 C 440 140, 520 230, 490 360 C 462 480, 540 560, 520 640 L 600 640 L 600 0 Z" fill="#04110e" />
          <path d="M470 0 C 440 140, 520 230, 490 360 C 462 480, 540 560, 520 640" fill="none" stroke="#e4ddd0" strokeOpacity=".28" strokeWidth="9" />
          {/* ruas */}
          <g stroke="#1f4a3e" strokeLinecap="round" fill="none">
            <path d="M-20 120 L 470 96" strokeWidth="14" />
            <path d="M-20 270 L 488 300" strokeWidth="10" />
            <path d="M-20 400 L 470 380" strokeWidth="10" />
            <path d="M-20 540 L 500 520" strokeWidth="14" />
            <path d="M70 -20 L 110 660" strokeWidth="10" />
            <path d="M190 -20 L 176 660" strokeWidth="8" />
            <path d="M290 -20 L 300 660" strokeWidth="12" />
            <path d="M400 -20 L 380 660" strokeWidth="8" />
          </g>
          <g fill="#183d33">
            <rect x="120" y="140" width="50" height="104" rx="6" />
            <rect x="208" y="308" width="70" height="56" rx="6" />
            <rect x="320" y="120" width="56" height="150" rx="6" />
            <rect x="18" y="420" width="70" height="96" rx="6" />
            <rect x="412" y="410" width="44" height="96" rx="6" />
          </g>

          {/* lanterna: escurece só o chão; os pins ficam por cima, acesos */}
          {lanterna && <rect width="600" height="640" fill="#04110e" fillOpacity=".62" mask={`url(#mascara-${uid})`} />}

          {/* vizinhos acendendo */}
          {VIZINHOS.map((p, i) => {
            const delay = base + i * step;
            const cor = p.destaque ? "#dc4c2b" : "#d99042";
            return (
              <g key={i}>
                {p.destaque && !reduce && (
                  <motion.circle
                    cx={p.x}
                    cy={p.y - 34}
                    r={40}
                    fill="#dc4c2b"
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: [0, 0.4, 0], scale: [0.4, 1.3, 1.7] }}
                    transition={{ delay: delay + 0.2, duration: 2.2, repeat: Infinity, repeatDelay: 0.8, ease: "easeOut" }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  />
                )}
                <motion.g
                  initial={reduce ? false : { opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <path transform={`translate(${p.x} ${p.y}) scale(${p.destaque ? 1.25 : 0.9})`} d={PIN} fill={cor} />
                  <circle cx={p.x} cy={p.y - (p.destaque ? 39 : 28)} r={p.destaque ? 7 : 5} fill="#fff6ec" />
                </motion.g>
              </g>
            );
          })}

          {/* teu negócio: pisca e apaga */}
          <motion.g
            initial={false}
            animate={reduce ? { opacity: 1 } : { opacity: [1, 0.2, 0.9, 0.15, 0.7, 1] }}
            transition={{ delay: fimVizinhos + 0.1, duration: 0.9, times: [0, 0.2, 0.35, 0.55, 0.75, 1] }}
          >
            <motion.path
              transform={`translate(${TUA_CASA.x} ${TUA_CASA.y}) scale(1.05)`}
              d={PIN}
              initial={reduce ? false : { fill: "#f2ede3" }}
              animate={{ fill: "#4d6a61" }}
              transition={{ delay: fimVizinhos + 0.9, duration: 0.3 }}
            />
            <circle cx={TUA_CASA.x} cy={TUA_CASA.y - 32} r="5.5" fill="#9aa49f" />
          </motion.g>
        </svg>

        {/* rótulos */}
        <motion.div
          className="absolute"
          style={{ left: pct(VIZINHOS[0].x, 600), top: pct(VIZINHOS[0].y - 118, 640) }}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: base + 0.25, duration: 0.4 }}
        >
          <div className="-translate-x-1/2 whitespace-nowrap rounded-xl bg-areia-100 px-3.5 py-2 text-tinta shadow-[0_12px_30px_rgba(0,0,0,.4)]">
            <p className="text-[14px] font-extrabold leading-tight">Vizinho</p>
            <p className="text-[12px] font-bold leading-tight text-ambar-escuro">Aberto agora, com fotos</p>
          </div>
        </motion.div>
        <motion.div
          className="absolute"
          style={{ left: pct(TUA_CASA.x, 600), top: pct(TUA_CASA.y + 12, 640) }}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: fimVizinhos + 1.1, duration: 0.4 }}
        >
          <div className="-translate-x-1/2 whitespace-nowrap rounded-xl border border-mata-700 bg-mata-950/90 px-3.5 py-2">
            <p className="text-[14px] font-extrabold leading-tight text-areia-100">Teu negócio</p>
            <p className="text-[12px] font-semibold leading-tight text-nevoa">sem foto, sem horário</p>
          </div>
        </motion.div>
      </div>

      {/* busca */}
      <div className="absolute left-1/2 top-4 w-[84%] max-w-[420px] -translate-x-1/2 lg:top-[9%]">
        <div className="flex items-center gap-3 rounded-full bg-areia-100 px-5 py-3.5 text-tinta shadow-[0_18px_40px_rgba(0,0,0,.45)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5d6661" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="M15.5 15.5 21 21" />
          </svg>
          <span className="truncate text-[15px] font-semibold sm:text-base">
            {typed}
            {!reduce && <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] animate-pulse bg-brasa" />}
          </span>
        </div>
      </div>
    </div>
  );
}
