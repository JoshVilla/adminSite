import React from "react";
import DefaultLogo from "../../../public/cordonLogo.png";
type Props = {
  imageUrl: string;
  height?: number;
  width?: number;
  maxHeight?: number;
};

const CImage = ({ imageUrl, height = 30, width = 30, maxHeight }: Props) => {
  const imgStyle = maxHeight ? { maxHeight } : { height, width };
  return (
    <img
      src={imageUrl ? imageUrl : DefaultLogo}
      alt=""
      style={{ ...imgStyle, objectFit: "contain" }}
    />
  );
};

export default CImage;
