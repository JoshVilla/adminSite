import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Space, Typography, Upload } from "antd";
import { ISiteInfo } from "./interface";
import { useForm } from "antd/es/form/Form";
import { siteInfoUpdate } from "@/services/api";
import { UploadOutlined } from "@ant-design/icons";

type Props = {
  data: ISiteInfo;
};

const BasicInformation = ({ data }: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState<File | null>(null); // Separate state for logo
  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue({
      ...data,
      accounts: data.accounts || { facebook: "", twitter: "", tiktok: "" },
    });
  }, [data, form]);

  const handleUpdate = () => {
    setLoading(true);
    const formValues = form.getFieldsValue();

    const params = {
      ...formValues,
      logo, // Include the logo state if updated
    };

    console.log("Form values on submit:", params);

    siteInfoUpdate({ ...params, id: data._id }).then((res) => {
      setLoading(false);
      if (res.status === 200) {
        messageApi.success(res.data.message);
      } else {
        messageApi.error("Update failed");
      }
    });
  };

  const uploadOnChange = (info: any) => {
    const { file } = info;

    if (file.status === "done") {
      setLogo(file.originFileObj); // Set logo to the uploaded file
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }
    return isImage || Upload.LIST_IGNORE;
  };

  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 10 },
  };

  return (
    <div>
      {contextHolder}
      <Typography.Title level={3}>Basic Information</Typography.Title>
      <Form form={form} {...layout}>
        {/* <Space direction="vertical"> */}
        {/* Profile */}
        <Form.Item label="Logo" name="logo">
          <Upload
            onChange={uploadOnChange}
            beforeUpload={beforeUpload}
            maxCount={1}
            customRequest={({ file, onSuccess }) => {
              // Check if onSuccess is defined before calling it
              if (onSuccess) {
                setTimeout(() => onSuccess("ok"), 0); // Simulate a successful upload
              }
            }}
          >
            <Button icon={<UploadOutlined />}>Upload Profile</Button>
          </Upload>
        </Form.Item>

        {/* Title */}
        <Form.Item label="Title" name="title">
          <Input placeholder="Input Title of the Site" />
        </Form.Item>

        {/* Address */}
        <Form.Item label="Address" name="address">
          <Input placeholder="Input Address of the School" />
        </Form.Item>

        {/* Contacts */}
        <Form.Item label="Contact" name="contactNumber">
          <Input placeholder="Input Contact Number" />
        </Form.Item>

        {/*Email*/}
        <Form.Item label="Email" name="email">
          <Input placeholder="Input Email" />
        </Form.Item>

        {/* Social Media Section */}
        <Typography.Title level={5}>
          Social Media Accounts Links
        </Typography.Title>
        {/* <Space direction="vertical"> */}
        <Form.Item label="Facebook" name={["accounts", "facebook"]}>
          <Input placeholder="Facebook Link" />
        </Form.Item>
        <Form.Item label="Twitter" name={["accounts", "twitter"]}>
          <Input placeholder="Twitter Link" />
        </Form.Item>
        <Form.Item label="Tiktok" name={["accounts", "tiktok"]}>
          <Input placeholder="Tiktok Link" />
        </Form.Item>
        {/* </Space> */}

        <Button loading={loading} type="primary" onClick={handleUpdate}>
          Update
        </Button>
        {/* </Space> */}
      </Form>
    </div>
  );
};

export default BasicInformation;
