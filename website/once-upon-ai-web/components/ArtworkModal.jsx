import styled from "@emotion/styled";
import { useTranslation } from "next-i18next";
import ReactModal from "react-modal";

const customStyles = {
  content: {
    position: "relative",
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
  /* background-color: red; */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  max-width: 35em;
  max-height: 90vh;
  overflow: auto;

  scrollbar-width: none; /* For Firefox */
  -ms-overflow-style: none; /* For Internet Explorer and Edge */
  &::-webkit-scrollbar {
    width: 0px; /* For Chrome, Safari, and Opera */
  }
`;

const Title = styled.h2``;

const Image = styled.img`
  max-height: 400px;
`;

const Description = styled.p``;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.4);
  border: none;
  color: white;
  font-size: 2rem;
  z-index: 10000;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
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
function ArtworkModal({ artwork, showModal, closeModal }) {
  const { t } = useTranslation();

  return (
    <ReactModal isOpen={showModal} onRequestClose={closeModal} style={customStyles}>
      <CloseButton onClick={closeModal}>&times;</CloseButton>
      <Container>
        <Title>{artwork.title}</Title>
        {artwork.image_url && <Image src={artwork.image_url} alt={artwork.title} />}
        <Description>{artwork.description}</Description>
        <p>{artwork.address}</p>
      </Container>
    </ReactModal>
  );
}

export default ArtworkModal;
