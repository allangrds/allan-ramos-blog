import Button from "@/components/Button/Button";
import Container from "@/components/Container/Container";

/**
 * Re-estilização derivada dos tokens: o componente **não tem card no artboard**, e a apresentação
 * vem do topo de `Main.dc.html` (desktop) e `Mobile.dc.html` (390px).
 *
 * Sai o degradê `canvas-lavender` → `canvas`, que era da paleta anterior: a identidade nova não
 * tem degradê, e `canvas-lavender` não existe mais como token.
 *
 * O CONTEÚDO não muda — a tarefa é re-estilização. O artboard traz um sobretítulo ("inventário
 * completo") que é chrome da documentação DELE, não texto do produto, e por isso não entra aqui.
 */
export default function Hero() {
  return (
    <section className="border-b-2 border-ink bg-canvas">
      <Container className="flex flex-col items-start gap-4 py-12 lg:py-20">
        <h1 className="text-display-xxl text-ink">Allan Ramos</h1>

        <p className="text-body-lg text-ink-soft">
          Aprendendo e compartilhando tecnologia
        </p>

        <Button href="/sobre" variant="primary" size="lg" className="lg:w-auto">
          Sobre mim
        </Button>
      </Container>
    </section>
  );
}
