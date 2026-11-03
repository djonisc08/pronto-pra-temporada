import Image from "next/image";
import { CASO_REAL, WHATS_DIRETO, WHATS_DISPLAY } from "@/lib/config";
import { Carimbo } from "./Carimbo";
import { Magnetic } from "./Magnetic";
import { ChatIcon } from "./icons";

const wrap = "mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12";
const lead = "text-[19px] font-semibold leading-snug text-nevoa sm:text-[22px]";
const h2 = "display text-[clamp(2.4rem,6.2vw,5rem)]";

/* ---------- As 3 portas ---------- */
const PORTAS = [
  {
    titulo: "Não te acham.",
    texto: "No mapa e na busca, teu negócio nem aparece entre as opções.",
    carimbos: ["Fora do mapa", "Link quebrado"],
  },
  {
    titulo: "Não te escolhem.",
    texto: "Te acham, mas o perfil não convence: foto escura, cardápio sumido, avaliação largada.",
    carimbos: ["Cardápio sumido", "Foto escura"],
  },
  {
    titulo: "Não respondem.",
    texto: "Te escolhem, chamam no WhatsApp ou deixam avaliação, e ficam sem resposta.",
    carimbos: ["Avaliação sem resposta", "Whats no vácuo"],
  },
];

export function Portas() {
  return (
    <section className="py-24 lg:py-36">
      <div className={wrap}>
        <h2 className="flex flex-col gap-3">
          <span className={lead}>o turista chega por uma de 3 portas.</span>
          <span className={`${h2} text-areia-100`}>Se uma tá aberta,</span>
          <span className={`${h2} text-brasa`}>ele vai pro vizinho.</span>
        </h2>

        <ol className="mt-16 border-t border-mata-700 lg:mt-24">
          {PORTAS.map((p, i) => (
            <li key={p.titulo} className="grid gap-5 border-b border-mata-700 py-10 lg:grid-cols-[96px_minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-10 lg:py-14">
              <span className="text-[44px] font-black leading-none text-ambar" aria-hidden="true">
                {i + 1}
              </span>
              <div className="flex flex-col gap-3">
                <h3 className="display text-[clamp(2rem,4.2vw,3.4rem)] text-areia-100">{p.titulo}</h3>
                <p className="max-w-[40ch] text-[18px] leading-[1.5] text-nevoa">{p.texto}</p>
              </div>
              <div className="flex flex-wrap items-center gap-4 lg:justify-end">
                {p.carimbos.map((c, j) => (
                  <Carimbo key={c} tilt={j % 2 ? 2.5 : -3.5} delay={j * 0.12}>
                    {c}
                  </Carimbo>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- O Raio-X grátis ---------- */
export function RaioX() {
  return (
    <section className="vinheta py-24 lg:py-36">
      <div className={`${wrap} grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20`}>
        <div className="flex flex-col gap-7">
          <h2 className="flex flex-col gap-3">
            <span className={lead}>no Raio-X grátis, eu faço as</span>
            <span className={`${h2} text-areia-100`}>mesmas perguntas</span>
            <span className="text-[22px] font-bold text-areia-100 sm:text-[26px]">que o turista faz.</span>
          </h2>
          <p className="max-w-[42ch] text-[19px] leading-[1.55] text-nevoa">
            No Google, no Maps e na IA. Depois te mostro, um por um, onde arrumar.
          </p>
          <ul className="flex flex-col gap-3 text-[18px] font-bold text-ambar sm:flex-row sm:gap-8">
            {["De graça", "Sem compromisso", "Entregue no WhatsApp"].map((t) => (
              <li key={t} className="flex items-center gap-2.5 whitespace-nowrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 12.5 9.5 18 20 6" />
                </svg>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:justify-self-end">
          <div className="w-full max-w-[480px] -rotate-[1.2deg] rounded-[var(--radius-card)] bg-areia-100 p-7 text-tinta shadow-[0_30px_70px_rgba(0,0,0,.5)] sm:p-9">
            <p className="border-b border-tinta/20 pb-4 text-[24px] font-black uppercase tracking-[-0.01em]" style={{ fontStretch: "108%" }}>
              Raio-X do teu negócio
            </p>
            <ol className="mt-6 flex flex-col gap-5">
              {["Onde não te acham", "Onde te acham e não te escolhem", "Onde te escolhem e ficam sem resposta"].map((t, i) => (
                <li key={t} className="flex items-center gap-4 text-[18px] font-bold leading-snug">
                  <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-brasa-escura text-[19px] font-black text-creme">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Prova real ---------- */
export function Prova() {
  return (
    <section className="py-24 lg:py-36">
      <div className={`${wrap} grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20`}>
        <div className="flex flex-col gap-6">
          <h2 className="flex flex-col gap-3">
            <span className={lead}>perguntei pra IA do Google:</span>
            <span className="display text-[clamp(2rem,4.2vw,3.1rem)] text-areia-100">“Qual o melhor restaurante nos Ingleses?”</span>
          </h2>
          <p className="max-w-[40ch] text-[19px] leading-[1.55] text-nevoa">
            Cinco estabelecimentos apareceram. Se o teu não tá na lista, o turista nem sabe que tu existe.
          </p>
        </div>

        <figure className="w-full max-w-[480px] lg:justify-self-end">
          <ol className="flex flex-col gap-2" aria-label="Cinco estabelecimentos na resposta da IA, nomes ocultos">
            {[58, 44, 66, 38, 52].map((w, i) => (
              <li key={i} className="flex items-center gap-4 rounded-lg bg-mata-800 px-4 py-3.5">
                <span className="w-4 text-[17px] font-black text-ambar">{i + 1}</span>
                <span className="h-3 rounded-full bg-nevoa/40 blur-[3px]" style={{ width: `${w}%` }} aria-hidden="true" />
                <span className="sr-only">nome oculto</span>
              </li>
            ))}
          </ol>
          <figcaption className="mt-3 text-[14px] font-semibold text-nevoa">Resposta real da IA do Google em 03/11, nomes ocultos.</figcaption>
          <p className="mt-4 rounded-[var(--radius-stamp)] border-2 border-dashed border-brasa-clara px-4 py-3 text-[19px] font-extrabold uppercase text-brasa-clara">
            E tu?
          </p>
        </figure>

        {CASO_REAL && (
          <div className="rounded-[var(--radius-card)] bg-mata-800 p-8 lg:col-span-2">
            <p className="text-[15px] font-bold text-nevoa">
              Caso real: {CASO_REAL.negocio}, {CASO_REAL.bairro}, {CASO_REAL.periodo}
            </p>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <p className="text-[19px] text-nevoa">Antes: {CASO_REAL.antes}</p>
              <p className="text-[19px] font-bold text-ambar">Depois: {CASO_REAL.depois}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- Quem faz ---------- */
export function QuemFaz() {
  return (
    <section className="border-t border-mata-700 py-24 lg:py-36">
      <div className={`${wrap} grid gap-12 md:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] md:items-center lg:gap-20`}>
        <div className="relative mx-auto w-full max-w-[440px] md:mx-0">
          <Image
            src="/djonata.jpg"
            alt="Djonata, de barba ruiva e camisa preta, ao ar livre em Florianópolis"
            width={959}
            height={1198}
            sizes="(min-width: 768px) 440px, 100vw"
            className="aspect-[4/5] w-full rounded-[20px] object-cover shadow-[0_30px_70px_rgba(0,0,0,.5)]"
          />
        </div>
        <div className="flex flex-col gap-6">
          <h2 className="flex flex-col gap-3">
            <span className={lead}>aqui é o</span>
            <span className={`${h2} text-areia-100`}>Djonata, da Ilha.</span>
          </h2>
          <div className="flex max-w-[44ch] flex-col gap-2 text-[20px] leading-[1.5] text-areia-100">
            <p>Sou daqui e atendo pessoalmente, de porta em porta.</p>
            <p>Falo a língua do comércio: sem jargão, sem contrato de agência.</p>
          </div>
          <a href={WHATS_DIRETO} target="_blank" rel="noopener" data-origem="quem-faz" className="inline-flex min-h-11 items-center gap-2 self-start text-[17px] font-bold text-ambar underline-offset-4 hover:underline">
            <ChatIcon size={20} /> {WHATS_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- Perguntas ---------- */
const FAQ = [
  ["É de graça mesmo?", "Sim. O Raio-X é grátis e sem compromisso."],
  ["Tu garante que eu apareço no Google ou no ChatGPT?", "Não. Ninguém sério garante. Eu mostro onde tá vazando, arrumo o que depende do teu negócio e meço todo mês."],
  ["Preciso te dar senha?", "Não. Tu me adiciona como gerente do perfil e pode me remover quando quiser."],
  ["Quanto custa depois?", "Só falo de preço depois de te mostrar o Raio-X."],
];

export function Perguntas() {
  return (
    <section className="border-t border-mata-700 py-24 lg:py-36">
      <div className={`${wrap} grid gap-12 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:gap-20`}>
        <h2 className="flex flex-col gap-3">
          <span className={lead}>o que todo dono pergunta</span>
          <span className="display text-[clamp(2.2rem,4.6vw,3.6rem)] text-areia-100">Pode perguntar.</span>
        </h2>
        <div>
          {FAQ.map(([q, a]) => (
            <details key={q} className="group border-t border-mata-700 last:border-b">
              <summary className="relative flex min-h-11 cursor-pointer list-none items-center py-6 pr-12 text-[20px] font-extrabold leading-snug text-areia-100 [&::-webkit-details-marker]:hidden">
                {q}
                <span aria-hidden="true" className="absolute right-1 top-1/2 -translate-y-1/2 text-[30px] font-semibold text-ambar transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-[56ch] pb-6 text-[18px] leading-[1.55] text-nevoa">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA final ---------- */
export function CtaFinal() {
  return (
    <section id="cta-final" className="vinheta py-28 lg:py-40">
      <div className={`${wrap} flex flex-col items-start gap-10`}>
        <h2 className="flex flex-col gap-2">
          <span className="display text-[clamp(3.2rem,10vw,8.5rem)] text-areia-100">Me chama</span>
          <span className="display text-[clamp(3.2rem,10vw,8.5rem)] text-ambar">no Whats.</span>
          <span className="mt-3 text-[22px] font-bold text-areia-100 sm:text-[28px]">e manda: RAIO X, antes da temporada.</span>
        </h2>
        <Magnetic>
        <a
          href={WHATS_DIRETO}
          target="_blank"
          rel="noopener"
          data-origem="cta-final"
          className="inline-flex min-h-[64px] items-center gap-3 rounded-full bg-brasa px-9 text-[20px] font-extrabold text-creme shadow-[0_12px_32px_rgba(220,76,43,.35)] transition-transform duration-200 hover:-translate-y-0.5"
        >
          <ChatIcon />
          Mandar “RAIO X”
        </a>
        </Magnetic>
        <p className="text-[15px] font-semibold text-nevoa">Grátis, sem compromisso, direto comigo.</p>
      </div>
    </section>
  );
}

export function Rodape() {
  return (
    <footer className="border-t border-mata-700 pb-28 lg:pb-0">
      <div className={`${wrap} flex flex-wrap items-center justify-between gap-3 py-8`}>
        <p className="text-[15px] font-extrabold text-areia-100">
          Pronto pra Temporada <span className="font-semibold text-nevoa">Floripa</span>
        </p>
        <p className="text-[14px] font-semibold text-nevoa">Florianópolis, SC</p>
      </div>
    </footer>
  );
}
