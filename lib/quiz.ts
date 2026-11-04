import { waLink } from "./config";

export const TIPOS = [
  "Restaurante",
  "Bar",
  "Loja de bebidas",
  "Casa de carne",
  "Açaí",
  "Sorveteria",
  "Pousada",
  "Outro",
] as const;

export const BAIRROS = ["Ingleses", "Canasvieiras", "Jurerê", "Lagoa", "Campeche", "Centro", "Outro"] as const;

export type Tipo = (typeof TIPOS)[number];
export type Bairro = (typeof BAIRROS)[number];
export type Resposta = "Sim" | "Não" | "Não sei";
export const RESPOSTAS: Resposta[] = ["Sim", "Não", "Não sei"];

export type SnippetKind = "rank" | "photo" | "hours" | "reviews" | "menu";

export interface Pergunta {
  kind: SnippetKind;
  pergunta: string;
  dica: string;
  vazando: string;
  ok: string;
  curto: string;
  /** Texto curto do carimbo no resultado. */
  carimbo: string;
  busca?: string;
}

const PREP: Record<Bairro, string> = {
  Ingleses: "nos Ingleses",
  Canasvieiras: "em Canasvieiras",
  Jurerê: "em Jurerê",
  Lagoa: "na Lagoa",
  Campeche: "no Campeche",
  Centro: "no Centro",
  Outro: "em Floripa",
};

const BUSCA: Record<Tipo, string> = {
  Restaurante: "restaurante",
  Bar: "bar",
  "Loja de bebidas": "loja de bebidas",
  "Casa de carne": "casa de carne",
  Açaí: "açaí",
  Sorveteria: "sorveteria",
  Pousada: "pousada",
  Outro: "comércio",
};

const NA_MENSAGEM: Record<Tipo, string> = { ...BUSCA, Açaí: "loja de açaí" };

const COMIDA = new Set<Tipo>(["Restaurante", "Bar", "Açaí", "Sorveteria"]);

/** O que aparece na foto boa de cada tipo de negócio. */
const FOTO: Record<Tipo, string> = {
  Restaurante: "pratos",
  Bar: "drinks e petiscos",
  "Loja de bebidas": "produtos",
  "Casa de carne": "cortes",
  Açaí: "copos e tigelas",
  Sorveteria: "sorvetes",
  Pousada: "quartos",
  Outro: "produtos",
};

export function perguntas(tipo: Tipo | null): Pergunta[] {
  const t: Tipo = tipo ?? "Restaurante";
  const coisa = FOTO[t];
  const cat = COMIDA.has(t) ? "Cardápio" : t === "Pousada" ? "Quartos e preços" : "Catálogo";
  const catPergunta =
    t === "Pousada" ? "Os quartos e preços aparecem no perfil?" : `O ${cat.toLowerCase()} aparece no perfil?`;
  const busca = `${BUSCA[t]} perto de mim`;

  return [
    {
      kind: "rank",
      pergunta: `Tu aparece nos 3 primeiros quando pesquisam “${busca}”?`,
      dica: "Pesquisa no celular, com a localização ligada, como o turista faz.",
      vazando: "Não aparece nos 3 primeiros do mapa",
      ok: "Aparece nos 3 primeiros",
      curto: "mapa",
      carimbo: "Fora do mapa",
      busca,
    },
    {
      kind: "photo",
      pergunta: `Teu perfil tem foto boa dos ${coisa}?`,
      dica: "Foto de verdade, com luz boa, não só a fachada.",
      vazando: `Sem foto boa dos ${coisa}`,
      ok: `Foto boa dos ${coisa}`,
      curto: "foto",
      carimbo: "Sem foto boa",
    },
    {
      kind: "hours",
      pergunta: "O horário no Google tá certo, inclusive feriado e temporada?",
      dica: "Turista que chega e encontra fechado não volta.",
      vazando: "Horário desatualizado",
      ok: "Horário certo",
      curto: "horário",
      carimbo: "Horário errado",
    },
    {
      kind: "reviews",
      pergunta: "As avaliações estão respondidas?",
      dica: "Inclusive as ruins. Quem lê repara em quem responde.",
      vazando: "Avaliações sem resposta",
      ok: "Avaliações respondidas",
      curto: "avaliação",
      carimbo: "Sem resposta",
    },
    {
      kind: "menu",
      pergunta: catPergunta,
      dica: "O turista quer ver o que tem e quanto custa antes de sair do hotel.",
      vazando: `${cat} fora do perfil`,
      ok: `${cat} no perfil`,
      curto: cat.toLowerCase(),
      carimbo: t === "Pousada" ? "Sem preços" : `Sem ${cat.toLowerCase()}`,
    },
  ];
}

export interface Resultado {
  vazando: string[];
  carimbos: string[];
  ok: string[];
  mensagem: string;
  link: string;
}

/** Limpa o que a pessoa digitou: sem espaço sobrando e no máximo 60 caracteres. */
function limpo(s: string | undefined): string {
  return (s ?? "").replace(/\s+/g, " ").trim().slice(0, 60);
}

/** "Sim" é ok; "Não" e "Não sei" contam como vazamento. Nome e negócio vão só na mensagem, nada é salvo. */
export function resultado(
  tipo: Tipo | null,
  bairro: Bairro | null,
  respostas: (Resposta | null)[],
  contato: { nome?: string; negocio?: string } = {},
): Resultado {
  const qs = perguntas(tipo);
  const vazando: string[] = [];
  const ok: string[] = [];
  const curtos: string[] = [];
  const carimbos: string[] = [];
  qs.forEach((q, i) => {
    if (respostas[i] === "Sim") ok.push(q.ok);
    else {
      vazando.push(q.vazando);
      curtos.push(q.curto);
      carimbos.push(q.carimbo);
    }
  });
  const nome = limpo(contato.nome);
  const negocio = limpo(contato.negocio);
  const segmento = `${NA_MENSAGEM[tipo ?? "Outro"]} ${PREP[bairro ?? "Outro"]}`;
  // sem "do/da" para servir a qualquer nome: "Aqui é Ana, Pizzaria Bella (restaurante em Jurerê)."
  const quem = nome || negocio
    ? `Aqui é ${[nome, negocio].filter(Boolean).join(", ")} (${segmento}).`
    : `Sou ${segmento}.`;
  const mensagem = vazando.length
    ? `Oi Djonata! ${quem} Fiz o teste e errei: ${curtos.join(", ")}. Quero o RAIO X.`
    : `Oi Djonata! ${quem} Fiz o teste e acertei tudo. Quero o RAIO X completo.`;
  return { vazando, carimbos, ok, mensagem, link: waLink(mensagem) };
}

/** "Restaurante nos Ingleses" — usado no cartão do Raio-X. */
export function quemTexto(tipo: Tipo | null, bairro: Bairro | null): string {
  const t = tipo && tipo !== "Outro" ? tipo : "Comércio";
  return `${t} ${PREP[bairro ?? "Outro"]}`;
}

/** Busca que o turista digita para esse tipo de negócio: "açaí perto de mim". */
export function buscaDe(tipo: Tipo | null): string {
  return `${BUSCA[tipo ?? "Restaurante"]} perto de mim`;
}
