import TitlePage from "@/components/titlePage/titlePage";
import React, { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  message,
  Space,
  Typography,
  Upload,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { addStory } from "@/services/api";

const TopStories = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [disableBtn, setDisableBtn] = useState(true);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log("Form Values Updated:", form.getFieldsValue());
  }, [form]);

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
            beforeUpload={() => false} // disable auto-upload
            onChange={(info) => uploadOnchangeItem(info, subField.name)} // pass field key
          >
            <div>+ Upload</div>
          </Upload>
        </Form.Item>
      );
    }
    return null;
  };

  const uploadOnchange = (info: any) => {
    const { file } = info;

    const reader = new FileReader();
    reader.onload = () => {
      const currentValues = form.getFieldsValue();
      form.setFieldsValue({
        ...currentValues,
        thumbnail: file,
      });
    };
    reader.readAsDataURL(file);
  };

  const uploadOnchangeItem = (info: any, fieldKey: any) => {
    const { fileList } = info;

    // Extracting necessary fields (e.g., uid and originFileObj)
    const formattedFileList = fileList.map((file: any) => ({
      uid: file.uid,
      name: file.name,
      originFileObj: file.originFileObj, // Keep this for uploading
    }));

    // Update the corresponding image field in the form
    form.setFieldsValue({
      items:
        form.getFieldValue("items").map((item: any, index: number) => {
          if (index === fieldKey) {
            return { ...item, image: formattedFileList }; // Set the entire formatted list
          }
          return item;
        }) || [],
    });
  };

  const handleAdd = () => {
    const data = form.getFieldsValue();
    setLoading(true);
    // Send formData in a single request
    addStory(data)
      .then((res) => {
        messageApi.success(res.data.message);
      })
      .catch((err) => {
        console.error("Error:", err.response ? err.response.data : err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      {contextHolder}
      <TitlePage title="Top Stories" />
      <Flex>
        <div>asd</div>
        <Form
          form={form}
          onFieldsChange={() => {
            const items = form.getFieldsValue()?.items;
            setDisableBtn(items?.length === 0);
          }}
          name="dynamic_form"
          style={{ maxWidth: 600 }}
          autoComplete="off"
          initialValues={{ items: [] }}
        >
          <Form.Item label="Title" name="title">
            <Input placeholder="Enter a title" />
          </Form.Item>
          <Form.Item label="Thumbnail" name="thumbnail">
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false} // disable auto-upload
              onChange={uploadOnchange}
            >
              <div>+ Upload</div>
            </Upload>
          </Form.Item>
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <div
                style={{ display: "flex", flexDirection: "column", rowGap: 16 }}
              >
                {fields.map((field) => (
                  <Card
                    size="small"
                    title={`Item ${field.key + 1}`}
                    key={field.key}
                    extra={<CloseOutlined onClick={() => remove(field.name)} />}
                  >
                    {renderFormItem(field)}
                  </Card>
                ))}

                <Space>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add({ type: "paragraph" }); // Add paragraph
                    }}
                  >
                    + Add Paragraph
                  </Button>

                  <Button
                    type="dashed"
                    onClick={() => {
                      add({ type: "image" }); // Add image
                    }}
                    disabled
                  >
                    + Add Image
                  </Button>
                </Space>
                <Button
                  type="primary"
                  disabled={disableBtn}
                  loading={loading}
                  onClick={handleAdd}
                >
                  Add
                </Button>
              </div>
            )}
          </Form.List>

          {/* <Form.Item noStyle shouldUpdate>
            {() => {
              return (
                <Typography>
                  <pre>{JSON.stringify(form.getFieldsValue(), null, 1)}</pre>
                </Typography>
              );
            }}
          </Form.Item> */}
        </Form>
      </Flex>
    </div>
  );
};

export default TopStories;
