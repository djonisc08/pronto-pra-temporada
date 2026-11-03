"use client";

import { useEffect, useState } from "react";
import { WHATS_DIRETO } from "@/lib/config";
import { ChatIcon } from "./icons";

/**
 * Botão fixo de WhatsApp, só no celular. Aparece depois do hero e some quando
 * o teste ou o CTA final estão na tela, para não duplicar o convite.
 */
export function WhatsFloat() {
  const [passouHero, setPassouHero] = useState(false);
  const [ctaVisivel, setCtaVisivel] = useState(false);
  const [noTeste, setNoTeste] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const cta = document.getElementById("cta-final");
    const teste = document.getElementById("teste");
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) setPassouHero(!e.isIntersecting);
        if (e.target === cta) setCtaVisivel(e.isIntersecting);
        if (e.target === teste) setNoTeste(e.isIntersecting);
      }
    });
    if (hero) io.observe(hero);
    if (cta) io.observe(cta);
    if (teste) io.observe(teste);
    return () => {
      io.disconnect();
    };
  }, []);

  const visivel = passouHero && !ctaVisivel && !noTeste;

  return (
    <a
      href={WHATS_DIRETO}
      target="_blank"
      rel="noopener"
      data-origem="flutuante"
      aria-hidden={!visivel}
      tabIndex={visivel ? 0 : -1}
      className={`fixed inset-x-4 bottom-[calc(16px+env(safe-area-inset-bottom))] z-50 flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-brasa text-[19px] font-extrabold text-creme shadow-[0_10px_30px_rgba(0,0,0,.45)] transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none lg:hidden ${
        visivel ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"
      }`}
    >
      <ChatIcon />
      Me chama no Whats
    </a>
  );
}
