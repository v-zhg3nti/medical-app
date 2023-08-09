import React, { useState } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import "./Auth.css";

const antIcon = <LoadingOutlined style={{ fontSize: 20 }} spin />;

export function Auth() {
  const navigate = useNavigate();

  const [authInputs, setAuthInputs] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isAuthError, setAuthError] = useState(false);

  const onHandleChange = (key, value) =>
    setAuthInputs((prevState) => ({ ...prevState, [key]: value }));

  const onSubmit = async () => {
    setLoading(true);
    setAuthError(false);
    signInWithEmailAndPassword(auth, authInputs.email, authInputs.password)
      .then((_) => {
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        setLoading(false);
        setAuthError(true);
      });
  };

  return (
    <div className="auth-wrapper">
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        autoComplete="off"
        onFinish={onSubmit}
      >
        <span
          style={
            isAuthError
              ? { visibility: "visible", color: "red" }
              : { visibility: "hidden" }
          }
        >
          auth error please check credentials
        </span>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input
            value={authInputs.email}
            id="email"
            onChange={(e) => onHandleChange(e.target.id, e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            value={authInputs.password}
            id="password"
            onChange={(e) => onHandleChange(e.target.id, e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Spin indicator={antIcon} spinning={loading} />
        </Form.Item>
      </Form>
    </div>
  );
}
