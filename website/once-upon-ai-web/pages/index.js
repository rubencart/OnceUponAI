import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Container from "../components/Container";
import styled from "@emotion/styled";

const HeroContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.1);
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const Title = styled.h1``;

const Subtitle = styled.h2`
  opacity: 0.67;
  font-size: 1rem;
`;

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: center;
  padding: 64px 16px;
  background: lightgrey;
`;

const Steps = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const Step = styled.div`
  flex: 0 1 200px;
  background-color: white;
  padding: 8px;

  & h2 {
    font-size: 1.1rem;
  }

  & p {
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    flex: 0 1 100%;
    max-width: 350px;
  }
`;

export default function Home() {
  const StepsItems = [
    {
      title: "Chat met Jos",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu nisi bibendum risus iaculis vestibulum.",
    },
    {
      title: "Genereer uw route",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu nisi bibendum risus iaculis vestibulum.",
    },
    {
      title: "Verken de stad",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu nisi bibendum risus iaculis vestibulum.",
    },
    {
      title: "Scan de QR-codes",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu nisi bibendum risus iaculis vestibulum.",
    },
  ];

  return (
    <div>
      <Head>
        <title>Once Upon AI</title>
        <meta name="description" content="Homepage for Once Upon AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <Header />
      </header>
      <main>
        <Container>
          <HeroContainer>
            <TitleWrapper>
              <Title>Once Upon AI</Title>
              <Subtitle>AI gegenereerde Gentse wandelingen</Subtitle>
            </TitleWrapper>
            <button>Start de gids</button>
          </HeroContainer>
          <StepsContainer>
            <h1>Hoe werkt het?</h1>
            <Steps>
              {StepsItems.map((item, index) => (
                <Step key={index}>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                </Step>
              ))}
            </Steps>
          </StepsContainer>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
