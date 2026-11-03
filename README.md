# Pronto pra Temporada

Landing page do serviço **Pronto pra Temporada** (Florianópolis): o dono do negócio faz um teste de 10 segundos e chama no WhatsApp com o resultado já escrito. Não tem cadastro e nada é salvo.

## Rodar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Onde mexer

| O quê | Arquivo |
| --- | --- |
| Número do WhatsApp e caso real (antes/depois) | `lib/config.ts` |
| Perguntas, textos do resultado e mensagem do WhatsApp | `lib/quiz.ts` |
| Hero e mapa animado | `components/Hero.tsx`, `components/MapaVizinho.tsx` |
| Teste interativo | `components/Quiz.tsx`, `components/ProfileSnippet.tsx` |
| Demais seções (portas, Raio-X, prova, quem faz, perguntas, CTA) | `components/Secoes.tsx` |
| Cores e tipografia (tokens do design system) | `app/globals.css` |
| Foto | `public/djonata.jpg` |

O bloco "Caso real" só aparece quando `CASO_REAL` em `lib/config.ts` for preenchido, e só deve ser preenchido com resultado medido e autorização do dono.

## Publicar

Importe o repositório na Vercel (plano gratuito). Não precisa de variáveis de ambiente.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS v4, Motion e a fonte Archivo (self-hosted via Fontsource).
