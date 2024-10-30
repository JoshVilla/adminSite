import React from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
type Props = {
  list: string[];
};

const Note = ({ list = [] }: Props) => {
  return (
    list.length > 0 && (
      <div style={{ marginBottom: "10px" }}>
        <InfoCircleOutlined />
        <span style={{ marginLeft: "10px" }}>Note</span>
        <ul style={{ marginLeft: "17px", marginTop: "10px" }}>
          {list.map((note: string) => (
            <li>{note}</li>
          ))}
        </ul>
      </div>
    )
  );
};

export default Note;
