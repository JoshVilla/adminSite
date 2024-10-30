import Typography from "antd/es/typography";
import React, { useEffect, useState } from "react";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { getStory, updateDisplayStory } from "@/services/api";
import Table, { ColumnsType } from "antd/es/table";
import {
  Button,
  DatePicker,
  DatePickerProps,
  Flex,
  Form,
  Input,
  message,
} from "antd";
import Refresh from "@/components/refresh/refresh";
import SelectedStories from "./components/selectedStories";
import { IStory } from "./interface";
import { STATUS } from "@/utils/constant";
import CImage from "@/components/image/image";
import Note from "@/components/note/note";

const { Title } = Typography;
const { RangePicker } = DatePicker;
const MAXIMUM_DISPLAY = 3;

const TopStories = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [searchForm] = Form.useForm();
  const [data, setData] = useState([]);
  const [date, setDate] = useState<any>({});
  const [selectedStories, setSelectedStories] = useState<IStory[]>([]);

  const hasReachMaximumDisplay = selectedStories.length === MAXIMUM_DISPLAY;

  const onLoad = async (params = {}) => {
    const result = await getStory(params);
    setData(result.data);
    // get selected stories
    setSelectedStories(result.data.filter((o: any) => o.isDisplayed === 1));
  };

  const onReset = () => {
    searchForm.resetFields();
    setDate({});
    onLoad();
  };

  const updateDisplay = async (id: string, display: number) => {
    if (hasReachMaximumDisplay && display === 1) {
      messageApi.warning(
        "Selected Stories already raech the maximum of display"
      );
    } else {
      const response = await updateDisplayStory({ id, isDisplayed: display });
      if (response.status === STATUS.SUCCESS) {
        messageApi.success(response.data.message);
        onLoad();
      }
    }
  };

  const columns: ColumnsType<IStory> = [
    {
      key: 1,
      title: "Title",
      dataIndex: "title",
    },
    {
      key: 2,
      title: "Thumbnail",
      dataIndex: "thumbnail",
      render: (thumbnail: string) => <CImage imageUrl={thumbnail} />,
      width: 200,
    },
    {
      key: 3,
      title: "Created At",
      dataIndex: "createdAt",
      width: 200,
    },
    {
      key: 4,
      title: "Operation",
      width: 150,
      dataIndex: "isDisplayed",
      align: "center",
      render: (isDisplayed: number, records: IStory) => (
        <div>
          {+isDisplayed ? (
            <Button
              danger
              type="primary"
              size="small"
              onClick={() => updateDisplay(records._id, 0)}
            >
              <MinusOutlined />
            </Button>
          ) : (
            <Button
              type="primary"
              size="small"
              onClick={() => updateDisplay(records._id, 1)}
            >
              <PlusOutlined />
            </Button>
          )}
        </div>
      ),
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

  const noteList = [
    "Choose 3 stories to display in Top Stories in Homepage Page",
  ];

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <div>
      {contextHolder}
      <Title level={4}>Top Stories</Title>
      <div style={{ margin: "20px 0" }}>
        <Title level={5}>
          Selected Stories {`${selectedStories.length} / ${MAXIMUM_DISPLAY}`}
        </Title>
        <SelectedStories list={selectedStories} onLoad={onLoad} />
      </div>
      <Note list={noteList} />
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
        <div>
          <Flex justify="end">
            <Refresh call={onLoad} />
          </Flex>
          <Table columns={columns} dataSource={data} size="small" />
        </div>
      </div>
    </div>
  );
};

export default TopStories;
