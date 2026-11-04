"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/** Perguntas que o turista faz pra IA do celular, nos três idiomas da temporada. */
const PERGUNTAS = [
  { idioma: "PT", texto: "restaurante bom aberto agora perto de mim" },
  { idioma: "ES", texto: "¿dónde comer rico cerca de mí?" },
  { idioma: "EN", texto: "best place to eat near me" },
];
const RESPOSTAS = [72, 58, 66];

type Fase = "digitando" | "pensando" | "respondendo";

/**
 * Cena genérica de um chat de IA respondendo (sem marca nem interface copiada).
 * As respostas são barras cinzas: mostra o formato, não inventa nomes.
 */
export function IaAoVivo() {
  const reduce = useReducedMotion();
  const caixa = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);
  const [i, setI] = useState(0);
  const [letras, setLetras] = useState(0);
  const [fase, setFase] = useState<Fase>("digitando");
  const atual = PERGUNTAS[i];

  // só anima quando a cena está na tela
  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce) {
      setLetras(atual.texto.length);
      setFase("respondendo");
      return;
    }
    if (!visivel) return;
    let t: ReturnType<typeof setTimeout>;
    if (fase === "digitando") {
      t = letras < atual.texto.length ? setTimeout(() => setLetras((n) => n + 1), 42) : setTimeout(() => setFase("pensando"), 250);
    } else if (fase === "pensando") {
      t = setTimeout(() => setFase("respondendo"), 800);
    } else {
      t = setTimeout(() => {
        setI((n) => (n + 1) % PERGUNTAS.length);
        setLetras(0);
        setFase("digitando");
      }, 3400);
    }
    return () => clearTimeout(t);
  }, [reduce, visivel, fase, letras, atual.texto.length]);

  return (
    <div ref={caixa} className="w-full max-w-[460px] rounded-[var(--radius-card)] border border-mata-700 bg-mata-950 p-4 sm:p-5" aria-hidden="true">
      <div className="flex items-center justify-between font-mono text-[11px] font-bold tracking-[0.14em] text-nevoa">
        <span>O TURISTA PERGUNTA PRA IA</span>
        <span className="flex gap-1">
          {PERGUNTAS.map((p, k) => (
            <span key={p.idioma} className={`rounded px-1.5 py-0.5 ${k === i ? "bg-ambar text-mata-950" : "text-nevoa-escura"}`}>
              {p.idioma}
            </span>
          ))}
        </span>
      </div>

      {/* pergunta digitando */}
      <div className="mt-3 ml-auto w-fit max-w-[92%] rounded-2xl rounded-br-md bg-areia-100 px-4 py-2.5 text-[16px] font-semibold text-tinta">
        {atual.texto.slice(0, letras)}
        {fase === "digitando" && !reduce && <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-brasa" />}
      </div>

      {/* resposta */}
      <div className="mt-3 min-h-[270px] rounded-2xl rounded-bl-md bg-mata-800 p-3.5">
        {fase === "pensando" && (
          <p className="flex gap-1.5 py-2" aria-label="pensando">
            {[0, 1, 2].map((k) => (
              <span key={k} className="h-2 w-2 animate-bounce rounded-full bg-nevoa" style={{ animationDelay: `${k * 0.15}s` }} />
            ))}
          </p>
        )}
        {fase === "respondendo" && (
          <ol className="flex flex-col gap-2">
            {RESPOSTAS.map((w, k) => (
              <li key={`${i}-${k}`} className="pt-hud-linha flex items-center gap-3 rounded-xl bg-mata-900 px-3 py-2.5" style={{ "--d": `${k * 0.18}s` } as React.CSSProperties}>
                <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-ambar text-[13px] font-black text-mata-950">{k + 1}</span>
                <span className="flex flex-1 flex-col gap-1.5">
                  <span className="h-2.5 rounded-full bg-areia-100/50" style={{ width: `${w}%` }} />
                  <span className="text-[11px] tracking-[2px] text-ambar">★★★★★</span>
                </span>
              </li>
            ))}
            <li className="pt-hud-linha flex items-center gap-3 rounded-xl border-2 border-dashed border-brasa/70 px-3 py-2" style={{ "--d": "0.62s" } as React.CSSProperties}>
              <span className="grid h-7 w-7 flex-none place-items-center rounded-full border-2 border-brasa/70 text-[13px] font-black text-brasa-clara">?</span>
              <span className="text-[14px] font-extrabold text-brasa-clara">Teu negócio não apareceu</span>
            </li>
          </ol>
        )}
      </div>
    </div>
  );
}
