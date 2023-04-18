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

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <div>
      <Head>
        <title>{t("privacy_policy")}</title>
        <meta name="description" content="Privacy Policy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageContainer>
        <WidthContainer>
          <CenterContainer>
            <h2>{t("privacy_policy")}</h2>
          </CenterContainer>
        </WidthContainer>
      </PageContainer>
    </div>
  );
}
