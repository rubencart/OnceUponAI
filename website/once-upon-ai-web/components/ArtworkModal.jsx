import styled from "@emotion/styled";
import { useTranslation } from "next-i18next";
import ReactModal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    color: "black",
    maxWidth: "90%",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 9999,
  },
};

ReactModal.setAppElement("#__next");

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  max-width: 35em;
`;

const Title = styled.h2``;

const Image = styled.img`
  max-height: 400px;
`;

const Description = styled.p``;

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
function ArtworkModal({ artwork, showModal, closeModal }) {
  const { t } = useTranslation();

  return (
    <ReactModal isOpen={showModal} onRequestClose={closeModal} style={customStyles}>
      <Container>
        <Title>{artwork.title}</Title>
        <Image src={artwork.image_url} alt={artwork.title} />
        <Description>{artwork.description}</Description>
        <p>{artwork.address}</p>
        <button onClick={closeModal}>{t("close_info")}</button>
      </Container>
    </ReactModal>
  );
}

export default ArtworkModal;
