import Head from "next/head";
import styled from "@emotion/styled";
import WidthContainer from "@/components/WidthContainer";
import PageContainer from "@/components/PageContainer";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useContext, useState } from "react";
import { RouteContext } from "@/context/RouteContext";
import { useRouter } from "next/router";

import {
  Container,
  BackButton,
  Content,
  LeftBlock,
  RightBlock,
  Title,
  Description,
  MapContainer,
  Artwork,
  Distance,
  ArtworkTitle,
  MoreInfoButton,
  RouteContainer,
  SaveRoutebutton,
} from "@/components/styled/RouteStyles";

export async function getServerSideProps({ locale, query }) {
  console.log("route query:", query);

  let routeObjects = null;
  if (query.routeId) {
    console.log("found routeId:", query.routeId);
    let route = await getRouteById(query.routeId);
    routeObjects = route.routeObjects;
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      routeObjects,
    },
  };
}

async function getRouteById(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-route?routeId=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    // TODO: Handle error
    throw new Error(res.statusText);
  }

  const data = await res.json();
  return data;
}

export default function Route({ routeObjects }) {
  const { t } = useTranslation();
  const router = useRouter();

  const { routeObjects: objectsFromContext } = useContext(RouteContext);
  const [saveButtonText, setSaveButtonText] = useState(t("save-route"));
  const [savedRouteId, setSavedRouteId] = useState("");

  // Objects fetched from db using a specific routeId take precedence over objects in context
  if (!routeObjects) {
    console.log("Using objects from context");
    routeObjects = objectsFromContext;
  }

  const Artworks = [
    {
      title: "Artwork 1",
      distance: "0m",
    },
    {
      title: "Artwork 2",
      distance: "100m",
    },
    {
      title: "Artwork 3",
      distance: "200m",
    },
  ];

  const Map = dynamic(() => import("@/components/LeafletMap"), {
    loading: () => <p>A map is loading</p>,
    ssr: false, // This line is important. It's what prevents server-side render
  });

  async function onSaveRoute(routeObjects) {
    // Only save route once
    if (routeObjects.length == 0 || savedRouteId) return;

    console.log("saving routeObjects:", routeObjects);

    const res = await fetch("/api/create-route", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ routeObjects }),
    });

    if (!res.ok) {
      // TODO: Show error message on screen
      const error = await res.json();
      throw new Error(error.message);
    }

    const { message, routeId } = await res.json();
    console.log(message, routeId);

    setSavedRouteId(routeId);
    setSaveButtonText(t("saved"));
  }

  function getSavedRouteLink() {
    return `${window.location.origin}/${router.locale}${router.asPath}?routeId=${savedRouteId}`;
  }

  return (
    <div>
      <Head>
        <title>{t("route")}</title>
        <meta name="description" content="Route" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageContainer>
        <WidthContainer>
          <Container>
            <BackButton href="/start-your-tour">
              <IoIosArrowBack />
              {t("back_to_beginning")}
            </BackButton>
            <Content>
              <LeftBlock>
                <Title>{t("walking_route_title")}</Title>
                <Description>{t("walking_route_description")}</Description>
                <RouteContainer>
                  {router.query.routeId == null && (
                    <SaveRoutebutton onClick={() => onSaveRoute(routeObjects)}>{saveButtonText}</SaveRoutebutton>
                  )}
                  {router.query.routeId == null && savedRouteId && (
                    <Link href={getSavedRouteLink()}>Route link: {getSavedRouteLink()}</Link>
                  )}
                  <Map pois={routeObjects} />
                </RouteContainer>
              </LeftBlock>
              <RightBlock>
                <Title>{t("art_pieces")}</Title>
                {Artworks.map((artwork, index) => (
                  <Artwork key={index}>
                    <Distance>{artwork.distance}</Distance>
                    <ArtworkTitle>{artwork.title}</ArtworkTitle>
                    <MoreInfoButton>{t("more_info")}</MoreInfoButton>
                  </Artwork>
                ))}
              </RightBlock>
            </Content>
          </Container>
        </WidthContainer>
      </PageContainer>
    </div>
  );
}
