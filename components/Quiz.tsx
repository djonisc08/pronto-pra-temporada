"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { tocar, vibrar } from "@/lib/feedback";
import { lerParametros } from "@/lib/params";
import {
  BAIRROS,
  RESPOSTAS,
  TIPOS,
  perguntas,
  quemTexto,
  resultado,
  type Bairro,
  type Resposta,
  type Tipo,
} from "@/lib/quiz";
import { compartilharRaioX } from "@/lib/shareCard";
import { rastrear } from "@/lib/track";
import { ProfileSnippet } from "./ProfileSnippet";
import { ResultadoCarimbos } from "./ResultadoCarimbos";
import { SomToggle } from "./SomToggle";
import { ChatIcon } from "./icons";

const TOTAL = 7; // tipo + bairro + 5 perguntas
const VAZIO: (Resposta | null)[] = [null, null, null, null, null];

export function Quiz() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [tipo, setTipo] = useState<Tipo | null>(null);
  const [bairro, setBairro] = useState<Bairro | null>(null);
  const [respostas, setRespostas] = useState<(Resposta | null)[]>(VAZIO);
  const [salvando, setSalvando] = useState(false);
  const titulo = useRef<HTMLHeadingElement>(null);
  const painel = useRef<HTMLDivElement>(null);
  const primeira = useRef(true);
  const iniciou = useRef(false);

  const qs = useMemo(() => perguntas(tipo), [tipo]);
  const fim = step >= TOTAL;
  const res = useMemo(() => resultado(tipo, bairro, respostas), [tipo, bairro, respostas]);
  const vazandoAteAgora = respostas.filter((r) => r && r !== "Sim").length;

  // Anúncio com ?tipo= e ?bairro= já chega com essas respostas marcadas
  useEffect(() => {
    const p = lerParametros(window.location.search);
    if (p.tipo) {
      setTipo(p.tipo);
      if (p.bairro) {
        setBairro(p.bairro);
        setStep(2);
      } else setStep(1);
    }
  }, []);

  // Foco no novo título a cada passo; rola o painel para a vista se ele subiu demais
  useEffect(() => {
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    const topo = painel.current?.getBoundingClientRect().top ?? 0;
    if (topo < 0) painel.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    titulo.current?.focus({ preventScroll: true });
  }, [step, reduce]);

  function responder(op: string) {
    if (!iniciou.current) {
      iniciou.current = true;
      rastrear("teste_iniciado");
    }
    if (step === 0) setTipo(op as Tipo);
    else if (step === 1) setBairro(op as Bairro);
    else {
      const r = respostas.slice();
      r[step - 2] = op as Resposta;
      setRespostas(r);
      if (op === "Sim") tocar("tap");
      else {
        tocar("vazou");
        vibrar(18);
      }
      if (step === TOTAL - 1) {
        const n = r.filter((x) => x && x !== "Sim").length;
        rastrear("teste_concluido", { vazamentos: n, tipo: tipo ?? "?", bairro: bairro ?? "?" });
      }
    }
    if (step < 2) tocar("tap");
    setStep((s) => s + 1);
  }

  function refazer() {
    setTipo(null);
    setBairro(null);
    setRespostas(VAZIO);
    setStep(0);
  }

  async function salvar() {
    setSalvando(true);
    rastrear("resultado_salvo");
    try {
      await compartilharRaioX({ vazando: res.vazando, ok: res.ok, quem: quemTexto(tipo, bairro) });
    } finally {
      setSalvando(false);
    }
  }

  let pergunta = "";
  let rotulo = "";
  let opcoes: readonly string[] = RESPOSTAS;
  let valor: string | null = null;
  let dica: string | undefined;
  const q = step >= 2 && step < TOTAL ? qs[step - 2] : null;
  if (step === 0) {
    pergunta = "Qual é o teu negócio?";
    rotulo = "Antes, 1 de 2";
    opcoes = TIPOS;
    valor = tipo;
  } else if (step === 1) {
    pergunta = "Em que bairro?";
    rotulo = "Antes, 2 de 2";
    opcoes = BAIRROS;
    valor = bairro;
  } else if (q) {
    pergunta = q.pergunta;
    rotulo = `Pergunta ${step - 1} de 5`;
    dica = q.dica;
    valor = respostas[step - 2];
  }
  const meta = `${tipo ?? "Restaurante"}, ${bairro ?? "Ingleses"}`;
  const muitas = opcoes.length > 3;

  // cor de cada segmento: cinza (antes), âmbar (sim), brasa (vazou), apagado (falta)
  function corSegmento(i: number) {
    if (i < 2) return i < step || fim ? "bg-nevoa" : i === step ? "bg-nevoa/60" : "bg-mata-800";
    const r = respostas[i - 2];
    if (r === "Sim") return "bg-ambar";
    if (r) return "bg-brasa";
    return i === step ? "bg-areia-100/40" : "bg-mata-800";
  }

  const anim = reduce
    ? {}
    : {
        initial: { opacity: 0, x: 28 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -28 },
        transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <div ref={painel} className="relative scroll-mt-4 rounded-[22px] border border-mata-700/70 bg-mata-900 p-5 sm:p-8 lg:p-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* medidor: um segmento por passo, as perguntas pintadas pela resposta */}
        <div className="flex min-w-[200px] flex-1 gap-1.5" aria-hidden="true">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <motion.span
              key={i}
              className={`h-2 flex-1 origin-left rounded-full transition-colors duration-300 ${corSegmento(i)}`}
              animate={!reduce && i >= 2 && respostas[i - 2] && respostas[i - 2] !== "Sim" ? { scaleY: [1, 2.2, 1] } : { scaleY: 1 }}
              transition={{ duration: 0.35 }}
            />
          ))}
        </div>
        <SomToggle />
      </div>
      <p className="mt-3 min-h-6 text-[15px] font-bold" aria-live="polite">
        {!fim && vazandoAteAgora > 0 ? (
          <span className="text-brasa-clara">
            {vazandoAteAgora} {vazandoAteAgora === 1 ? "porta vazando" : "portas vazando"} até agora
          </span>
        ) : null}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        {!fim ? (
          <motion.div key={step} {...anim} className={`mt-4 grid gap-8 lg:mt-6 lg:gap-14 ${q ? "lg:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)]" : ""}`}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <p className="text-[14px] font-bold text-nevoa">{rotulo}</p>
                <h3 ref={titulo} tabIndex={-1} className="text-[clamp(1.65rem,3.4vw,2.6rem)] font-extrabold leading-[1.08] tracking-[-0.015em] text-areia-100 outline-none">
                  {pergunta}
                </h3>
                {dica && <p className="max-w-[46ch] text-[16px] leading-[1.5] text-nevoa">{dica}</p>}
              </div>

              <div role="group" aria-label={pergunta} className={`grid gap-2.5 ${muitas ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3 lg:max-w-[560px]"}`}>
                {opcoes.map((op) => (
                  <motion.button
                    key={op}
                    type="button"
                    aria-pressed={valor === op}
                    onClick={() => responder(op)}
                    whileTap={reduce ? undefined : { scale: 0.94 }}
                    className={`min-h-[60px] rounded-[var(--radius-card)] border-2 px-3 font-extrabold transition-[border-color,background-color] duration-150 ${
                      muitas ? "text-[16px] sm:text-[17px]" : "whitespace-nowrap text-[18px] sm:text-[19px]"
                    } ${valor === op ? "border-ambar bg-mata-950 text-areia-100" : "border-mata-700 bg-mata-800 text-areia-100 hover:border-nevoa"}`}
                  >
                    {op}
                  </motion.button>
                ))}
              </div>

              {q && (
                <div className="pt-2 lg:hidden">
                  <ProfileSnippet kind={q.kind} meta={meta} busca={q.busca} />
                </div>
              )}

              {step > 0 && (
                <button type="button" onClick={() => setStep((s) => s - 1)} className="-ml-2 inline-flex min-h-11 items-center self-start px-2 text-[15px] font-bold text-nevoa hover:text-areia-100">
                  Voltar
                </button>
              )}
            </div>

            {q && (
              <div className="hidden items-start justify-center pt-4 lg:flex">
                <div className="rotate-[1.5deg]">
                  <ProfileSnippet kind={q.kind} meta={meta} busca={q.busca} />
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="fim" {...anim} className="mt-4 flex flex-col gap-10 lg:mt-6" aria-live="polite">
            <div className="flex flex-col gap-4">
              <h3 ref={titulo} tabIndex={-1} className="display text-[clamp(2.4rem,6vw,4.6rem)] outline-none">
                {res.vazando.length ? (
                  <>
                    <span className="block text-areia-100">Teu negócio tem</span>
                    <span className="block text-brasa">
                      {res.vazando.length} {res.vazando.length === 1 ? "porta vazando." : "portas vazando."}
                    </span>
                  </>
                ) : (
                  <span className="block text-ambar">Tá bem na frente.</span>
                )}
              </h3>
              <p className="max-w-[44ch] text-[19px] leading-[1.45] text-nevoa">
                {res.vazando.length ? "Cada porta é um turista que foi pro vizinho." : "Quer confirmar com o Raio‑X completo?"}
              </p>
            </div>

            <div className="grid gap-10 lg:grid-cols-[minmax(0,.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-14">
              <ResultadoCarimbos carimbos={res.carimbos} meta={meta} />

              <div className="flex flex-col gap-8">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {res.vazando.length > 0 && (
                    <div>
                      <h4 className="mb-3 text-[15px] font-bold text-nevoa">Vazando</h4>
                      <ul className="flex flex-col gap-2">
                        {res.vazando.map((t) => (
                          <li key={t} className="flex items-center gap-3 rounded-lg bg-mata-800 px-4 py-3 text-[17px] font-bold text-brasa-clara">
                            <span aria-hidden="true" className="grid h-7 w-7 flex-none place-items-center rounded-full bg-brasa-escura text-[14px] font-black text-creme">✕</span>
                            <span><span className="sr-only">Vazando: </span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {res.ok.length > 0 && (
                    <div>
                      <h4 className="mb-3 text-[15px] font-bold text-nevoa">Tá ok</h4>
                      <ul className="flex flex-col gap-2">
                        {res.ok.map((t) => (
                          <li key={t} className="flex items-center gap-3 rounded-lg bg-mata-800 px-4 py-3 text-[17px] font-bold text-ambar">
                            <span aria-hidden="true" className="grid h-7 w-7 flex-none place-items-center rounded-full bg-ambar text-[14px] font-black text-mata-900">✓</span>
                            <span><span className="sr-only">Ok: </span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                  <a
                    href={res.link}
                    target="_blank"
                    rel="noopener"
                    data-origem="resultado"
                    className="inline-flex min-h-[60px] w-full items-center justify-center gap-3 whitespace-nowrap rounded-full bg-brasa px-6 text-[19px] font-extrabold text-creme shadow-[0_12px_32px_rgba(220,76,43,.35)] transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto sm:px-8"
                  >
                    <ChatIcon />
                    {res.vazando.length ? "Quero o Raio X grátis" : "Quero o Raio X completo"}
                  </a>
                  <button
                    type="button"
                    onClick={salvar}
                    disabled={salvando}
                    className="inline-flex min-h-[60px] w-full items-center justify-center rounded-full border-2 border-mata-700 px-7 text-[17px] font-extrabold text-areia-100 hover:border-areia-100 disabled:opacity-60 sm:w-auto"
                  >
                    {salvando ? "Gerando a imagem…" : "Salvar meu resultado"}
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-[14px] font-semibold text-nevoa">Abre o WhatsApp com teu resultado já escrito. Grátis e sem compromisso.</p>
                  <button type="button" onClick={refazer} className="-ml-2 inline-flex min-h-11 items-center self-start px-2 text-[15px] font-bold text-nevoa hover:text-areia-100">
                    Refazer o teste
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
