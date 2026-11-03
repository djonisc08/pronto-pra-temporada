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

const NA_MENSAGEM: Record<Tipo, string> = { ...BUSCA, Açaí: "açaíteria" };

const COMIDA = new Set<Tipo>(["Restaurante", "Bar", "Açaí", "Sorveteria"]);

export function perguntas(tipo: Tipo | null): Pergunta[] {
  const t: Tipo = tipo ?? "Restaurante";
  const coisa = COMIDA.has(t) ? "pratos" : t === "Pousada" ? "quartos" : "produtos";
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
      busca,
    },
    {
      kind: "photo",
      pergunta: `Teu perfil tem foto boa dos ${coisa}?`,
      dica: "Foto de verdade, com luz boa, não só a fachada.",
      vazando: `Sem foto boa dos ${coisa}`,
      ok: `Foto boa dos ${coisa}`,
      curto: "foto",
    },
    {
      kind: "hours",
      pergunta: "O horário no Google tá certo, inclusive feriado e temporada?",
      dica: "Turista que chega e encontra fechado não volta.",
      vazando: "Horário desatualizado",
      ok: "Horário certo",
      curto: "horário",
    },
    {
      kind: "reviews",
      pergunta: "As avaliações estão respondidas?",
      dica: "Inclusive as ruins. Quem lê repara em quem responde.",
      vazando: "Avaliações sem resposta",
      ok: "Avaliações respondidas",
      curto: "avaliação",
    },
    {
      kind: "menu",
      pergunta: catPergunta,
      dica: "O turista quer ver o que tem e quanto custa antes de sair do hotel.",
      vazando: `${cat} fora do perfil`,
      ok: `${cat} no perfil`,
      curto: cat.toLowerCase(),
    },
  ];
}

export interface Resultado {
  vazando: string[];
  ok: string[];
  mensagem: string;
  link: string;
}

/** "Sim" é ok; "Não" e "Não sei" contam como vazamento. */
export function resultado(tipo: Tipo | null, bairro: Bairro | null, respostas: (Resposta | null)[]): Resultado {
  const qs = perguntas(tipo);
  const vazando: string[] = [];
  const ok: string[] = [];
  const curtos: string[] = [];
  qs.forEach((q, i) => {
    if (respostas[i] === "Sim") ok.push(q.ok);
    else {
      vazando.push(q.vazando);
      curtos.push(q.curto);
    }
  });
  const quem = `Sou ${NA_MENSAGEM[tipo ?? "Outro"]} ${PREP[bairro ?? "Outro"]}.`;
  const mensagem = vazando.length
    ? `Oi Djonata! Fiz o teste. ${quem} Errei: ${curtos.join(", ")}. Quero o RAIO X.`
    : `Oi Djonata! Fiz o teste. ${quem} Acertei tudo. Quero o RAIO X completo.`;
  return { vazando, ok, mensagem, link: waLink(mensagem) };
}

/** "Restaurante nos Ingleses" — usado no cartão do Raio-X. */
export function quemTexto(tipo: Tipo | null, bairro: Bairro | null): string {
  const t = tipo && tipo !== "Outro" ? tipo : "Comércio";
  return `${t} ${PREP[bairro ?? "Outro"]}`;
}
