"use client";

import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { useEffect } from "react";
import { rastrear } from "@/lib/track";

const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * Medição da página:
 * - Vercel Analytics (visitas, sem cookies);
 * - Pixel da Meta, só se NEXT_PUBLIC_META_PIXEL_ID estiver configurado na Vercel;
 * - todo clique em link do WhatsApp vira o evento "whats_click", com a origem
 *   tirada do atributo data-origem do link.
 */
export function Medicao() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a[href*='wa.me']") as HTMLAnchorElement | null;
      if (!a) return;
      rastrear("whats_click", { origem: a.dataset.origem ?? "outro" });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return (
    <>
      <Analytics />
      {PIXEL && /^\d{5,20}$/.test(PIXEL) && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
