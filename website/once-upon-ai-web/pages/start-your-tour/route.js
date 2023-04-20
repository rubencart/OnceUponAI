import Head from "next/head";
import styled from "@emotion/styled";
import WidthContainer from "@/components/WidthContainer";
import PageContainer from "@/components/PageContainer";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import dynamic from 'next/dynamic'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
`;

const BackButton = styled(Link)`
  border: 1px solid black;
  padding: 8px 16px;
  display: inline-flex;
  align-items: center;
  align-self: flex-start;

  &:hover {
    opacity: 0.67;
    transform: scale(0.95);
  }
`;

const Content = styled.div`
  display: flex;
  gap: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RightBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h2`
  margin-bottom: 8px;
`;

const Description = styled.p`
  display: flex;
  column-count: 2;
  column-gap: 16px;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 400px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Artwork = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background-image: url("your-image-url-here");
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;

  background-color: lightgrey;
`;

const Distance = styled.span`
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 4px 8px;
  font-size: 0.8rem;
`;

const ArtworkTitle = styled.h3`
  margin: auto;
  align-self: center;
`;

const MoreInfoButton = styled.button`
  align-self: center;
`;

export default function Route() {
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

  const Map = dynamic(
    () => import('@/components/LeafletMap'), // replace '@components/map' with your component's location
    { 
      loading: () => <p>A map is loading</p>,
      ssr: false // This line is important. It's what prevents server-side render
    }
  )

  return (
    <div>
      <Head>
        <title>Route</title>
        <meta name="description" content="Route" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageContainer>
        <WidthContainer>
          <Container>
            <BackButton href="/start-your-tour">
              <IoIosArrowBack />
              Back to beginning
            </BackButton>
            <Content>
              <LeftBlock>
                <Title>Wandelroute</Title>
                <Description>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis gravida, justo a posuere tincidunt, enim
                  odio ullamcorper odio, nec sollicitudin libero quam ut velit. Cras bibendum feugiat massa, vitae
                  malesuada tellus bibendum a.
                </Description>
                  <Map />
              </LeftBlock>
              <RightBlock>
                <Title>Kunstwerken</Title>
                {Artworks.map((artwork, index) => (
                  <Artwork key={index}>
                    <Distance>{artwork.distance}</Distance>
                    <ArtworkTitle>{artwork.title}</ArtworkTitle>
                    <MoreInfoButton>Meer info</MoreInfoButton>
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
