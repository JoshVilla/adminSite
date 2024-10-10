import TitlePage from "@/components/titlePage/titlePage";
import { Tabs, TabsProps } from "antd";
import React, { useEffect, useState } from "react";
import Highlights from "./homepage/highlights/highlights";
import TopStories from "./homepage/topStories/topStories";
import Hotlines from "./homepage/hotlines";
import { homepageInfo } from "@/services/api";
import { STATUS } from "@/utils/constant";

type Props = {};

const Homepage = (props: Props) => {
  const [data, setData] = useState([]);
  const onChange = (key: string) => {
    console.log(key);
  };
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Highlights",
      children: <Highlights data={data} onLoad={() => onLoad()} />,
    },
    {
      key: "2",
      label: "Top Stories",
      children: <TopStories />,
    },
    {
      key: "3",
      label: "Hotlines",
      children: <Hotlines data={data} onLoad={() => onLoad()} />,
    },
  ];

  const onLoad = async () => {
    const res = await homepageInfo({});

    if (res.status === STATUS.SUCCESS) {
      setData(res.data[0]);
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <div>
      <TitlePage title="Homepage" />
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
};

export default Homepage;
