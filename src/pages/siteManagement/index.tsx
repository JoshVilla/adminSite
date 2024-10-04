import React, { useEffect, useState } from "react";
import TitlePage from "../../components/titlePage/titlePage";
import { Tabs, TabsProps } from "antd";
import BasicInformation from "./basicInformation";
import VisionMission from "./visionmission";
import { siteInfo as siteInfoApi } from "../../services/api";
import { ISiteInfo } from "./interface";

const onChange = (key: string) => {
  console.log(key);
};

const SiteManagement = () => {
  const [siteInfos, setSiteInfos] = useState<ISiteInfo>({
    _id: null,
    title: "",
    address: "",
    vision: "",
    mission: "",
    accounts: {
      facebook: "",
      twitter: "",
      tiktok: "",
    },
    logo: "",
    logoPublicId: "",
  });
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Basic Information",
      children: <BasicInformation data={siteInfos} />,
    },
    {
      key: "2",
      label: "Mission and Vision",
      children: <VisionMission data={siteInfos} />,
    },
  ];
  useEffect(() => {
    siteInfoApi({}).then((res) => {
      const data = res.data;
      setSiteInfos(data[0]);
    });
  }, []);

  return (
    <div>
      <TitlePage title="Site Management" />
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
};

export default SiteManagement;
