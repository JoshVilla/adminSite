import TitlePage from "@/components/titlePage/titlePage";
import { Button, Card, Form, Input, Space, Upload } from "antd";
import form from "antd/es/form";
import React, { useState } from "react";

type Props = {
  data: any;
};

const EditStoryForm = ({ data }: Props) => {
  const [form] = Form.useForm();
  const [selectedStory] = useState(data);
  return (
    <div>
      <TitlePage title="Edit Story" />
      <Form
        form={form}
        onFieldsChange={() => {
          const items = form.getFieldsValue()?.items;
          setDisableBtn(items?.length === 0);
        }}
        name="dynamic_form"
        style={{ width: 600 }}
        autoComplete="off"
        initialValues={{
          title: selectedStory?.title || "",
          thumbnail: selectedStory?.thumbnail || null,
          items: selectedStory?.content?.map((item) => JSON.parse(item)) || [],
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
            onChange={uploadOnchange}
            defaultFileList={
              selectedStory?.thumbnail
                ? [
                    {
                      uid: "-1",
                      name: "thumbnail.jpg",
                      status: "done",
                      url: selectedStory.thumbnail,
                    },
                  ]
                : []
            }
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
                  onClick={() => add({ type: "paragraph" })}
                >
                  + Add Paragraph
                </Button>

                <Button
                  type="dashed"
                  onClick={() => add({ type: "image" })}
                  disabled
                >
                  + Add Image
                </Button>
              </Space>
              <Button
                type="primary"
                disabled={disableBtn}
                loading={loading}
                onClick={() => handleAdd(form.getFieldsValue())}
              >
                {selectedStory ? "Update Story" : "Add Story"}
              </Button>
            </div>
          )}
        </Form.List>
      </Form>
    </div>
  );
};

export default EditStoryForm;
