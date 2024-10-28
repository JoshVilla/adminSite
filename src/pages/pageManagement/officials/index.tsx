import CImage from "@/components/image/image";
import Refresh from "@/components/refresh/refresh";
import TitlePage from "@/components/titlePage/titlePage";
import {
  addOfficials,
  deleteOfficial,
  getOfficials,
  updateOfficial,
} from "@/services/api";
import {
  Button,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Select,
  Table,
  Tag,
  Upload,
} from "antd";
import { ColumnProps } from "antd/es/table";
import React, { useEffect, useMemo, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { STATUS } from "@/utils/constant";
import DeleteButton from "@/components/delButton/delButton";
import { OfficalProps } from "./interface";

const PostionList = [
  { value: "", label: "All" },
  { value: "Mayor", label: "Mayor" },
  { value: "Vice Mayor", label: "Vice Mayor" },
  { value: "Councilor", label: "Councilor" },
];

const Officials = () => {
  const [searchForm] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [data, setData] = useState<OfficalProps[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [profile, setProfile] = useState("");
  const [mode, setMode] = useState("");
  const [loaders, setLoaders] = useState({
    loadTable: false,
    loadForm: false,
    loadDelete: false,
  });

  const formLayout = {
    wrapperCol: { span: 16 },
  };

  const columns: ColumnProps<OfficalProps>[] = [
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
      render: (position) => (
        <Tag color={colorCodePosition(position)}>{position}</Tag>
      ),
    },
    {
      key: "action",
      title: "Actions",
      dataIndex: "action",
      width: 200,
      render: (_, records: OfficalProps) => {
        return (
          <Flex align="center">
            <Button
              type="link"
              onClick={() => handleOpenModal("editMode", records)}
            >
              Edit
            </Button>
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
      const officialData = response.data.data;
      setData(officialData);
    } catch (error) {
      console.error("Error fetching officials:", error);
    } finally {
      setLoaders((prev) => ({
        ...prev,
        loadTable: false,
      }));
    }
  };

  const handleOpenModal = (modeSubmit: string, records?: OfficalProps) => {
    setMode(modeSubmit);
    setOpenModal(true);
    if (records) {
      const { name, position, _id } = records;
      console.log(name, position, _id);
      modalForm.setFieldsValue({
        name,
        position,
        id: _id,
      });
    }
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
    const { name, position, id } = modalForm.getFieldsValue();

    if (!name) return message.warning("Please input a name");

    setLoaders((prev) => ({ ...prev, loadForm: true }));

    const isAddMode = mode === "addMode";

    const getLevel = (position: string): number | null => {
      switch (position) {
        case "Mayor":
          return 3;
        case "Vice Mayor":
          return 2;
        case "Councilor":
          return 1;
        default:
          return null;
      }
    };

    const payload = {
      id: !isAddMode ? id : undefined,
      name,
      level: getLevel(position),
      position,
      profile,
    };

    try {
      const response = isAddMode
        ? await addOfficials(payload)
        : await updateOfficial(payload);
      if (response.status === STATUS.SUCCESS) {
        message.success(response.data.message);
        handleCloseModal();
        onLoad();
      }
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setLoaders((prev) => ({ ...prev, loadForm: false }));
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

  const colorCodePosition = (
    val: "Mayor" | "Vice Mayor" | "Councilor"
  ): string | undefined => {
    const colorMap: { [key in "Mayor" | "Vice Mayor" | "Councilor"]: string } =
      {
        Mayor: "blue",
        "Vice Mayor": "green",
        Councilor: "purple",
      };

    return colorMap[val];
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
            <Button type="primary" onClick={() => handleOpenModal("addMode")}>
              Add Official
            </Button>
            <Refresh call={onLoad} />
          </Flex>
        </div>
        <div style={{ marginTop: "20px" }}>
          <Table
            size="small"
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
        title={mode === "addMode" ? `Add Official` : "Edit Official"}
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
            id: "",
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
          <Form.Item name="id" style={{ display: "none" }}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Officials;
