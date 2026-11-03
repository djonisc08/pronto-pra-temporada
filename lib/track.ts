import { track as vercelTrack } from "@vercel/analytics";

type Props = Record<string, string | number | boolean>;
type Fbq = (cmd: "trackCustom" | "track", evento: string, props?: Props) => void;

/**
 * Registra um evento no Vercel Analytics e, se o Pixel da Meta estiver configurado,
 * também no Pixel. Nunca envia dados pessoais: só o tipo de evento e a origem.
 */
export function rastrear(evento: string, props?: Props) {
  try {
    vercelTrack(evento, props);
  } catch {
    /* analytics indisponível: segue a vida */
  }
  const fbq = (typeof window !== "undefined" ? (window as unknown as { fbq?: Fbq }).fbq : undefined);
  if (fbq) {
    if (evento === "whats_click") fbq("track", "Contact", props);
    else fbq("trackCustom", evento, props);
  }
}
