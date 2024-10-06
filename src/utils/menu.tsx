import { GlobalOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";
export const menu = [
  {
    key: "adminManagement",
    icon: <UserOutlined />,
    label: "Admin Management",
    path: "adminManagement",
  },
  {
    key: "siteManagement",
    icon: <GlobalOutlined />,
    label: "Site Management",
    path: "siteManagement",
  },
  {
    key: "pageManagement",
    icon: <GlobalOutlined />,
    label: "Page Management",
    path: "pageManagement",
    children: [
      {
        key: "homepageManagement",
        label: "Homepage",
        path: "homepageManagement",
        icon: <HomeOutlined />,
      },
    ],
  },
];
