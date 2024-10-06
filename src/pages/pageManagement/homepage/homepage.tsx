import TitlePage from "@/components/titlePage/titlePage";
import { Table, TableColumnProps, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { homepageInfo } from "@/services/api";

const { Title } = Typography;
const Homepage = () => {
  const [dataHighlights, setDataHighlights] = useState([]);
  const columns: TableColumnProps[] = [
    { key: 1, title: "Image", align: "center", dataIndex: "image" },
    { key: 2, title: "Title", align: "center", dataIndex: "title" },
    { key: 3, title: "Content", align: "center", dataIndex: "content" },
    { key: 4, title: "Sort", align: "center", dataIndex: "sorted" },
    { key: 5, title: "Display", align: "center", dataIndex: "display" },
    { key: 6, title: "Action", align: "center" },
  ];

  useEffect(() => {
    homepageInfo({}).then((res) => {
      const highlights = res.data[0].highlights;
      setDataHighlights(
        highlights.map((items: any) => ({ ...items, key: items.id }))
      );
    });
  }, []);

  return (
    <div>
      <TitlePage title="Homepage" />
      <div>
        <Title level={4}>Highlights Section</Title>
        <div>
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
        <Table
          size="small"
          columns={columns}
          dataSource={dataHighlights}
          style={{ marginTop: "30px" }}
        />
      </div>
    </div>
  );
};

export default Homepage;
