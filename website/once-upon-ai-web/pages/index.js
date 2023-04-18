import Head from "next/head";
import styled from "@emotion/styled";
import PageContainer from "../components/PageContainer";
import WidthContainer from "../components/WidthContainer";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const HeroWrapper = styled.div``;

const HeroContainer = styled(WidthContainer)`
  height: 500px;
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

const Title = styled.h1`
  font-size: calc(3rem + 5vw);
`;

const Subtitle = styled.h2`
  opacity: 0.67;
  font-size: 1rem;
`;

const Division = styled.h2`
  font-family: "Mazius Review Extra", sans-serif;
  color: var(--pink);
  box-sizing: border-box;
  position: relative;
  border: 1.5px solid white;
  padding: 8px 32px;
  width: 100vw;
  text-align: center;
  &:before,
  &:after {
    content: "";
    aspect-ratio: 1 / 1;
    height: calc(3px + 100%);
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    border-radius: 50%;
    border: 1.5px solid white;
    position: absolute;
    box-sizing: border-box;
  }
  &:after {
    right: 0;
    transform: translate(50%, -9.5px);
  }
  &:before {
    left: 0;
    transform: translate(-50%, -9.5px);
  }
`;

const StartGuide = styled(Link)`
  border: 1.5px solid white;
  padding: 8px 32px;
  box-sizing: border-box;
  position: relative;
  &:hover {
    opacity: 0.67;
    transform: scale(0.95);
  }

  &:before,
  &:after {
    content: "";
    aspect-ratio: 1 / 1;
    height: calc(3px + 100%);
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    border-radius: 50%;
    border: 1.5px solid white;
    position: absolute;
    box-sizing: border-box;
  }
  &:after {
    right: 0;
    transform: translate(50%, -9.5px);
  }
  &:before {
    left: 0;
    transform: translate(-50%, -9.5px);
  }
`;

const StepsWrapper = styled.div``;

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

const StepContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 0 1 250px;
`;

const GraphicElement = styled.div`
  position: relative;
  min-width: 25px;
  border: 1.5px solid white;
  box-sizing: border-box;
  height: calc(-25px + 100%);
  transform: translate(0, 12.5px);
  &:before,
  &:after {
    content: "";
    aspect-ratio: 1 / 1;
    width: calc(3px + 100%);
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    border-radius: 50%;
    border: 1.5px solid white;
    position: absolute;
    box-sizing: border-box;
    transform: translate(-1.5px, -50%);
  }
  &:after {
    bottom: 0;
    transform: translate(-1.5px, 50%);
  }
  &:before {
    top: 0;
  }
`;

const Step = styled.div`
  padding: 0 16px;

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

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default function Home() {
  const { t } = useTranslation();

  const StepsItems = [
    {
      title: t("index_step_1_title"),
      description: t("index_step_1_description"),
    },
    {
      title: t("index_step_2_title"),
      description: t("index_step_2_description"),
    },
    {
      title: t("index_step_3_title"),
      description: t("index_step_3_description"),
    },
    {
      title: t("index_step_4_title"),
      description: t("index_step_4_description"),
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
              <Subtitle>{t("ai_generated_routes")}</Subtitle>
            </TitleContainer>
            <StartGuide href="/start-your-tour">{t("start_guide")}</StartGuide>
          </HeroContainer>
        </HeroWrapper>
        <StepsWrapper>
          <StepsContainer>
            <Division>{t("how_does_it_work")}</Division>
            <Steps>
              {StepsItems.map((item, index) => (
                <StepContainer key={index}>
                  <GraphicElement></GraphicElement>
                  <Step key={index}>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </Step>
                </StepContainer>
              ))}
            </Steps>
          </StepsContainer>
        </StepsWrapper>
      </PageContainer>
    </div>
  );
}
