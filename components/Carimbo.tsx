"use client";

import { motion, useReducedMotion } from "motion/react";

/** Carimbo de problema: bate uma vez quando entra na tela. */
export function Carimbo({ children, tilt = -3, delay = 0 }: { children: React.ReactNode; tilt?: number; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className="stamp"
      style={{ rotate: tilt }}
      initial={reduce ? false : { scale: 1.6, opacity: 0, rotate: tilt - 8 }}
      whileInView={{ scale: 1, opacity: 1, rotate: tilt }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ delay, type: "spring", stiffness: 700, damping: 26, mass: 0.6 }}
    >
      {children}
    </motion.span>
  );
}
