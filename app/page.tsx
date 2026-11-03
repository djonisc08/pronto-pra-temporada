import { Hero } from "@/components/Hero";
import { Quiz } from "@/components/Quiz";
import { CtaFinal, Perguntas, Portas, Prova, QuemFaz, RaioX, Rodape } from "@/components/Secoes";
import { WhatsFloat } from "@/components/WhatsFloat";
import { WHATS_NUMBER } from "@/lib/config";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Pronto pra Temporada",
  description: "Raio-X grátis da presença de restaurantes, bares e comércios no Google, no Maps e nas IAs.",
  areaServed: { "@type": "City", name: "Florianópolis" },
  telephone: `+${WHATS_NUMBER}`,
};

export default function Page() {
  return (
    <main>
      <Hero />

      <section id="teste" className="scroll-mt-4 bg-mata-950 py-20 lg:py-32">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
          <div className="mb-10 flex flex-col gap-4 lg:mb-14 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <h2 className="flex flex-col gap-3">
              <span className="text-[19px] font-semibold text-nevoa sm:text-[22px]">10 segundos, 5 perguntas.</span>
              <span className="display text-[clamp(2.4rem,6vw,4.8rem)] text-areia-100">Onde o teu negócio tá vazando?</span>
            </h2>
            <p className="max-w-[38ch] text-[17px] leading-[1.55] text-nevoa">
              Responde com sinceridade. “Não sei” conta como vazamento: se tu não sabe, o turista também não acha. Nada fica salvo.
            </p>
          </div>
          <Quiz />
        </div>
      </section>

      <Portas />
      <RaioX />
      <Prova />
      <QuemFaz />
      <Perguntas />
      <CtaFinal />
      <Rodape />
      <WhatsFloat />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
