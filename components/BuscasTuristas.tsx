/** Faixa com buscas que turistas fazem, em português, espanhol e inglês. */
const LINHA_1: { t: string; lang: string }[] = [
  { t: "açaí perto de mim", lang: "pt-BR" },
  { t: "parrilla cerca de mí", lang: "es" },
  { t: "restaurante aberto agora Ingleses", lang: "pt-BR" },
  { t: "best seafood near me", lang: "en" },
  { t: "dónde comer en Canasvieiras", lang: "es" },
  { t: "padaria perto de mim", lang: "pt-BR" },
  { t: "heladería abierta ahora", lang: "es" },
];
const LINHA_2: { t: string; lang: string }[] = [
  { t: "mejor restaurante en Ingleses", lang: "es" },
  { t: "sequência de camarão Floripa", lang: "pt-BR" },
  { t: "bar open now Jurerê", lang: "en" },
  { t: "pousada perto da praia", lang: "pt-BR" },
  { t: "carnicería cerca de mí", lang: "es" },
  { t: "sorveteria perto de mim", lang: "pt-BR" },
  { t: "dónde cenar en Lagoa", lang: "es" },
];

function Chip({ t, lang, copia }: { t: string; lang: string; copia?: boolean }) {
  return (
    <li lang={lang} aria-hidden={copia || undefined} className="flex flex-none items-center gap-2.5 rounded-full border border-mata-700 bg-mata-900 px-5 py-3 text-[16px] font-semibold text-areia-100">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9aa49f" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="M15.5 15.5 21 21" />
      </svg>
      {t}
    </li>
  );
}

function Linha({ itens, reverso }: { itens: typeof LINHA_1; reverso?: boolean }) {
  return (
    <div className="pt-marquee group relative overflow-hidden">
      <ul className={`pt-marquee-trilha flex w-max gap-3 ${reverso ? "pt-marquee-reverso" : ""}`}>
        {itens.map((c) => (
          <Chip key={c.t} {...c} />
        ))}
        {itens.map((c) => (
          <Chip key={`${c.t}-2`} {...c} copia />
        ))}
      </ul>
    </div>
  );
}

export function BuscasTuristas() {
  return (
    <section aria-labelledby="buscas-titulo" className="border-y border-mata-700/60 bg-mata-950 py-10 lg:py-14">
      <div className="mx-auto mb-7 flex max-w-[1280px] flex-col gap-1 px-5 sm:px-8 lg:px-12">
        <h2 id="buscas-titulo" className="text-[22px] font-extrabold text-areia-100 sm:text-[26px]">
          O turista pergunta assim. Em português, espanhol e inglês.
        </h2>
        <p className="text-[16px] text-nevoa">Cada busca dessas tem uma resposta. A questão é se o teu negócio aparece nela.</p>
      </div>
      <div className="flex flex-col gap-3">
        <Linha itens={LINHA_1} />
        <Linha itens={LINHA_2} reverso />
      </div>
    </section>
  );
}
