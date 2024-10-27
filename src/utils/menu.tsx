import {
  BookOutlined,
  CopyOutlined,
  GlobalOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
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
    icon: <CopyOutlined />,
    label: "Page Management",
    path: "pageManagement",
    children: [
      {
        key: "homepageManagement",
        label: "Homepage",
        path: "homepageManagement",
        icon: <HomeOutlined />,
      },
      {
        key: "topStories",
        label: "Top Stories",
        path: "topStories",
        icon: <BookOutlined />,
      },
      {
        key: "officials",
        label: "Officials",
        path: "officials",
        icon: <BookOutlined />,
      },
    ],
  },
];
