import Head from "next/head";
import styled from "@emotion/styled";
import WidthContainer from "../components/WidthContainer";
import PageContainer from "../components/PageContainer";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
`;

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default function TermsAndConditions() {
  const { t } = useTranslation();

  return (
    <div>
      <Head>
        <title>{t("terms_and_conditions")}</title>
        <meta name="description" content="Terms & Conditions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageContainer>
        <WidthContainer>
          <CenterContainer>
            <h2>{t("terms_and_conditions")}</h2>
          </CenterContainer>
        </WidthContainer>
      </PageContainer>
    </div>
  );
}
