import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { addAdmin, deleteAdmin, getAdmins, saveAdmin } from "@/services/api";
import base64 from "base-64";
import {
  Badge,
  Button,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Radio,
  RadioChangeEvent,
  Select,
  Space,
  Table,
  TableColumnProps,
  DatePicker,
  notification,
  Upload,
  Avatar,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { IAddParams, IParams } from "./interface";
import modal from "antd/es/modal";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useForm } from "antd/es/form/Form";
import Captcha from "@/components/captcha/captcha";
import { isSuperAdmin } from "@/utils/helpers";
import TitlePage from "@/components/titlePage/titlePage";
import { STATUS } from "@/utils/constant";
import { useHandleLogOut } from "@/hooks/useLogout";

const { RangePicker } = DatePicker;
const Admin = () => {
  const adminInfo = useSelector((state: RootState) => state.userInfo.userInfo);
  const handleLogout = useHandleLogOut();
  const isLoggedIn = localStorage.getItem("status");
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [form] = useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [notifApi, notifContextHolder] = notification.useNotification();
  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [mode, setMode] = useState("");
  const [openCaptcha, setOpenCaptcha] = useState(false);
  const [editRecords, setEditRecords] = useState({});
  const [editId, setEditId] = useState("");
  const [loading, setLoading] = useState(false);
  const [openVerificationActiveModal, setOpenVerificationActiveModal] =
    useState(false);
  const [addParams, setAddParams] = useState<IAddParams>({
    username: "",
    password: "",
    isSuperAdmin: 1,
    createdAt: moment().format("LL"),
    avatar: "",
    isActive: 1,
  });
  const [params, setParams] = useState<IParams>({
    username: "",
    isSuperAdmin: "",
    isActive: "",
    createdAt: [],
  });

  const handleDelete = (id: String) => {
    deleteAdmin({ _id: id }).then((res) => {
      if (res.status === 200) {
        onLoad();
        messageApi.open({
          type: "success",
          content: res.data.message,
        });
      }
    });
  };

  const columns: TableColumnProps[] = [
    {
      key: 1,
      title: "Profile",
      dataIndex: "avatar",
      align: "center",
      width: 50,
      render: (_value, records) => {
        return records.avatar ? (
          <img src={records.avatar} alt="" className={style.classProfile} />
        ) : (
          <Avatar style={{ backgroundColor: "#4096ff" }}>
            {" "}
            {records.username?.substring(0, 1)}{" "}
          </Avatar>
        );
      },
    },
    {
      key: 1,
      title: "Username",
      dataIndex: "username",
      align: "center",
      render: (value, records) => {
        const currentAccount = adminInfo?._id === records._id ? "(Me)" : "";
        return `${value} ${currentAccount}`;
      },
    },
    {
      key: 2,
      title: "Password",
      dataIndex: "password",
      align: "center",
    },
    {
      key: 3,
      title: "Super Admin",
      dataIndex: "isSuperAdmin",
      render: (isTrue: number) => (isTrue === 1 ? "Enabled" : "Disabled"),
      align: "center",
      width: 200,
    },
    {
      key: 4,
      title: "Is Active",
      dataIndex: "isActive",
      render: (isTrue: number) => {
        return (
          <Badge
            status={isTrue === 1 ? "success" : "error"}
            text={isTrue === 1 ? "Active" : "Not Active"}
          />
        );
      },
      align: "center",
      width: 200,
    },
    {
      key: 5,
      title: "Created At",
      dataIndex: "createdAt",
      align: "center",
      width: 250,
    },
    {
      key: 6,
      title: "Operations",
      render: (_: any, records: any, index: number) => {
        return (
          <Flex gap={10} align="center">
            <Button
              disabled={!isSuperAdmin()}
              size="small"
              type="link"
              onClick={() => {
                setOpenCaptcha(true);
                setEditRecords(records);
              }}
            >
              Edit
            </Button>
            <Button
              disabled={!isSuperAdmin()}
              size="small"
              onClick={() => confirmDelete(records._id)}
              danger
            >
              Delete
            </Button>
          </Flex>
        );
      },
      align: "center",
      width: 200,
    },
  ];

  const handleAdd = async () => {
    if (!addParams.username || !addParams.password) {
      messageApi.open({
        type: "error",
        content: "Please fill up the forms",
      });
      return;
    }
    setLoading(true);
    await addAdmin(addParams).then((res) => {
      if (res.status === 200) {
        onLoad();
        setLoading(false);
        setOpenAddModal(false);
        messageApi.open({
          type: "success",
          content: res.data.message,
        });
      }
    });
  };

  const handleSave = () => {
    const { username, password, isSuperAdmin, avatar, isActive } = addParams;

    const params = {
      username,
      password,
      isSuperAdmin,
      id: editId,
      avatar,
      isActive,
    };
    setLoading(true);
    onSaveAdmin(params);
  };

  const onSaveAdmin = async (params: any) => {
    try {
      const res = await saveAdmin(params);
      if ((res.status = 200)) {
        onLoad();
        setOpenAddModal(false);
        setLoading(false);
        messageApi.open({
          type: "success",
          content: res.data.message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDelete = (id: String) => {
    modal.confirm({
      title: "Confirm",
      // icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete?",
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: () => handleDelete(id),
    });
  };

  const handleReset = () => {
    setParams((prev) => ({
      ...prev,
      username: "",
      isActive: "",
      isSuperAdmin: "",
    }));
    setShouldLoad((prev) => !prev);
  };

  const onLoad = async () => {
    try {
      const res = await getAdmins(params);
      if (res.status === STATUS.SUCCESS) {
        let data = res.data;

        setisLoading(false);
        setData(data.map((items: any) => ({ ...items, key: items._id })));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeDate = (range: any) => {
    let to = moment(range[1]).format("LL");
    let from = moment(range[0]).format("LL");

    setParams((prev) => ({
      ...prev,
      createdAt: [from, to],
    }));
  };

  const handleOpenModal = (mode: string, records: any = {}) => {
    const { username, password, isSuperAdmin, _id, isActive } = records || {};
    setEditId(_id);
    setMode(mode);
    setOpenAddModal(true);
    if (mode === "isEditMode") {
      setAddParams((prev) => ({
        ...prev,
        username,
        password: base64.decode(password),
        isSuperAdmin,
        isActive,
      }));
    }
  };

  const handleCloseModal = () => {
    setLoading(false);
    setOpenAddModal(false);
    form.resetFields();
    setAddParams({
      username: "",
      password: "",
      isSuperAdmin: 1,
      createdAt: moment().format("LL"),
      avatar: null,
      isActive: 1,
    });
  };

  const handleVerifiedCaptcha = (result: boolean) => {
    if (result) handleOpenModal("isEditMode", editRecords);
  };

  const uploadOnchange = (info: any) => {
    // Get the file list
    const { file } = info;

    // If the file is uploading or the upload was successful
    if (file.status === "done") {
      const reader = new FileReader();
      reader.onload = () => {
        setAddParams((prev) => ({
          ...prev,
          avatar: file.originFileObj,
        }));
      };
      reader.readAsDataURL(file.originFileObj);
    }
  };

  const beforeUpload = (file: any) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }
    return isImage || Upload.LIST_IGNORE;
  };

  useEffect(() => {
    onLoad();
  }, [shouldLoad]);

  useEffect(() => {
    form.setFieldsValue({
      username: addParams.username,
      password: addParams.password,
      status: addParams.isSuperAdmin,
    });
  }, [addParams, form]);

  useEffect(() => {
    if (!isLoggedIn) {
      notifApi.success({
        message: `Logged in Successfully`,
        placement: "topRight",
      });
    }
  }, []);

  return (
    <div>
      {contextHolder}
      {notifContextHolder}
      <TitlePage title="Admin Management" />
      <Space direction="vertical" size={"small"}>
        <Form>
          <Flex wrap gap={20}>
            <Form.Item label="Username">
              <Input
                value={params.username}
                onChange={(e) => {
                  setParams((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }));
                }}
              />
            </Form.Item>
            <Form.Item label="Super Admin">
              <Select
                value={params.isSuperAdmin}
                defaultValue=""
                style={{ width: 120 }}
                onChange={(value) => {
                  setParams((prev) => ({
                    ...prev,
                    isSuperAdmin: value,
                  }));
                }}
                options={[
                  { value: "", label: "All" },
                  { value: 1, label: "Enabled" },
                  { value: -1, label: "Disabled" },
                ]}
              />
            </Form.Item>
            <Form.Item label="Active">
              <Select
                value={params.isActive}
                defaultValue=""
                style={{ width: 120 }}
                onChange={(value) => {
                  setParams((prev) => ({
                    ...prev,
                    isActive: value,
                  }));
                }}
                options={[
                  { value: "", label: "All" },
                  { value: 1, label: "Active" },
                  { value: -1, label: "Not Active" },
                ]}
              />
            </Form.Item>
            <Button
              type="primary"
              onClick={() => {
                onLoad();
              }}
            >
              Search
            </Button>
            <Button onClick={() => handleReset()}>Reset</Button>
            {isSuperAdmin() && (
              <Button
                type="primary"
                onClick={() => handleOpenModal("isAddMode")}
              >
                Add
              </Button>
            )}
            {/* <Form.Item label="Created At">
              <RangePicker onChange={onChangeDate} />
            </Form.Item> */}
          </Flex>
        </Form>
      </Space>
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        bordered
      />
      <Modal
        destroyOnClose
        title="Add Admin"
        open={openAddModal}
        onClose={handleCloseModal}
        onCancel={handleCloseModal}
        width={600}
        footer={[
          <Button
            loading={loading}
            key="submit"
            type="primary"
            htmlType="submit"
            onClick={() => {
              if (mode === "isAddMode") {
                handleAdd();
              } else if (form.getFieldValue("active") === -1) {
                setOpenVerificationActiveModal(true);
              } else {
                handleSave();
              }
            }}
          >
            {mode === "isAddMode" ? "Submit" : "Save"}
          </Button>,
        ]}
      >
        <Form
          form={form}
          initialValues={{
            username: addParams.username,
            password: addParams.password,
            status: addParams.isSuperAdmin,
            active: addParams.isActive,
          }}
        >
          <Form.Item label="Profile (Optional)">
            <Upload
              onChange={uploadOnchange}
              beforeUpload={beforeUpload}
              maxCount={1}
              customRequest={({ file, onSuccess }) => {
                // Check if onSuccess is defined before calling it
                if (onSuccess) {
                  setTimeout(() => {
                    onSuccess("ok"); // Simulate a successful upload
                  }, 0);
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Profile</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Username" name="username">
            <Input
              placeholder="Input Username"
              onChange={(e) =>
                setAddParams((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            />
          </Form.Item>

          <Form.Item label="Password" name="password">
            <Input.Password
              disabled={userInfo?.userInfo?.isSuperAdmin === -1 ? true : false}
              placeholder="Input Password"
              onChange={(e) =>
                setAddParams((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
          </Form.Item>

          <Form.Item label="Admin Status" name="status">
            <Radio.Group
              onChange={(e) => {
                setAddParams((prev) => ({
                  ...prev,
                  isSuperAdmin: e.target.value,
                }));
              }}
            >
              <Radio value={1}>Super Admin</Radio>
              <Radio value={-1}>Normal Admin</Radio>
            </Radio.Group>
          </Form.Item>
          {mode === "isEditMode" && (
            <Form.Item label="Active" name="active">
              <Radio.Group
                onChange={(e) => {
                  setAddParams((prev) => ({
                    ...prev,
                    isActive: e.target.value,
                  }));
                }}
              >
                <Radio value={1}>On</Radio>
                <Radio value={-1}>Off</Radio>
              </Radio.Group>
            </Form.Item>
          )}
        </Form>
      </Modal>
      <Modal
        open={openVerificationActiveModal}
        title="Are you sure?"
        onClose={() => setOpenVerificationActiveModal(false)}
        footer={[
          <Button
            onClick={() => setOpenVerificationActiveModal(false)}
            key="no"
          >
            No
          </Button>,
          <Button
            type="primary"
            key="yes"
            onClick={() => {
              handleSave();
              setOpenVerificationActiveModal(false);
              handleLogout();
              setLoading(true);
              console.log("clicked");
            }}
          >
            Yes
          </Button>,
        ]}
      >
        <p>Are sure you want to set your account to inactive?</p>
        <p>If yes, you will automatically logout</p>
      </Modal>
      <Captcha
        open={openCaptcha}
        setOpen={setOpenCaptcha}
        onVerified={handleVerifiedCaptcha}
      />
    </div>
  );
};

export default Admin;
