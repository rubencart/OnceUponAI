import Head from "next/head";
import styled from "@emotion/styled";
import WidthContainer from "../components/WidthContainer";
import CenteredPageContainer from "@/components/CenteredPageContainer";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import FAQAccordion from "@/components/FAQAccordion";

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
            <h1>{t("faq_and_help")}</h1>
            <FAQAccordion />
          </CenterContainer>
        </WidthContainer>
      </CenteredPageContainer>
    </div>
  );
}
