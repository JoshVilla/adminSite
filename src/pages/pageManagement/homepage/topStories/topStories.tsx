import Typography from "antd/es/typography";
import React, { useEffect, useState } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { getStory } from "@/services/api";
import Table, { ColumnProps } from "antd/es/table";
import {
  Button,
  DatePicker,
  DatePickerProps,
  Flex,
  Form,
  Input,
  Space,
} from "antd";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const TopStories = () => {
  const [searchForm] = Form.useForm();
  const [data, setData] = useState([]);
  const [date, setDate] = useState<any>({});

  const onLoad = async (params = {}) => {
    const result = await getStory(params);
    setData(result.data);
  };

  const onReset = () => {
    searchForm.resetFields();
    setDate({});
    onLoad();
  };

  const columns: ColumnProps[] = [
    {
      key: 1,
      title: "Title",
      dataIndex: "title",
    },
    {
      key: 2,
      title: "Thumbnail",
      dataIndex: "thumbnail",
      render: (thumbnail: string) => (
        <img
          src={thumbnail}
          style={{ width: 50, height: 50, objectFit: "contain" }}
        />
      ),
      width: 200,
    },
    {
      key: 3,
      title: "Created At",
      dataIndex: "createdAt",
      width: 200,
    },
  ];

  const formLayout = {
    wrapperCol: { span: 16 },
  };

  const onSearch = () => {
    const { title } = searchForm.getFieldsValue();
    let dates = date;
    if (date.length === 2) {
      dates = {
        start: date[0],
        end: date[1],
      };
    }
    onLoad({ title, dates });
  };

  const onChangeDate: DatePickerProps<any>["onChange"] = (_, dateStrings) => {
    if (dateStrings.length === 2) {
      setDate(dateStrings);
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <div>
      <Title level={4}>Top Stories</Title>
      <div style={{ marginBottom: "10px" }}>
        <InfoCircleOutlined />
        <span style={{ marginLeft: "10px" }}>Note</span>
        <ul style={{ marginLeft: "17px", marginTop: "10px" }}>
          <li>Choose 3 stories to display in Top Stories in Homepage Page</li>
        </ul>
      </div>
      <div style={{ marginTop: "10px" }}>
        <Form {...formLayout} form={searchForm}>
          <Flex align="center" gap={20}>
            <Form.Item label="Title" name="title">
              <Input placeholder="Search Title" />
            </Form.Item>
            <Form.Item label="Created At" name="date">
              <RangePicker onChange={onChangeDate} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={onSearch}>
                Search
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={onReset}>Reset</Button>
            </Form.Item>
          </Flex>
        </Form>
        <Table columns={columns} dataSource={data} size="small" />
      </div>
    </div>
  );
};

export default TopStories;
