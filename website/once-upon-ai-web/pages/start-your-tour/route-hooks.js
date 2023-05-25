import { useState } from "react";

export const useModal = (initialValue) => {
  const [showModal, setShowModal] = useState(initialValue);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return { showModal, openModal, closeModal };
};
