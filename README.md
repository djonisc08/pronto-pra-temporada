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

## Links para anúncios

A página se adapta ao anúncio pelos parâmetros `tipo` e `bairro` (sem acento, com hífen):

```
https://pronto-pra-temporada.vercel.app/?tipo=acai
https://pronto-pra-temporada.vercel.app/?tipo=restaurante&bairro=ingleses
https://pronto-pra-temporada.vercel.app/?tipo=loja-de-bebidas&bairro=canasvieiras
```

Tipos: `restaurante`, `bar`, `loja-de-bebidas`, `casa-de-carne`, `acai`, `sorveteria`, `pousada`, `outro`.
Bairros: `ingleses`, `canasvieiras`, `jurere`, `lagoa`, `campeche`, `centro`, `outro`.

Com `tipo`, o mapa do topo mostra a busca daquele negócio e o teste já começa no bairro; com `tipo` e `bairro`, começa direto nas perguntas.

## Medição

- **Vercel Analytics:** ative em Project → Analytics na Vercel. Mostra visitas, origem e dispositivo, sem cookies.
- **Eventos:** `teste_iniciado`, `teste_concluido` (com nº de vazamentos, tipo e bairro), `resultado_salvo` e `whats_click` (com a origem do botão: `topo`, `hero`, `resultado`, `quem-faz`, `cta-final`, `flutuante`). Eventos personalizados na Vercel exigem o plano Pro; no plano grátis aparecem só as visitas.
- **Pixel da Meta (opcional):** crie a variável `NEXT_PUBLIC_META_PIXEL_ID` na Vercel (Settings → Environment Variables) com o ID do Pixel e faça um novo deploy. O clique no WhatsApp vira o evento `Contact`. Antes de ligar o Pixel, publique um aviso de privacidade/cookies (LGPD).

## Publicar

Importe o repositório na Vercel (plano gratuito). Não precisa de variáveis de ambiente.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS v4, Motion e a fonte Archivo (self-hosted via Fontsource).
