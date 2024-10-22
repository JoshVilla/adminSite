import TitlePage from "@/components/titlePage/titlePage";
import React, { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import style from "./style.module.scss";
import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  message,
  Space,
  Upload,
  DatePicker,
  DatePickerProps,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { addStory, deleteStory, getStory, updateStory } from "@/services/api";
import DeleteButton from "@/components/delButton/delButton";
import { STATUS } from "@/utils/constant";
import { combineClassNames } from "@/utils/helpers";
import { IStoryList } from "./interface";

const { RangePicker } = DatePicker;

const TopStories = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [storyList, setStoryList] = useState<IStoryList[]>([]);
  const [selectedStory, setSelectedStory] = useState<IStoryList | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activeList, setActiveList] = useState<Number | null>(null);

  useEffect(() => {
    onLoad();
  }, []);

  // Reset form when selectedStory changes (ensures proper form state)
  useEffect(() => {
    if (selectedStory) {
      form.setFieldsValue({
        title: selectedStory?.title || "",
        thumbnail: selectedStory?.thumbnail
          ? [{ uid: "-1", name: "thumbnail.jpg", url: selectedStory.thumbnail }]
          : [],
        items:
          selectedStory?.content?.map((item: any) => JSON.parse(item)) || [],
      });
    } else {
      form.resetFields(); // Reset form for a new story
    }
  }, [selectedStory, form]);

  const uploadOnChange = (info: any, fieldKey = null) => {
    const { fileList } = info;

    const formattedFileList = fileList.map((file: any) => ({
      uid: file.uid,
      name: file.name,
      originFileObj: file.originFileObj, // Include the actual file object here
    }));

    // If this is for the main thumbnail
    if (fieldKey === null) {
      form.setFieldsValue({
        thumbnail: formattedFileList[0]?.originFileObj, // Set the actual file object for thumbnail
      });
    } else {
      // If this is for an image inside a dynamic item
      form.setFieldsValue({
        items: form.getFieldValue("items").map((item: any, index: number) =>
          index === fieldKey
            ? { ...item, image: formattedFileList[0]?.originFileObj } // Set the actual file object in the dynamic item
            : item
        ),
      });
    }
  };

  const handleAddOrUpdateStory = () => {
    form.validateFields().then((data) => {
      if (!selectedStory) {
        setLoading(true);
        addStory(data)
          .then((res) => {
            messageApi.success(res.data.message);
            resetForm(); // Reset form on success
            refreshStories(); // Reload stories
          })
          .catch((err) => console.error("Error:", err.response?.data || err))
          .finally(() => setLoading(false));
      } else {
        const id = selectedStory._id;
        const thumbnailPublicId = selectedStory.thumbnailPublicId;

        setLoading(true);
        updateStory({
          id,
          ...data,
          currentThumbnailPublicId: thumbnailPublicId,
        })
          .then((res) => {
            setActiveList(null);
            messageApi.success(res.data.message);
            resetForm(); // Reset form on success
            refreshStories(); // Reload stories
          })
          .catch((err) => console.error("Error:", err.response?.data || err))
          .finally(() => setLoading(false));
      }
    });
  };

  const resetForm = () => {
    setSelectedStory(null);
    form.resetFields(); // Ensures form is reset after submission
  };

  const refreshStories = () => {
    getStory({}).then((res) => setStoryList(res.data));
  };

  const handleEditStory = (story: any) => {
    setSelectedStory(story);
  };

  const renderFormItem = (subField: any) => {
    const type = form.getFieldValue(["items", subField.name, "type"]);

    if (type === "paragraph") {
      return (
        <Form.Item
          name={[subField.name, "paragraph"]}
          rules={[{ required: true, message: "Please enter a paragraph!" }]}
        >
          <TextArea placeholder="Insert Paragraph" />
        </Form.Item>
      );
    }

    if (type === "image") {
      return (
        <Form.Item
          name={[subField.name, "image"]}
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            beforeUpload={() => false}
            onChange={(info) => uploadOnChange(info, subField.name)}
          >
            <div>+ Upload</div>
          </Upload>
        </Form.Item>
      );
    }

    return null;
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const id = selectedStory?._id;
      const thumbnailPublicId = selectedStory?.thumbnailPublicId;
      const response = await deleteStory({ id, thumbnailPublicId });
      if (response.status === 200) {
        setDeleteLoading(false);
        onLoad();
        resetForm();
        messageApi.success(response.data.message);
      }
    } catch (err) {
      setDeleteLoading(false);
      console.log(err);
    }
  };

  const onLoad = async (params = {}) => {
    await getStory(params)
      .then((res) => {
        if (res.status === STATUS.SUCCESS) {
          setStoryList(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onReset = () => {
    searchForm.resetFields();
    onLoad({});
  };

  const onSearch = () => {
    const searchParams = searchForm.getFieldsValue();
    const { title, date } = searchParams;

    if (date && date.length === 2) {
      const [startDate, endDate] = date;
      console.log("Start Date:", startDate);
      console.log("End Date:", endDate);
      onLoad({ title, date: [startDate, endDate] });
    } else {
      onLoad({ title });
    }

    console.log(searchForm.getFieldsValue());
  };

  const onChangeDate: DatePickerProps<any>["onChange"] = (
    dates,
    dateStrings
  ) => {
    searchForm.setFieldValue("date", dateStrings); // Just store the raw date strings in the form
  };

  return (
    <div>
      {contextHolder}
      <TitlePage title="Top Stories" />
      <Space align="start" size="large">
        <div style={{ width: 400 }}>
          <Space direction="vertical" size="middle">
            <Button
              style={{ width: 300 }}
              type="primary"
              onClick={() => {
                resetForm();
                setActiveList(null);
              }} // Open for a new story (reset form)
            >
              + Add Story
            </Button>
            <Form form={searchForm} initialValues={{ title: "", date: [] }}>
              <Form.Item name="title">
                <Input placeholder="Search Title" />
              </Form.Item>
              <Form.Item>
                <RangePicker onChange={onChangeDate} />
              </Form.Item>
              <Flex gap={5}>
                <Button type="primary" size="small" onClick={onSearch}>
                  Search
                </Button>
                <Button color="primary" size="small" onClick={onReset}>
                  Reset
                </Button>
              </Flex>
            </Form>
            {storyList.map((list: any, idx) => (
              <li
                key={idx}
                className={combineClassNames([
                  style.storyList,
                  idx === activeList ? style.active : null,
                ])}
                onClick={() => {
                  handleEditStory(list);
                  setActiveList(idx);
                }}
              >
                <div className={style.title}>{list.title}</div>
                <div className={style.date}>{list.createdAt}</div>
              </li>
            ))}
          </Space>
        </div>

        <div>
          <Flex align="center" justify="space-between">
            <TitlePage title={selectedStory ? "Edit Story" : "Add Story"} />
            {selectedStory && (
              <DeleteButton loading={deleteLoading} trigger={handleDelete} />
            )}
          </Flex>
          <Form
            form={form}
            name="dynamic_form"
            style={{ width: 600 }}
            autoComplete="off"
            initialValues={{
              title: "",
              thumbnail: [],
              items: [],
            }}
          >
            <Form.Item label="Title" name="title">
              <Input placeholder="Enter a title" />
            </Form.Item>

            <Form.Item label="Thumbnail" name="thumbnail">
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false}
                onChange={uploadOnChange}
              >
                <div>+ Upload</div>
              </Upload>
            </Form.Item>

            <Form.List name="items">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Card
                      size="small"
                      title={`Item ${field.key + 1}`}
                      key={field.key}
                      extra={
                        <CloseOutlined onClick={() => remove(field.name)} />
                      }
                    >
                      {renderFormItem(field)}
                    </Card>
                  ))}

                  <Space size="middle">
                    <Button
                      type="dashed"
                      onClick={() => add({ type: "paragraph" })}
                    >
                      + Add Paragraph
                    </Button>

                    {/* <Button
                      disabled
                      type="dashed"
                      onClick={() => add({ type: "image" })}
                    >
                      + Add Image
                    </Button> */}
                  </Space>

                  <Button
                    type="primary"
                    disabled={!form.getFieldValue("items").length}
                    loading={loading}
                    onClick={handleAddOrUpdateStory}
                  >
                    {selectedStory ? "Update Story" : "Add Story"}
                  </Button>
                </>
              )}
            </Form.List>
          </Form>
        </div>
      </Space>
    </div>
  );
};

export default TopStories;
