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
  const [openModal, setOpenModal] = useState(false);
  const [profile, setProfile] = useState("");
  const [loaders, setLoaders] = useState({
    loadTable: false,
    loadForm: false,
    loadDelete: false,
  });
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
              trigger={() => onDelete(records)}
              loading={loaders.loadDelete}
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
    setLoaders((prev) => ({
      ...prev,
      loadTable: true,
    }));
    const params = searchForm.getFieldsValue();
    try {
      const response = await getOfficials(params);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching officials:", error);
    } finally {
      setLoaders((prev) => ({
        ...prev,
        loadTable: false,
      }));
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
    setLoaders((prev) => ({
      ...prev,
      loadForm: true,
    }));
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
      setLoaders((prev) => ({
        ...prev,
        loadForm: false,
      }));
    }
  };

  const onDelete = async (records: any) => {
    const { _id, profilePublicId } = records;
    setLoaders((prev) => ({
      ...prev,
      loadDelete: true,
    }));
    try {
      const response = await deleteOfficial({ id: _id, profilePublicId });
      if (response.status === STATUS.SUCCESS) {
        message.success(response.data.message);
        onLoad();
      }
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setLoaders((prev) => ({
        ...prev,
        loadDelete: false,
      }));
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
          <Table
            columns={columns}
            dataSource={data}
            loading={loaders.loadTable}
          />
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
            loading={loaders.loadForm}
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
