import TitlePage from "@/components/titlePage/titlePage";
import { Tabs, TabsProps } from "antd";
import React from "react";
import Highlights from "./highlights/highlights";
import TopStories from "./topStories/topStories";

type Props = {};

const Homepage = (props: Props) => {
  const onChange = (key: string) => {
    console.log(key);
  };
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Highlights",
      children: <Highlights />,
    },
    {
      key: "2",
      label: "Top Stories",
      children: <TopStories />,
    },
  ];
  return (
    <div>
      <TitlePage title="Homepage" />
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
};

export default Homepage;
