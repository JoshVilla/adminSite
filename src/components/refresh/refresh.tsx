import React from "react";
import { ReloadOutlined } from "@ant-design/icons";
import { Flex, Tooltip } from "antd";
import style from "./style.module.scss";
type Props = {
  call: Function;
};

const Refresh = ({ call }: Props) => {
  return (
    <div className={style.refresh}>
      <Tooltip title="Refresh">
        <div onClick={() => call()}>
          <ReloadOutlined style={{ fontSize: "12px" }} />
        </div>
      </Tooltip>
    </div>
  );
};

export default Refresh;
