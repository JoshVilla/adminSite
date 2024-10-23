import { Button, Modal, Typography } from "antd";
import React, { useEffect, useState } from "react";

type Props = {
  trigger: Function;
  loading: boolean;
};

const DeleteButton = ({ trigger, loading }: Props) => {
  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    if (!loading) handleCloseModal();
  }, [loading]);

  return (
    <React.Fragment>
      <Button
        danger
        size="small"
        type="primary"
        onClick={() => setOpenModal(true)}
      >
        Delete
      </Button>
      <Modal
        open={openModal}
        title="Delete Confirmation"
        onCancel={handleCloseModal}
        onClose={handleCloseModal}
        footer={[
          <Button
            type="primary"
            danger
            size="small"
            onClick={() => setOpenModal(false)}
          >
            No
          </Button>,
          <Button
            type="primary"
            size="small"
            onClick={() => trigger()}
            loading={loading}
          >
            Yes
          </Button>,
        ]}
      >
        <Typography.Title level={5}>
          Are you sure you want to delete this data?
        </Typography.Title>
      </Modal>
    </React.Fragment>
  );
};

export default DeleteButton;
