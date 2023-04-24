import Head from "next/head";
import styled from "@emotion/styled";
import PageContainer from "../components/PageContainer";
import WidthContainer from "../components/WidthContainer";
import Link from "next/link";

const HeroWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.1);
`;

const HeroContainer = styled(WidthContainer)`
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
`;

const TitleContainer = styled.div`
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

const StartGuide = styled(Link)`
  border: 1px solid black;
  padding: 8px 16px;

  &:hover {
    opacity: 0.67;
    transform: scale(0.95);
  }
`;

const StepsWrapper = styled.div`
  background: lightgrey;
`;

const StepsContainer = styled(WidthContainer)`
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: center;
  padding: 64px 16px;
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

      <PageContainer>
        <HeroWrapper>
          <HeroContainer>
            <TitleContainer>
              <Title>Once Upon AI</Title>
              <Subtitle>AI gegenereerde Gentse wandelingen</Subtitle>
            </TitleContainer>
            <StartGuide href="/start-your-tour">Start de gids</StartGuide>
          </HeroContainer>
        </HeroWrapper>
        <StepsWrapper>
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
        </StepsWrapper>
      </PageContainer>
    </div>
  );
}
