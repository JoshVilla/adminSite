import { Button, Input, Modal, Typography } from "antd";
import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { OTPProps } from "antd/es/input/OTP";

type Props = {
  onVerified: (result: boolean) => void; // Add result type
  open: boolean;
  setOpen: (open: boolean) => void;
};

const Captcha = ({ onVerified, open, setOpen }: Props) => {
  const [captcha, setCaptcha] = useState("");
  const [inputCaptcha, setInputCaptcha] = useState("");

  // Function to generate a new captcha
  const generateCaptcha = () => {
    let result = "";
    const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < 6; i++) {
      result += alphabets.charAt(Math.floor(Math.random() * alphabets.length));
    }
    setCaptcha(result);
  };

  // Handling input change in OTP
  const onChange: OTPProps["onChange"] = (text) => {
    setInputCaptcha(text);
  };

  const sharedProps: OTPProps = {
    onChange,
  };

  // Function to verify if the input matches the generated captcha
  const verifyCaptcha = () => {
    const isMatch = inputCaptcha === captcha;
    onVerified(isMatch); // Pass the result to the parent component
    if (isMatch) {
      setOpen(false); // Close modal if captcha is verified
    } else {
      console.log("Captcha mismatch");
    }
  };

  // Generate captcha when component mounts
  useEffect(() => {
    generateCaptcha();
  }, [open]);

  return (
    <Modal
      destroyOnClose
      open={open} // Use the 'open' prop passed from parent
      onCancel={() => setOpen(false)} // Allow modal to be closed manually
      width={250}
      title="Captcha"
      footer={[
        <Button key="verify" onClick={verifyCaptcha} type="primary">
          Verify
        </Button>,
      ]}
    >
      <Typography.Paragraph>Input the code to continue</Typography.Paragraph>
      <div className={style.captcha}>
        <Typography.Title level={4}>{captcha}</Typography.Title>
      </div>
      <div className={style.inputCaptcha}>
        <Input.OTP formatter={(str) => str.toUpperCase()} {...sharedProps} />
      </div>
    </Modal>
  );
};

export default Captcha;
