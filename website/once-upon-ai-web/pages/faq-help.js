import Head from "next/head";
import styled from "@emotion/styled";
import WidthContainer from "../components/WidthContainer";
import CenteredPageContainer from "@/components/CenteredPageContainer";

const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const FaqItem = styled.div`
  margin: 8px 0;

  h2,
  p {
    font-size: 0.9rem;
  }
`;

export default function FaqHelp() {
  const FaqItems = [
    {
      question: "Why?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu nisi bibendum risus iaculis vestibulum.",
    },
    {
      question: "How does this work?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu nisi bibendum risus iaculis vestibulum.",
    },
    {
      question: "What is ChatGPT?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu nisi bibendum risus iaculis vestibulum.",
    },
    {
      question: "Is my personal data safe?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu nisi bibendum risus iaculis vestibulum.",
    },
    {
      question: "Other questions?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu nisi bibendum risus iaculis vestibulum.",
    },
  ];

  return (
    <div>
      <Head>
        <title>Faq & Help</title>
        <meta name="description" content="Faq & Help" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CenteredPageContainer>
        <WidthContainer>
          <CenterContainer>
            <h2>Faq & Help</h2>
            <div>
              {FaqItems.map((item, index) => (
                <FaqItem key={index}>
                  <h2>{item.question}</h2>
                  <p>{item.answer}</p>
                </FaqItem>
              ))}
            </div>
          </CenterContainer>
        </WidthContainer>
      </CenteredPageContainer>
    </div>
  );
}
