import type { SnippetKind } from "@/lib/quiz";

/** Pedaço desenhado e genérico de um perfil de negócio. Não imita nenhuma interface real. */
export function ProfileSnippet({ kind, meta, busca }: { kind: SnippetKind; meta: string; busca?: string }) {
  const card = "w-full max-w-[360px] rounded-[var(--radius-card)] bg-areia-100 p-5 text-tinta shadow-[0_24px_50px_rgba(0,0,0,.45)]";

  if (kind === "rank") {
    return (
      <div className={card} aria-hidden="true">
        <div className="flex items-center gap-2.5 rounded-lg bg-tinta px-3.5 py-3 text-[15px] font-semibold text-areia-100">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="M15.5 15.5 21 21" />
          </svg>
          <span className="truncate">{busca}</span>
        </div>
        <ol className="mt-3 flex flex-col gap-1.5">
          {[62, 48, 56].map((w, i) => (
            <li key={i} className="flex items-center gap-3 rounded-lg bg-tinta/[.06] px-3 py-2.5">
              <span className="w-4 text-[15px] font-black text-ambar-escuro">{i + 1}</span>
              <span className="h-2.5 rounded-full bg-tinta/25 blur-[2px]" style={{ width: `${w}%` }} />
            </li>
          ))}
          <li className="flex items-center gap-3 rounded-lg border-2 border-dashed border-brasa-escura px-3 py-2 text-[15px] font-extrabold text-brasa-escura">
            <span className="w-4">?</span> E tu?
          </li>
        </ol>
      </div>
    );
  }

  return (
    <div className={card} aria-hidden="true">
      <p className="text-[17px] font-extrabold leading-tight">Tua casa</p>
      <p className="text-[13px] font-semibold text-nevoa-escura">{meta}</p>

      {kind === "photo" && (
        <svg viewBox="0 0 300 160" className="mt-3 block w-full rounded-lg">
          <rect width="300" height="160" fill="#163a30" />
          <circle cx="150" cy="84" r="60" fill="#f2ede3" />
          <circle cx="150" cy="84" r="46" fill="#e4ddd0" />
          <ellipse cx="136" cy="86" rx="27" ry="15" fill="#d99042" />
          <circle cx="167" cy="73" r="10" fill="#dc4c2b" />
          <circle cx="171" cy="96" r="7" fill="#2c5a4c" />
          <circle cx="154" cy="103" r="5" fill="#2c5a4c" />
        </svg>
      )}

      {kind === "hours" && (
        <div className="mt-3 flex flex-col gap-2">
          <p className="flex items-center gap-2 text-[15px] font-bold">
            <span className="h-2.5 w-2.5 rounded-full bg-ambar-escuro" /> Aberto, fecha às 23h
          </p>
          <p className="flex items-center gap-2 text-[14px] font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-brasa-escura" /> Feriado: horário não informado
          </p>
        </div>
      )}

      {kind === "reviews" && (
        <div className="mt-3">
          <p className="flex items-center gap-2">
            <span className="tracking-[2px] text-ambar-escuro">★★★★★</span>
            <span className="text-[13px] font-semibold text-nevoa-escura">há 2 dias</span>
          </p>
          <p className="mt-1.5 text-[14px] font-medium">“Peixe fresquinho, atendimento top.”</p>
          <div className="mt-3 rounded-lg bg-tinta/[.06] px-3 py-2.5">
            <p className="text-[13px] font-extrabold">Resposta do proprietário</p>
            <p className="text-[14px] font-medium">Valeu demais! Volta sempre.</p>
          </div>
        </div>
      )}

      {kind === "menu" && (
        <div className="mt-4 flex flex-wrap gap-2">
          {["Ver cardápio", "Preços", "Pedir"].map((t) => (
            <span key={t} className="inline-flex min-h-9 items-center rounded-full border-2 border-tinta px-3.5 text-[14px] font-extrabold">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
