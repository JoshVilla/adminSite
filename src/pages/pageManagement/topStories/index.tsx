import TitlePage from "@/components/titlePage/titlePage";
import React, { useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Space, Typography, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";

const TopStories = () => {
  const [form] = Form.useForm();

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
          >
            <div>+ Upload</div>
          </Upload>
        </Form.Item>
      );
    }

    return null;
  };

  return (
    <div>
      <TitlePage title="Top Stories" />
      <Form
        form={form}
        name="dynamic_form"
        style={{ maxWidth: 600 }}
        autoComplete="off"
        initialValues={{ items: [] }}
      >
        <Form.Item label="Title" name="title">
          <Input placeholder="Enter a title" />
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
                >
                  + Add Image
                </Button>
              </Space>
            </div>
          )}
        </Form.List>

        <Form.Item noStyle shouldUpdate>
          {() => (
            <Typography>
              <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
            </Typography>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default TopStories;
