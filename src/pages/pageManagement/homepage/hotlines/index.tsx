import TitlePage from "@/components/titlePage/titlePage";
import {
  Button,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Table,
  TableColumnProps,
  Typography,
  Upload,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import {
  addHomepageInfo,
  deleteHomepageInfo,
  updateHomepageInfo,
} from "@/services/api";
import { STATUS } from "@/utils/constant";
import DeleteButton from "@/components/delButton/delButton";

type Props = {
  data: any;
  onLoad: Function;
};

const Hotlines = ({ data, onLoad }: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [mode, setMode] = useState("");
  const [form] = useForm();
  const [dataHotlines, setDataHotlines] = useState([]);
  const [openModal, setopenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleCloseModal = () => {
    setopenModal(false);
    form.resetFields();
    setLoading(false);
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
      key: "image",
      title: "Image",
      dataIndex: "image",
      render: (imgSrc) => (
        <img
          src={imgSrc}
          style={{ width: "50px", height: "50px", objectFit: "contain" }}
        />
      ),
      align: "center",
      width: 250,
    },
    {
      key: "title",
      title: "Title",
      dataIndex: "title",
      align: "center",
      width: 250,
    },
    {
      key: "hotline_1",
      title: "Contact Number (Globe/Tm)",
      dataIndex: "hotline_1",
      align: "center",
      width: 250,
    },
    {
      key: "hotline_2",
      title: "Contact Number (Smart/Tnt)",
      dataIndex: "hotline_2",
      align: "center",
      width: 250,
    },
    {
      key: "action",
      title: "Action",
      align: "center",
      render: (_value, record) => (
        <Flex align="center" justify="center">
          <Button
            type="link"
            onClick={() => handleOpenModal("editMode", record)}
          >
            Edit
          </Button>
          <DeleteButton
            trigger={() => handleDelete(record)}
            loading={loadingDelete}
          />
          {/* <Button danger size="small" onClick={() => handleDelete(record)}>
            Delete
          </Button> */}
        </Flex>
      ),
    },
  ];
  const handleSubmit = async () => {
    try {
      const currValues = form.getFieldsValue();
      setLoading(true);
      const params = {
        ...currValues,
        section: "hotlines",
      };
      if (mode === "addMode") {
        const res = await addHomepageInfo(params);

        if (res.status === STATUS.SUCCESS) {
          handleCloseModal();
          onLoad();
          setLoading(false);
          messageApi.success("Hotline Added");
        }
      } else {
        const res = await updateHomepageInfo({ ...params });

        if (res.status === STATUS.SUCCESS) {
          handleCloseModal();
          onLoad();
          setLoading(false);
          messageApi.success("Update Success");
        }
      }
    } catch (error) {
      messageApi.error("An error occurred while processing the request.");
      console.error(error);
    } finally {
      setLoading(true);
    }
  };

  const handleOpenModal = (mode: string, records?: any) => {
    setopenModal(true);
    setMode(mode);

    if (mode === "editMode")
      form.setFieldsValue({ ...records, hotlinesId: records._id });
  };

  const handleDelete = async (records: any) => {
    const { _id, imagePublicId } = records;
    setLoadingDelete(true);
    const res = await deleteHomepageInfo({
      idSectionData: _id,
      imagePublicId,
      section: "hotlines",
    });

    if (res.status === STATUS.SUCCESS) {
      setLoadingDelete(false);
      onLoad();
      messageApi.success("Hotline Deleted");
    }
  };

  useEffect(() => {
    setDataHotlines(
      data?.hotlines?.map((items: any) => ({ ...items, key: items.id }))
    );
  }, [data]);

  return (
    <div>
      {contextHolder}
      <TitlePage title="Hotlines Section" />
      <Button type="primary" onClick={() => handleOpenModal("addMode")}>
        Add Hotline
      </Button>
      <Table columns={columns} dataSource={dataHotlines} size="small" />
      <Modal
        title="Add Hotlines"
        open={openModal}
        onCancel={handleCloseModal}
        onClose={handleCloseModal}
        footer={[
          <Button
            type="primary"
            onClick={handleSubmit}
            key="submit-btn"
            loading={loading}
          >
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
          <Form.Item name="hotlinesId" style={{ display: "none" }}>
            <Input type="hidden" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Hotlines;
