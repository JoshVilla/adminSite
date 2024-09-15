import React, { useEffect, useState } from "react";
import { Button, Flex, Form, Input, message, Space, Typography } from "antd";
import { ISiteInfo } from "./interface";
import { useForm } from "antd/es/form/Form";
import { siteInfoUpdate } from "../../services/api";

type Props = {
  data: ISiteInfo;
};

const BasicInformation = ({ data }: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue({
      ...data,
      accounts: data.accounts || { facebook: "", twitter: "", tiktok: "" }, // Fallback if no accounts
    });
  }, [data, form]);

  console.log(data, "data");

  const handleUpdate = () => {
    setLoading((prev) => !prev);
    const params = form.getFieldsValue();
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
    <div>
      {contextHolder}
      <Typography.Title level={3}>Basic Information </Typography.Title>
      <Form
        form={form}
        initialValues={{
          title: data.title,
          address: data.address,
          accounts: data.accounts || {
            facebook: "",
            twitter: "",
            tiktok: "",
          },
        }}
      >
        <Space direction="vertical">
          {/* Title */}
          <Form.Item label="Title" name="title">
            <Input placeholder="Input Title of the Site" />
          </Form.Item>

          {/* Address */}
          <Form.Item label="Address" name="address">
            <Input placeholder="Input Address of the School" />
          </Form.Item>

          {/* Social Media Section */}
          <div>
            <Typography.Title level={5}>
              Social Media Accounts Links
            </Typography.Title>
            <Flex gap={20}>
              <Form.Item label="Facebook" name={["accounts", "facebook"]}>
                <Input placeholder="Facebook Link" />
              </Form.Item>
              <Form.Item label="Twitter" name={["accounts", "twitter"]}>
                <Input placeholder="Twitter Link" />
              </Form.Item>
              <Form.Item label="Tiktok" name={["accounts", "tiktok"]}>
                <Input placeholder="Tiktok Link" />
              </Form.Item>
            </Flex>
          </div>
          <Button loading={loading} type="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Space>
      </Form>
    </div>
  );
};

export default BasicInformation;
