import TitlePage from "@/components/titlePage/titlePage";
import React from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Space, Typography, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";

type Props = {};

const TopStories = (props: Props) => {
  const [form] = Form.useForm();

  return (
    <div>
      <TitlePage title="Top Stories" />
      <Form
        form={form}
        name="dynamic_form_complex"
        style={{ maxWidth: 600 }}
        autoComplete="off"
        initialValues={{ items: [{}] }}
      >
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <div
              style={{ display: "flex", flexDirection: "column", rowGap: 16 }}
            >
              {fields.map((field) => (
                <Card
                  size="small"
                  title={`Add Content`}
                  key={field.key}
                  extra={<CloseOutlined onClick={() => remove(field.name)} />}
                >
                  <Form.Item label="Content">
                    <Form.List name={[field.name, "content"]}>
                      {(subFields, subOpt) => (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 16,
                          }}
                        >
                          {subFields.map((subField) => {
                            // Get the type value directly from the form or use the default
                            const currentType =
                              form.getFieldValue([
                                field.name,
                                "content",
                                subField.name,
                                "type",
                              ]) || "paragraph";

                            return (
                              <Space key={subField.key}>
                                <Form.Item
                                  name={[subField.name, "type"]}
                                  hidden
                                  initialValue={currentType} // Initialize type correctly
                                >
                                  <Input />
                                </Form.Item>

                                {currentType === "paragraph" ? (
                                  <Form.Item
                                    style={{ width: "450px" }}
                                    name={[subField.name, "paragraph"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please enter a paragraph!",
                                      },
                                    ]}
                                  >
                                    <TextArea
                                      showCount
                                      maxLength={100}
                                      placeholder="Insert Paragraph"
                                    />
                                  </Form.Item>
                                ) : currentType === "image" ? (
                                  <Form.Item
                                    name={[subField.name, "image"]}
                                    valuePropName="fileList"
                                    getValueFromEvent={(e) =>
                                      Array.isArray(e) ? e : e?.fileList
                                    }
                                  >
                                    <Upload
                                      listType="picture-card"
                                      maxCount={1}
                                      beforeUpload={() => false} // disable auto-upload
                                    >
                                      <div>+ Upload</div>
                                    </Upload>
                                  </Form.Item>
                                ) : null}

                                <CloseOutlined
                                  onClick={() => subOpt.remove(subField.name)}
                                />
                              </Space>
                            );
                          })}

                          <Space>
                            <Button
                              type="dashed"
                              onClick={() => {
                                subOpt.add({ type: "paragraph" }); // Adding paragraph
                              }}
                            >
                              + Add Paragraph
                            </Button>
                            <Button
                              type="dashed"
                              onClick={() => {
                                subOpt.add({ type: "image" }); // Adding image
                              }}
                            >
                              + Add Image
                            </Button>
                          </Space>
                        </div>
                      )}
                    </Form.List>
                  </Form.Item>
                </Card>
              ))}
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
