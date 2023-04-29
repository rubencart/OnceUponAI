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

export default function DiscoverArtworks() {
  const { t } = useTranslation();

  return (
    <div>
      <Head>
        <title>{t("discover_artworks")}</title>
        <meta name="description" content="Discover Artworks" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageContainer>
        <WidthContainer>
          <CenterContainer>
            <h2>{t("discover_artworks")}</h2>
          </CenterContainer>
        </WidthContainer>
      </PageContainer>
    </div>
  );
}
