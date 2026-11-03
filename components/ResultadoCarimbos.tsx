"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import { tocar, vibrar } from "@/lib/feedback";

const SLOTS = [
  { top: "34%", left: "6%", rot: -8 },
  { top: "50%", left: "34%", rot: 6 },
  { top: "64%", left: "4%", rot: -3 },
  { top: "78%", left: "30%", rot: 8 },
  { top: "40%", left: "48%", rot: -5 },
];
const INICIO = 0.35;
const PASSO = 0.42;

/** O perfil do negócio levando um carimbo por porta vazando (ou um "bem na frente" em âmbar). */
export function ResultadoCarimbos({ carimbos, meta }: { carimbos: string[]; meta: string }) {
  const reduce = useReducedMotion();
  const aprovado = carimbos.length === 0;

  // som e vibração sincronizados com cada carimbo
  useEffect(() => {
    if (reduce) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    if (aprovado) {
      timers.push(setTimeout(() => (tocar("aprovado"), vibrar([20, 60, 20])), INICIO * 1000));
    } else {
      carimbos.forEach((_, i) => {
        timers.push(setTimeout(() => (tocar("carimbo"), vibrar(35)), (INICIO + i * PASSO) * 1000 + 90));
      });
    }
    return () => timers.forEach(clearTimeout);
  }, [carimbos, aprovado, reduce]);

  return (
    <div className="relative mx-auto aspect-[4/3.4] w-full max-w-[440px] lg:mx-0" aria-hidden="true">
      <div className="absolute inset-0 rotate-[-1.5deg] rounded-[var(--radius-card)] bg-areia-100 p-6 text-tinta shadow-[0_30px_70px_rgba(0,0,0,.5)]">
        <p className="text-[19px] font-extrabold leading-tight">Teu negócio</p>
        <p className="text-[14px] font-semibold text-nevoa-escura">{meta}</p>
        <div className="mt-5 flex flex-col gap-3 opacity-60">
          {[78, 54, 66, 40, 58].map((w, i) => (
            <span key={i} className="h-3 rounded-full bg-tinta/15" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>

      {aprovado ? (
        <motion.span
          className="stamp absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 bg-areia-100/70 text-[26px] leading-[32px]"
          style={{ color: "var(--color-ambar-escuro)", borderWidth: 4 }}
          initial={reduce ? false : { scale: 2.4, opacity: 0, rotate: 10 }}
          animate={{ scale: 1, opacity: 1, rotate: -6 }}
          transition={{ delay: INICIO, type: "spring", stiffness: 650, damping: 22 }}
        >
          Bem na frente
        </motion.span>
      ) : (
        carimbos.map((c, i) => {
          const s = SLOTS[i % SLOTS.length];
          return (
            <motion.span
              key={c}
              className="stamp absolute bg-areia-100/70 mix-blend-multiply"
              style={{ top: s.top, left: s.left, color: "var(--color-brasa-escura)", rotate: s.rot }}
              initial={reduce ? false : { scale: 2.4, opacity: 0, rotate: s.rot + 14 }}
              animate={{ scale: 1, opacity: 1, rotate: s.rot }}
              transition={{ delay: INICIO + i * PASSO, type: "spring", stiffness: 650, damping: 22 }}
            >
              {c}
            </motion.span>
          );
        })
      )}
    </div>
  );
}
