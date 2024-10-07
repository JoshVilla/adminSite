import TitlePage from "@/components/titlePage/titlePage";
import {
  Button,
  Modal,
  Table,
  TableColumnProps,
  Typography,
  Form,
  Input,
  InputNumber,
  Radio,
  RadioChangeEvent,
  Upload,
  message,
  Tag,
  Flex,
} from "antd";
import React, { useEffect, useState } from "react";
import { InfoCircleOutlined, UploadOutlined } from "@ant-design/icons";
import {
  deleteHomepageInfo,
  homepageInfo,
  updateHomepageInfo,
} from "@/services/api";
import TextArea from "antd/es/input/TextArea";
import style from "./style.module.scss";
import { STATUS } from "@/utils/constant";

const { Title } = Typography;
const Homepage = () => {
  const [form] = Form.useForm();
  const [dataHighlights, setDataHighlights] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [displayValue, setDisplayValue] = useState(1);
  const [loadingAddBtn, setloadingAddBtn] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const columns: TableColumnProps[] = [
    {
      key: 1,
      title: "Image",
      align: "center",
      dataIndex: "image",
      width: 100,
      render: (value) => (
        <img src={value} className={style.imgClass} alt="highlight_image" />
      ),
    },
    { key: 2, title: "Title", align: "center", dataIndex: "title" },
    { key: 3, title: "Content", align: "center", dataIndex: "content" },
    { key: 4, title: "Sort", align: "center", dataIndex: "sorted" },
    {
      key: 5,
      title: "Display",
      align: "center",
      dataIndex: "display",
      render: (value) => (
        <Tag color={value === "0" ? "default" : "success"}>
          {value === "0" ? "Hidden" : "Displayed"}
        </Tag>
      ),
      width: 150,
    },
    {
      key: 6,
      title: "Action",
      align: "center",
      width: 150,
      render: (_value, records) => (
        <Flex align="center" justify="center">
          <Button size="small" type="link" onClick={() => handleEdit(records)}>
            Edit
          </Button>
          <Button size="small" danger onClick={() => handleDelete(records)}>
            Delete
          </Button>
        </Flex>
      ),
    },
  ];

  const handleOpenModal = () => {
    form.resetFields();
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    form.resetFields();
    setDisplayValue(1);
    setOpenModal(false);
    setloadingAddBtn(false);
  };

  const modalFormLayout = {
    wrapperCol: { span: 14 },
    labelCol: { span: 2 },
  };

  const handleDisplayValue = (e: RadioChangeEvent) => {
    setDisplayValue(e.target.value);
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

  const handleAddHighlight = () => {
    const params = form.getFieldsValue();
    setloadingAddBtn(true);

    updateHomepageInfo({ ...params, section: "highlights" })
      .then((res: any) => {
        if (res.status === STATUS.SUCCESS) {
          messageApi.success("Highlight Added");
          setloadingAddBtn(false);
          setOpenModal(false);
          onLoad();
        }
      })
      .catch((err) => console.log(err));
  };

  const onLoad = () => {
    homepageInfo({}).then((res) => {
      const highlights = res.data[0].highlights;
      setDataHighlights(
        highlights.map((items: any) => ({ ...items, key: items.id }))
      );
    });
  };

  const handleDelete = (records: any) => {
    const { _id, imagePublicId } = records;
    const params = {
      section: "highlights",
      idSectionData: _id,
      imagePublicId,
    };
    deleteHomepageInfo(params).then((res) => {
      if (res.status === 200) {
        messageApi.success("Delete Successfully");
        onLoad();
      }
    });
  };

  const handleEdit = (records) => {
    console.log(records);
    setOpenModal(true);
    form.setFieldsValue({
      display: Number(records.display),
      content: records.content,
      title: records.title,
      sorted: records.sorted,
      image: records.image,
    });
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <div>
      {contextHolder}
      <TitlePage title="Homepage" />
      <div>
        <Title level={4}>Highlights Section</Title>
        <div style={{ marginBottom: "10px" }}>
          <InfoCircleOutlined />
          <span style={{ marginLeft: "10px" }}>Note</span>
          <ul style={{ marginLeft: "17px", marginTop: "10px" }}>
            <li>
              Uploaded photos will be shown in slideshow in highlight section{" "}
            </li>
            <li>Maximum of 5 can upload images</li>
            <li>If only 1 image is uploaded, it will be shown as static</li>
          </ul>
        </div>
        <Button type="primary" onClick={handleOpenModal}>
          Add Highlights
        </Button>
        <Table
          size="small"
          columns={columns}
          dataSource={dataHighlights}
          style={{ marginTop: "30px" }}
        />
      </div>
      <Modal
        open={openModal}
        title="Add Highlights"
        onClose={handleCloseModal}
        onCancel={handleCloseModal}
        destroyOnClose
        width={800}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={handleAddHighlight}
            loading={loadingAddBtn}
          >
            Add
          </Button>,
        ]}
      >
        <Form
          form={form}
          {...modalFormLayout}
          initialValues={{
            display: 1,
            title: "",
            content: "",
            sorted: 1,
            image: "",
          }}
        >
          <Form.Item name="title" label="Title">
            <Input placeholder="Input Title" />
          </Form.Item>
          <Form.Item name="content" label="Content">
            <TextArea placeholder="Input Content" />
          </Form.Item>
          <Form.Item name="sorted" label="Sort">
            <InputNumber type="number" />
          </Form.Item>
          <Form.Item name="display" label="Display?">
            <Radio.Group onChange={handleDisplayValue}>
              <Radio value={1}>Yes</Radio>
              <Radio value={0}>No</Radio>
            </Radio.Group>
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

export default Homepage;
