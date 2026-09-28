import Link from "next/link";

import Container from "@/components/Container/Container";

export default function NotFound() {
  return (
    <Container className="py-16 text-center">
      <h1 className="text-heading-lg font-bold mb-4">Página não encontrada</h1>
      <p className="text-body-md text-ink-mute mb-6">
        O conteúdo que você procura não existe ou foi movido.
      </p>
      <Link href="/" className="text-link-blue hover:text-link-hover">
        Voltar para a página inicial
      </Link>
    </Container>
  );
}
