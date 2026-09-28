import Container from "@/components/Container/Container";

export default function Footer() {
  return (
    <footer className="bg-surface-aubergine text-on-primary px-6 py-8 text-caption">
      <Container className="px-0">
        <p>&copy; {new Date().getFullYear()} Allan Ramos. Todos os direitos reservados.</p>
      </Container>
    </footer>
  );
}
