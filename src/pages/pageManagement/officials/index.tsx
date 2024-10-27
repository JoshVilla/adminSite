import CImage from "@/components/image/image";
import Refresh from "@/components/refresh/refresh";
import TitlePage from "@/components/titlePage/titlePage";
import { addOfficials, deleteOfficial, getOfficials } from "@/services/api";
import {
  Button,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Select,
  Table,
  Upload,
} from "antd";
import { ColumnProps } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { STATUS } from "@/utils/constant";
import DeleteButton from "@/components/delButton/delButton";

const PostionList = [
  { value: "", label: "All" },
  { value: "Mayor", label: "Mayor" },
  { value: "Vice Mayor", label: "Vice Mayor" },
  { value: "Councilor", label: "Councilor" },
];

const Officials = () => {
  const [searchForm] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [data, setData] = useState([]);
  const [loadTable, setLoadTable] = useState(false);
  const [loadForm, setLoadForm] = useState(false);
  const [loadDelete, setLoadDelete] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [profile, setProfile] = useState("");
  const formLayout = {
    wrapperCol: { span: 16 },
  };

  const columns: ColumnProps[] = [
    {
      key: "profile",
      title: "Profile",
      dataIndex: "profile",
      render: (profile) => <CImage imageUrl={profile} />,
    },
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
    },
    {
      key: "position",
      title: "Position",
      dataIndex: "position",
    },
    {
      key: "action",
      title: "Actions",
      dataIndex: "action",
      width: 200,
      render: (_, records) => {
        return (
          <Flex align="center">
            <Button type="link">Edit</Button>
            <DeleteButton
              trigger={() => onDelete(records._id)}
              loading={loadDelete}
            />
          </Flex>
        );
      },
    },
  ];

  const handleSearch = () => onLoad();

  const handleReset = () => {
    searchForm.resetFields();
    onLoad();
  };

  const onLoad = async () => {
    setLoadTable(true);
    const params = searchForm.getFieldsValue();
    try {
      const response = await getOfficials(params);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching officials:", error);
    } finally {
      setLoadTable(false);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    modalForm.resetFields();
  };

  const uploadOnChange = (info: any) => {
    const { file } = info;

    if (file.status === "done") {
      setProfile(file.originFileObj); // Set logo to the uploaded file
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }
    return isImage || Upload.LIST_IGNORE;
  };

  const handleSubmitForm = async () => {
    setLoadForm(true);
    let level: number | null = null;
    const { name, position } = modalForm.getFieldsValue();
    switch (position) {
      case "Mayor":
        level = 3;
        break;
      case "Vice Mayor":
        level = 2;
        break;
      case "Councilor":
        level = 1;
        break;
      default:
        break;
    }

    const payload = {
      name,
      level,
      position,
      profile,
    };

    try {
      const response = await addOfficials(payload);
      if (response.status === STATUS.SUCCESS) {
        message.success(response.data.message);
        handleCloseModal();
        onLoad();
      }
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setLoadForm(false);
    }
  };

  const onDelete = async (id: string) => {
    setLoadDelete(true);
    try {
      const response = await deleteOfficial({ id });
      if (response.status === STATUS.SUCCESS) {
        message.success(response.data.message);
        onLoad();
      }
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setLoadDelete(false);
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <div>
      <TitlePage title="Officials" />
      <div style={{ marginTop: "10px" }}>
        <Form
          {...formLayout}
          form={searchForm}
          onFinish={handleSearch}
          initialValues={{
            name: "",
            position: "",
          }}
        >
          <Flex gap={10}>
            <Form.Item label="Name" name="name">
              <Input placeholder="Enter Name" />
            </Form.Item>
            <Form.Item label="Position" name="position">
              <Select style={{ width: 150 }} showSearch options={PostionList} />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
            <Button onClick={handleReset}>Reset</Button>
          </Flex>
        </Form>
        <div>
          <Flex align="center" gap={10}>
            <Button type="primary" onClick={handleOpenModal}>
              Add Official
            </Button>
            <Refresh call={onLoad} />
          </Flex>
        </div>
        <div style={{ marginTop: "20px" }}>
          <Table columns={columns} dataSource={data} loading={loadTable} />
        </div>
      </div>
      <Modal
        destroyOnClose
        open={openModal}
        onClose={handleCloseModal}
        onCancel={handleCloseModal}
        title="Add Official"
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmitForm}
            loading={loadForm}
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          form={modalForm}
          initialValues={{
            name: "",
            position: "Mayor",
            profile: "",
          }}
        >
          <Form.Item label="Profile" name="profile">
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
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Name" name="name">
            <Input placeholder="Enter Name" />
          </Form.Item>
          <Form.Item label="Position" name="position">
            <Select
              style={{ width: 150 }}
              showSearch
              options={PostionList.filter((o) => o.label !== "All")}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Officials;
