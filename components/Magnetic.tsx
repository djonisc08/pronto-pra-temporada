"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

/** Puxa levemente o botão na direção do mouse (só desktop, sem redução de movimento). */
export function Magnetic({ children, forca = 0.28 }: { children: React.ReactNode; forca?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [ativo, setAtivo] = useState(false);
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.4 });

  useEffect(() => {
    if (reduce) return;
    setAtivo(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, [reduce]);

  if (!ativo) return <span className="inline-flex">{children}</span>;

  return (
    <motion.span
      ref={ref}
      className="inline-flex"
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - (r.left + r.width / 2)) * forca);
        y.set((e.clientY - (r.top + r.height / 2)) * forca);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
