import styled from "@emotion/styled";
import { useTranslation } from "next-i18next";
import ReactModal from "react-modal";
import QRCode from "qrcode.react";
import Link from "next/link";

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
  align-items: center;
  gap: 16px;
  max-width: 35em;
  color: black;
  text-align: center;
  max-width: 30rem;
`;

const Title = styled.h2``;

const Subtitle = styled.h3`
  max-width: 15rem;
`;

const RouteLink = styled(Link)`
  color: black;
`;

const CloseButton = styled.button`
  padding: 8px 32px;
`;

function QrModal({ link, showModal, closeModal }) {
  const { t } = useTranslation();

  return (
    <ReactModal isOpen={showModal} onRequestClose={closeModal} style={customStyles}>
      <Container>
        <Title>{t("route_saved")}</Title>
        <Subtitle>{t("route_link_explanation")}</Subtitle>
        <QRCode value={link} size={128} fgColor="#000000" bgColor="#ffffff" />
        <RouteLink href={link}>{link}</RouteLink>
        <CloseButton onClick={closeModal}>{t("close")}</CloseButton>
      </Container>
    </ReactModal>
  );
}

export default QrModal;
