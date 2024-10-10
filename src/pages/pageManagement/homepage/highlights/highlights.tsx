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
  Popconfirm,
  PopconfirmProps,
} from "antd";
import React, { useEffect, useState } from "react";
import { InfoCircleOutlined, UploadOutlined } from "@ant-design/icons";
import {
  deleteHomepageInfo,
  homepageInfo,
  addHomepageInfo,
  updateHomepageInfo,
} from "@/services/api";
import TextArea from "antd/es/input/TextArea";
import style from "./style.module.scss";
import { STATUS } from "@/utils/constant";

const { Title } = Typography;

interface Props {
  data: any;
  onLoad: Function;
}
const Highlights = ({ data, onLoad }: Props) => {
  const [form] = Form.useForm();
  const [mode, setMode] = useState("");
  const [dataHighlights, setDataHighlights] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loadingAddBtn, setloadingAddBtn] = useState(false);
  const [totalHighlightsDisplayed, setTotalHighlightsDisplayed] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();

  const columns: TableColumnProps[] = [
    {
      key: "image",
      title: "Image",
      align: "center",
      dataIndex: "image",
      width: 100,
      render: (value) => (
        <img src={value} className={style.imgClass} alt="highlight_image" />
      ),
    },
    { key: "title", title: "Title", align: "center", dataIndex: "title" },
    { key: "content", title: "Content", align: "center", dataIndex: "content" },
    { key: "sorted", title: "Sort", align: "center", dataIndex: "sorted" },
    {
      key: "display",
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
      key: "action",
      title: "Action",
      align: "center",
      width: 150,
      render: (_value, records) => (
        <Flex align="center" justify="center">
          <Button
            size="small"
            type="link"
            onClick={() => handleEdit(records, "editMode")}
          >
            Edit
          </Button>
          <Popconfirm
            placement="left"
            title="Delete the highlight"
            description="Are you sure to delete this highlight?"
            onConfirm={() => confirmDelete(records)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  const confirmDelete: PopconfirmProps["onConfirm"] = (records: {}) => {
    handleDelete(records);
  };

  const handleOpenModal = (mode: string) => {
    setMode(mode);
    form.resetFields();
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    form.resetFields();
    setOpenModal(false);
    setloadingAddBtn(false);
  };

  const modalFormLayout = {
    wrapperCol: { span: 14 },
    labelCol: { span: 2 },
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

  const handleSubmit = async () => {
    try {
      const params = form.getFieldsValue();

      if (mode === "addMode") {
        if (totalHighlightsDisplayed === 5 && params.display === 1) {
          messageApi.warning("Maximum of 5 highlights displayed only");
          return;
        }
        setloadingAddBtn(true);
        const res = await addHomepageInfo({ ...params, section: "highlights" });
        if (res.status === STATUS.SUCCESS) {
          messageApi.success("Highlight Added");
          setOpenModal(false);
          onLoad();
        }
      } else {
        if (totalHighlightsDisplayed >= 5 && params.display === 1) {
          messageApi.warning("Maximum of 5 highlights displayed only");
          return;
        }
        const res = await updateHomepageInfo({
          ...params,
          section: "highlights",
        });
        if (res.status === STATUS.SUCCESS) {
          messageApi.success("Highlight Updated");
          setOpenModal(false);
          onLoad();
        }
      }
    } catch (error) {
      messageApi.error("An error occurred while processing the request.");
      console.error(error);
    } finally {
      setloadingAddBtn(false);
    }
  };
  // const onLoad = () => {
  //   homepageInfo({}).then((res) => {
  //     const highlights = res.data[0].highlights;
  //     setTotalHighlightsDisplayed(
  //       res.data[0].highlights.filter((o: any) => o.display === "1").length
  //     );

  //     setDataHighlights(
  //       highlights.map((items: any) => ({ ...items, key: items.id }))
  //     );
  //   });
  // };

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

  const handleEdit = (records: any, mode: string) => {
    setMode(mode);
    setOpenModal(true);

    form.setFieldsValue({
      display: Number(records.display),
      content: records.content,
      title: records.title,
      sorted: records.sorted,
      image: records.image,
      highlightsId: records._id,
    });
  };

  useEffect(() => {
    setTotalHighlightsDisplayed(
      data?.highlights?.filter((o: any) => o.display === "1").length
    );

    setDataHighlights(
      data?.highlights?.map((items: any) => ({ ...items, key: items.id }))
    );
  }, [data]);

  return (
    <div>
      {contextHolder}
      <div>
        <Title level={4}>Highlights Section</Title>
        <div style={{ marginBottom: "10px" }}>
          <InfoCircleOutlined />
          <span style={{ marginLeft: "10px" }}>Note</span>
          <ul style={{ marginLeft: "17px", marginTop: "10px" }}>
            <li>
              Uploaded photos will be shown in slideshow in highlight section{" "}
            </li>
            <li>Maximum of 5 can can only be displayed</li>
            <li>If only 1 image is uploaded, it will be shown as static</li>
          </ul>
        </div>
        <Button type="primary" onClick={() => handleOpenModal("addMode")}>
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
        title={mode === "addMode" ? "Add Highlight" : "Edit Highlight"}
        onClose={handleCloseModal}
        onCancel={handleCloseModal}
        destroyOnClose
        width={800}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            loading={loadingAddBtn}
          >
            Submit
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
            <Radio.Group>
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
          <Form.Item name="highlightsId" style={{ display: "none" }}>
            <Input type="hidden" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Highlights;
