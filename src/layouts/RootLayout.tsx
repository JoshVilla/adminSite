import React, { useState } from "react";
import {
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Flex,
  Layout,
  Menu,
  MenuProps,
  Space,
  theme,
} from "antd";
import { menu } from "../utils/menu";
import { Outlet, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "../store/slice/userInfoSlice";

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const username = useSelector(
    (state: RootState) => state.userInfo?.userInfo?.username
  );
  const avatar = useSelector(
    (state: RootState) => state.userInfo?.userInfo?.avatar
  );

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogOut = () => {
    navigate("/");
    dispatch(getUserInfo(null));
    localStorage.removeItem("status");
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <a onClick={handleLogOut}>Logout</a>,
    },
  ];

  const handleMenu: MenuProps["onClick"] = (e) => {
    navigate(`${e.key}`);
  };

  console.log(avatar);

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          onClick={handleMenu}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["adminManagement"]}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          items={menu}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div style={{ marginRight: 20 }}>
            <Flex gap={10} align="center">
              {avatar ? (
                <Avatar
                  src={avatar} // Use the actual avatar URL from the state
                  alt="User Avatar"
                />
              ) : (
                <Avatar style={{ backgroundColor: "#4096ff" }}>
                  {username?.substring(0, 1)}
                </Avatar>
              )}
              <Dropdown menu={{ items }}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    Log out
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            </Flex>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "100vh",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
