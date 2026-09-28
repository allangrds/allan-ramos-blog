import Link from "next/link";

import Container from "@/components/Container/Container";

export default function SobrePage() {
  return (
    <Container className="py-12">
      <h1 className="text-heading-lg font-bold text-ink mb-6">Sobre</h1>
      <div className="flex flex-col gap-4 text-body-md text-ink-mute">
        <p>Oi, tudo bem?</p>
        <p>
          Sou Allan Ramos, desenvolvedor front-end e trabalhando atualmente na{" "}
          <Link
            href="https://www.caju.com.br/"
            target="_blank"
            rel="noreferrer"
            className="text-link-blue hover:text-link-hover"
          >
            Caju
          </Link>
          .
        </p>
        <p>
          Comecei a programar em 2015 como front-end quando tive a oportunidade de
          estagiar no que era uma startup chamada{" "}
          <Link
            href="https://cargobr.com/"
            target="_blank"
            rel="noreferrer"
            className="text-link-blue hover:text-link-hover"
          >
            CARGOBR
          </Link>
          . Lá eu tive contato com HTML, CSS, jQuery e um pouquinho de React.
        </p>
        <p>
          A partir daí, foquei ainda mais em Javascript, entrando na{" "}
          <Link
            href="https://pagar.me/"
            target="_blank"
            rel="noreferrer"
            className="text-link-blue hover:text-link-hover"
          >
            Pagar.me
          </Link>{" "}
          em 2017. Onde pude melhorar meus conhecimentos como desenvolvedor, além de
          aprender Node e melhorar minhas habilidades com React.
        </p>
        <p>
          Hoje estou na Caju, uma fintech do ramo de benefícios. Além de mexer com
          Typescript e React, também acabo pegando uma coisinha ou outra de React
          Native.
        </p>
        <p>
          Quando não estou programando no trabalho, também estou programando por
          diversão em algum projeto pessoal, lendo algum livro (ficção, tecnologia,
          teologia), vendo algum tipo de série ou filme, ou trabalhando em alguma
          coisa da minha igreja — sou da Igreja Adventista do Sétimo Dia.
        </p>
        <p>Espero que você goste do blog :).</p>
        <div>
          <p>Se quiser me conhecer nas redes:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>
              <Link
                href="https://github.com/allangrds"
                target="_blank"
                rel="noreferrer"
                className="text-link-blue hover:text-link-hover"
              >
                Github
              </Link>
            </li>
            <li>
              <Link
                href="https://www.linkedin.com/in/allangabrielrds/"
                target="_blank"
                rel="noreferrer"
                className="text-link-blue hover:text-link-hover"
              >
                Linkedin
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </Container>
  );
}
