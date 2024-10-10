import TitlePage from "@/components/titlePage/titlePage";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Table,
  TableColumnProps,
  Upload,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { UploadOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { addHomepageInfo } from "@/services/api";
import { STATUS } from "@/utils/constant";

type Props = {};

const Hotlines = (props: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = useForm();
  const [openModal, setopenModal] = useState(false);

  const handleCloseModal = () => {
    setopenModal(false);
  };
  const uploadOnchange = (info: any) => {
    const { file } = info;
    if (file.status === "done") {
      const reader = new FileReader();
      reader.onload = () => {
        const currentValues = form.getFieldsValue();
        form.setFieldsValue({
          ...currentValues,
          image: file.originFileObj,
        });
      };
      reader.readAsDataURL(file.originFileObj);
    }
  };

  const beforeUpload = (file: any) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }
    return isImage || Upload.LIST_IGNORE;
  };

  const columns: TableColumnProps[] = [
    {
      key: "title",
      title: "Title",
    },
  ];
  const handleAdd = async () => {
    const currValues = form.getFieldsValue();
    const params = {
      ...currValues,
      section: "hotlines",
    };

    const res = await addHomepageInfo(params);

    if (res.status === STATUS.SUCCESS) {
      setopenModal(false);
      messageApi.success("");
    }
  };

  return (
    <div>
      {contextHolder}
      <TitlePage title="Hotlines Section" />
      <Button type="primary" onClick={() => setopenModal(true)}>
        Add Hotline
      </Button>
      <Table columns={columns} />
      <Modal
        title="Add Hotlines"
        open={openModal}
        onCancel={handleCloseModal}
        onClose={handleCloseModal}
        footer={[
          <Button type="primary" onClick={handleAdd} key="submit-btn">
            Submit
          </Button>,
        ]}
      >
        <Form
          form={form}
          initialValues={{
            title: "",
            hotline_1: "",
            hotline_2: "",
            image: "",
          }}
        >
          <Form.Item label="Name" name="title">
            <Input placeholder="Enter Name" />
          </Form.Item>
          <Form.Item label="Contact Number (Globe/TM)" name="hotline_1">
            <Input placeholder="Enter Contact Number" />
          </Form.Item>
          <Form.Item label="Contact Number (Smart/TNT)" name="hotline_2">
            <Input placeholder="Enter Contact Number" />
          </Form.Item>
          <Form.Item name="image" label="Image">
            <Upload
              onChange={uploadOnchange}
              beforeUpload={beforeUpload}
              maxCount={1}
              customRequest={({ file, onSuccess }) => {
                // Check if onSuccess is defined before calling it
                if (onSuccess) {
                  setTimeout(() => {
                    onSuccess("ok"); // Simulate a successful upload
                  }, 0);
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Profile</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Hotlines;
