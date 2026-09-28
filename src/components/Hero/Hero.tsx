import Container from "@/components/Container/Container";
import Button from "@/components/Button/Button";

export default function Hero() {
  return (
    <section className="bg-linear-to-b from-canvas-lavender to-canvas">
      <Container className="py-20 md:py-28 flex flex-col items-center gap-6 text-center">
        <h1 className="text-display-xxl font-bold text-ink">Allan Ramos</h1>
        <p className="text-body-lg text-ink-mute max-w-2xl">
          Aprendendo e compartilhando tecnologia
        </p>
        <Button href="/sobre" variant="primary" size="lg">
          Sobre mim
        </Button>
      </Container>
    </section>
  );
}
