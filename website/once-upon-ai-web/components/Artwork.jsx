import styled from "@emotion/styled";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import ArtworkModal from "./ArtworkModal";

const Container = styled.div`
  position: relative;
  width: 100%;
  min-height: 200px;
  /* background-color: lightgrey; */
  background-image: ${(props) => (props.imageUrl ? `url(${props.imageUrl})` : "none")};
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
  text-align: center;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }

  & > * {
    z-index: 1;
  }
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

/**
 * artwork: {
 *   "object_id": "550016631",
 *   "title": "Titel van het object",
 *   "coordinates": [51.06783069999999, 3.7290914],
 *   "description": "Een uitleg over het object",
 *   "address": "9000 Ghent, Belgium",
 *   "image_url": null,
 *   "location_link": "ChatGPT",
 *   "collection": "stam"
 * }
 */
export default function Artwork({ artwork }) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  //   const shortDescription = artwork.description.substring(0, 50) + "...";
  //   console.log("artwork.description", artwork.description);

  // TODO: Calculate distance and sort & display?
  return (
    <Container imageUrl={artwork.image_url}>
      {/* <Distance>{artwork.distance}</Distance> */}
      <ArtworkTitle>{artwork.title}</ArtworkTitle>
      {/* {artwork.description.trim() !== "" && <p>{shortDescription}</p>} */}
      <MoreInfoButton onClick={openModal}>{t("more_info")}</MoreInfoButton>
      <ArtworkModal artwork={artwork} showModal={showModal} closeModal={closeModal} />
    </Container>
  );
}
