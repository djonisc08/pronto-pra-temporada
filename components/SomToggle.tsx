"use client";

import { useSyncExternalStore } from "react";
import { alternarSom, assinarSom, somLigado } from "@/lib/feedback";

export function SomToggle() {
  const ligado = useSyncExternalStore(assinarSom, somLigado, () => true);
  return (
    <button
      type="button"
      onClick={alternarSom}
      aria-pressed={ligado}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-mata-700 px-4 text-[14px] font-bold text-nevoa hover:border-nevoa hover:text-areia-100"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 5 6 9H3v6h3l5 4V5z" />
        {ligado ? (
          <>
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </>
        ) : (
          <path d="m16 9 5 6m0-6-5 6" />
        )}
      </svg>
      {ligado ? "Som ligado" : "Som desligado"}
    </button>
  );
}
