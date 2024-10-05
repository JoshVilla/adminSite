import { Col, Flex, Row, Typography, Input, Form, message, Button } from "antd";
import React, { useState } from "react";
import style from "./style.module.scss";
import { ISiteInfo } from "./interface";
import { useForm } from "antd/es/form/Form";
import { siteInfoUpdate } from "@/services/api";
const { TextArea } = Input;
type Props = {
  data: ISiteInfo;
};

const VisionMission = ({ data }: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = useForm();
  const [loading, setLoading] = useState(false);

  const handleUpdate = () => {
    setLoading((prev) => !prev);
    const params = form.getFieldsValue();
    console.log(params, "params");

    siteInfoUpdate({ ...params, id: data._id }).then((res) => {
      if (res.status === 200) {
        setLoading((prev) => !prev);
        messageApi.open({
          type: "success",
          content: res.data.message,
        });
      }
    });
  };
  return (
    <div className={style.visionMissionContainer}>
      {contextHolder}
      <Typography.Title level={3}>Mission and Vision</Typography.Title>
      <Form
        form={form}
        initialValues={{
          mission: data.mission,
          vision: data.vision,
        }}
      >
        <Row>
          <Col span={12} className={style.col}>
            <Typography.Title level={4}>Mission</Typography.Title>
            <Form.Item name="mission">
              <TextArea autoSize />
            </Form.Item>
          </Col>
          <Col span={12} className={style.col}>
            <Typography.Title level={4}>Vision</Typography.Title>
            <Form.Item name="vision">
              <TextArea autoSize />
            </Form.Item>
          </Col>
        </Row>
        <Button loading={loading} type="primary" onClick={handleUpdate}>
          Update
        </Button>
      </Form>
    </div>
  );
};

export default VisionMission;
