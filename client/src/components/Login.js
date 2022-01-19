import React, { Component, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  Alert,
  FormGroup,
} from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import crypto, { AES, createCipheriv, createHash, randomBytes } from "crypto";
import { Context } from "./Contexts";
import send_request from "../util/send_request";
import { useForm } from "rc-field-form";
import encrypt from "../util/encrypt";

export default function Login2() {
  const navigate = useNavigate();
  const context = useContext(Context);
  const [message, setMessage] = useState("");

  const onFinish = async (values) => {
    let encrypted_pass = encrypt(values["password"]);
    values["password"] = encrypted_pass;
    console.log("Success:", values);

    const { msg, error, token } = await send_request("LoginUser", values);
    if (error) {
      setMessage(msg);
    } else {
      localStorage.setItem("token", token);
      console.log(
        `token is now = to ${token} and on local storage = ${localStorage.getItem(
          "token"
        )}`
      );
      navigate("../");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="login_user"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: "Please input your username!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button
          type="primary"
          htmlType="submit"
          onClick={() => {
            navigate("../RegisterUser");
          }}
        >
          Register
        </Button>
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button
          type="primary"
          htmlType="submit"
          onClick={() => {
            navigate("../admin/");
          }}
        >
          Login as admin
        </Button>
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        {message && <Alert message={message}></Alert>}
      </Form.Item>
    </Form>
  );
}
