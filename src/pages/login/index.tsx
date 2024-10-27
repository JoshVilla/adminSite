import React, { useState } from "react";
import style from "./style.module.scss";
import { Button, Form, Input, message } from "antd";
import { loginApi } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { getUserInfo } from "@/store/slice/userInfoSlice";
import { delayTimer } from "@/utils/helpers";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginParams, setLoginParams] = useState({
    username: "",
    password: "",
  });
  const [messageApi, contextHolder] = message.useMessage();
  const handleLogin = () => {
    const isLoggedIn = localStorage.getItem("status");
    if (loginParams.username && loginParams.password) {
      loginApi({
        username: loginParams.username,
        password: loginParams.password,
      })
        .then((res) => {
          setIsLoading(false);
          throwMessage(res.status, res.data.message);
          if (res.status === 200) {
            // let timer = 3;
            navigate("admin/adminManagement");
            dispatch(getUserInfo(res.data.data));
            if (isLoggedIn) localStorage.removeItem("status");
            const func = () => {
              localStorage.setItem("status", "loggedIn");
            };
            delayTimer(1, func);
          }
        })
        .catch((err) => {
          console.log(err.status);
          setIsLoading(false);
          throwMessage(err.status, err.response.data.message);
        });
    } else return;
  };

  const throwMessage = (status: number, msg: any) => {
    messageApi.open({
      type: status === 200 ? "success" : "error",
      content: msg,
    });
  };
  return (
    <div className={style.mainContainer}>
      {contextHolder}
      <div className={style.loginBox}>
        <div className={style.title}>Login</div>
        <Form>
          <Form.Item
            name={"username"}
            rules={[{ required: true, message: "Please unput your username" }]}
          >
            <Input
              name="username"
              autoComplete="off"
              placeholder="Input Username"
              onChange={(e) =>
                setLoginParams((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
            />
          </Form.Item>
          <Form.Item
            name={"password"}
            rules={[{ required: true, message: "Please unput your password" }]}
          >
            <Input.Password
              name="password"
              placeholder="Input Password"
              type="password"
              onChange={(e) =>
                setLoginParams((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            onClick={handleLogin}
            loading={isLoading}
          >
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
