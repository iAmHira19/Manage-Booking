import React from "react";
import { Modal } from "antd";
const customModal = ({ title, isModalOpen, setIsModalOpen }) => {
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      title={title}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    ></Modal>
  );
};

export default customModal;
