import { BAIRROS, TIPOS, type Bairro, type Tipo } from "./quiz";

/** Tira acento e espaço: "Açaí" → "acai", "Loja de bebidas" → "loja-de-bebidas". */
export function slug(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Lê ?tipo= e ?bairro= da URL do anúncio.
 * Ex.: /?tipo=acai&bairro=ingleses
 */
export function lerParametros(search: string): { tipo: Tipo | null; bairro: Bairro | null } {
  const p = new URLSearchParams(search);
  const t = p.get("tipo");
  const b = p.get("bairro");
  const tipo = t ? (TIPOS.find((x) => slug(x) === slug(t)) ?? null) : null;
  const bairro = b ? (BAIRROS.find((x) => slug(x) === slug(b)) ?? null) : null;
  return { tipo, bairro };
}
