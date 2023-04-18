import Head from "next/head";
import styled from "@emotion/styled";
import WidthContainer from "../components/WidthContainer";
import CenteredPageContainer from "@/components/CenteredPageContainer";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

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

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default function FaqHelp() {
  const { t } = useTranslation();

  const FaqItems = [
    {
      title: t("index_faq_1_question"),
      description: t("index_faq_1_answer"),
    },
    {
      title: t("index_faq_2_question"),
      description: t("index_faq_2_answer"),
    },
    {
      title: t("index_faq_3_question"),
      description: t("index_faq_3_answer"),
    },
    {
      title: t("index_faq_4_question"),
      description: t("index_faq_4_answer"),
    },
    {
      title: t("index_faq_5_question"),
      description: t("index_faq_5_answer"),
    },
  ];

  return (
    <div>
      <Head>
        <title>{t("faq_and_help")}</title>
        <meta name="description" content="Faq & Help" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CenteredPageContainer>
        <WidthContainer>
          <CenterContainer>
            <h2>{t("faq_and_help")}</h2>
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
