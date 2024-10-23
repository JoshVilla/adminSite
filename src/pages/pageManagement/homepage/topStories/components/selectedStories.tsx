import { Button, List, message, Modal, Typography } from "antd";
import React, { useState } from "react";
import { IStory } from "../interface";
import { updateDisplayStory } from "@/services/api";
import { STATUS } from "@/utils/constant";

type Props = {
  list: IStory[];
  onLoad: Function;
};

const { Title } = Typography;

const SelectedStories = ({ list, onLoad }: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [openModal, setOpenModal] = useState(false);
  const [storyDetails, setStoryDetails] = useState<IStory | null>(null); // Change initial state to null

  const handleCloseModal = () => {
    setOpenModal(false);
    setStoryDetails(null); // Clear story details when modal is closed
  };

  const handleOpenModal = (record: IStory) => {
    setOpenModal(true);
    const parsedContent =
      record.content.map((content) => JSON.parse(content)) || [];
    const newRecord = { ...record, content: parsedContent };

    setStoryDetails(newRecord); // Set the story details when opening the modal
  };

  const updateDisplay = async (id: string, display: number) => {
    const response = await updateDisplayStory({ id, isDisplayed: display });
    if (response.status === STATUS.SUCCESS) {
      messageApi.success(response.data.message);
      onLoad();
    }
  };

  const parsedItem = (str: string) => {
    const parseResult = JSON.parse(str);
    return parseResult.paragraph;
  };

  return (
    <div>
      {contextHolder}
      <List
        dataSource={list}
        renderItem={(items) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleOpenModal(items)}>
                Show
              </Button>,
              <Button
                type="link"
                danger
                onClick={() => updateDisplay(items._id, 0)}
              >
                Remove
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <img
                  src={items.thumbnail}
                  style={{ width: 40, height: 40, objectFit: "contain" }}
                />
              }
              title={<Title level={5}>{items.title}</Title>}
              description={
                <div
                  style={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {parsedItem(items.content[0])}
                </div>
              }
            />
          </List.Item>
        )}
      />
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        onCancel={handleCloseModal}
      >
        {storyDetails && ( // Add a check to ensure storyDetails is not null
          <div>
            <img
              src={storyDetails.thumbnail}
              alt=""
              style={{ maxHeight: "100px" }}
            />
            <Title level={4}>{storyDetails.title}</Title>
            {storyDetails.content.map((paragraph: any, idx: number) => (
              <p key={idx} style={{ marginBottom: "10px" }}>
                {paragraph.paragraph}
              </p>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SelectedStories;
