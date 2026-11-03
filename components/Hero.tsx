"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { lerParametros } from "@/lib/params";
import { buscaDe } from "@/lib/quiz";
import { Magnetic } from "./Magnetic";
import { WHATS_DIRETO } from "@/lib/config";
import { MapaVizinho } from "./MapaVizinho";

const LINHA_1 = "Teu cliente te procurou hoje…".split(" ");

export function Hero() {
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;
  const [busca, setBusca] = useState(buscaDe(null));

  // anúncio com ?tipo=acai mostra "açaí perto de mim" no mapa
  useEffect(() => {
    const { tipo } = lerParametros(window.location.search);
    if (tipo) setBusca(buscaDe(tipo));
  }, []);

  return (
    <section id="hero" className="vinheta relative overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <header className="relative z-10 flex items-center justify-between gap-4 py-5">
          <p className="text-[15px] font-extrabold tracking-[-0.01em] text-areia-100">
            Pronto pra Temporada <span className="hidden font-semibold text-nevoa sm:inline">Floripa</span>
          </p>
          <a
            href={WHATS_DIRETO}
            target="_blank"
            rel="noopener"
            data-origem="topo"
            className="inline-flex min-h-11 items-center text-[15px] font-bold text-ambar underline-offset-4 hover:underline"
          >
            <span className="hidden sm:inline">Falar no&nbsp;</span>WhatsApp
          </a>
        </header>

        <div className="relative z-10 grid gap-10 pb-0 pt-6 lg:pointer-events-none lg:min-h-[calc(100svh-84px)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] lg:items-center lg:pb-24 lg:pt-0">
          <div className="flex flex-col items-start gap-7 lg:pointer-events-auto lg:pr-6">
            <h1 className="display flex flex-col gap-2">
              <span className="text-[clamp(2.1rem,5.6vw,4.4rem)] text-areia-100 lg:text-[clamp(2.4rem,3.5vw,3.5rem)]">
                {LINHA_1.map((w, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={reduce ? false : { opacity: 0, y: "0.35em" }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.07, duration: 0.5, ease }}
                  >
                    {w}
                    {i < LINHA_1.length - 1 ? " " : ""}
                  </motion.span>
                ))}
              </span>
              <motion.span
                className="block text-[clamp(3rem,8.4vw,6.9rem)] text-brasa lg:text-[clamp(3.4rem,5.5vw,5.5rem)]"
                initial={reduce ? false : { opacity: 0, scale: 1.08, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ delay: 0.62, duration: 0.42, ease }}
                style={{ transformOrigin: "left center" }}
              >
                e achou o vizinho.
              </motion.span>
            </h1>

            <motion.div
              className="flex flex-col items-start gap-7"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <p className="max-w-[34ch] text-[19px] leading-[1.5] text-nevoa sm:text-[21px]">
                Faz o teste de 10 segundos e descobre onde o teu negócio tá vazando cliente antes da temporada.
              </p>
              <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
                <Magnetic>
                <a
                  href="#teste"
                  className="group inline-flex min-h-[60px] items-center gap-3 rounded-full bg-brasa px-8 text-[19px] font-extrabold text-creme shadow-[0_12px_32px_rgba(220,76,43,.35)] transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0"
                >
                  Fazer o teste
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-y-0.5">
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </a>
                </Magnetic>
                <a href={WHATS_DIRETO} target="_blank" rel="noopener" data-origem="hero" className="inline-flex min-h-11 items-center text-[17px] font-bold text-areia-100 underline decoration-mata-700 decoration-2 underline-offset-[6px] hover:decoration-ambar">
                  Prefiro falar no WhatsApp
                </a>
              </div>
              <p className="text-[14px] font-semibold text-nevoa">Grátis, sem cadastro. Nada fica salvo.</p>
            </motion.div>
          </div>

          {/* mobile: o mapa vem logo abaixo, sangrando nas bordas */}
          <MapaVizinho busca={busca} className="-mx-5 aspect-[4/5] sm:-mx-8 sm:aspect-[5/4] lg:hidden" />
        </div>
      </div>

      {/* desktop: o mapa ocupa a metade direita e se funde no fundo */}
      <div
        className="absolute inset-y-0 right-0 hidden w-[50%] lg:block"
        style={{ maskImage: "linear-gradient(to right, transparent 0%, #000 22%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 22%)" }}
      >
        <MapaVizinho busca={busca} className="h-full w-full" />
      </div>
    </section>
  );
}
