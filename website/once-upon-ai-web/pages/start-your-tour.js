import Head from "next/head";
import styled from "@emotion/styled";
import WidthContainer from "../components/WidthContainer";
import PageContainer from "../components/PageContainer";
import Link from "next/link";
import Image from "next/image";
import CenteredPageContainer from "@/components/CenteredPageContainer";

const CenterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 32px;
  max-width: 500px;
`;

const StartChat = styled(Link)`
  border: 1px solid black;
  padding: 8px 16px;

  &:hover {
    opacity: 0.67;
    transform: scale(0.95);
  }
`;

export default function StartYourTour() {
  return (
    <div>
      <Head>
        <title>Start Your Tour</title>
        <meta name="description" content="Start Your Tour" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CenteredPageContainer>
        <WidthContainer>
          <CenterContainer>
            <Image src="./robot.svg" width={300} height={200} alt="Robot Image" />
            <ContentContainer>
              <h1>Hello, my name is Jos!</h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu nisi bibendum risus iaculis
                vestibulum. Aliquam erat volutpat. Sed aliquam ligula massa, sit amet ultricies leo fringilla vitae.
              </p>
              <StartChat href="/start-your-tour/chat">Start met praten</StartChat>
            </ContentContainer>
          </CenterContainer>
        </WidthContainer>
      </CenteredPageContainer>
    </div>
  );
}
