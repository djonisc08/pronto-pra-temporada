/** WhatsApp do Djonata, com DDI e DDD. */
export const WHATS_NUMBER = "5548991738908";
export const WHATS_DISPLAY = "(48) 99173-8908";

export function waLink(message: string): string {
  return `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WHATS_DIRETO = waLink("Oi Djonata! Quero o RAIO X.");

/**
 * Caso real (antes/depois). Só preencher com resultado medido e autorização
 * do dono. Enquanto for null, a seção não aparece na página.
 */
export const CASO_REAL: null | {
  negocio: string;
  bairro: string;
  antes: string;
  depois: string;
  periodo: string;
} = null;
