import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
} from "antd";
import crypto, { AES, createCipheriv, createHash, randomBytes } from "crypto";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import encrypt from "../util/encrypt";

const { Option } = Select;
const residences = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          {
            value: "xihu",
            label: "West Lake",
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          {
            value: "zhonghuamen",
            label: "Zhong Hua Men",
          },
        ],
      },
    ],
  },
];
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const RegistrationForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    let login_request_object = values;
    login_request_object["password_hashed"] = createHash("sha256") // hash the passowrd to send it via internet
      .update(login_request_object["password"])
      .digest("hex");

    delete login_request_object["confirm_password"]; // remove the confirm password field
    login_request_object['password'] = encrypt(login_request_object['password']);
    axios
      .post("http://localhost:5000/RegisterUser", login_request_object)
      .then((response) => {
        console.log(
          "sucessfully saved\n" + JSON.stringify(login_request_object)
        );
        navigate("/");
      });
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="49">+49</Option>
        <Option value="20">+20</Option>
      </Select>
    </Form.Item>
  );
  const suffixSelector = (
    <Form.Item name="suffix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="USD">$</Option>
        <Option value="CNY">¥</Option>
      </Select>
    </Form.Item>
  );
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);

  const onWebsiteChange = (value) => {
    if (!value) {
      setAutoCompleteResult([]);
    } else {
      setAutoCompleteResult(
        ["A52", "L01"].map((domain) => `${domain}${value}`)
      );
    }
  };

  const websiteOptions = autoCompleteResult.map((website) => ({
    label: website,
    value: website,
  }));
  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{
        residence: ["zhejiang", "hangzhou", "xihu"],
        prefix: "+49",
      }}
      scrollToFirstError
    >
      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: "email",
            message: "The input is not valid E-mail!",
          },
          {
            required: true,
            message: "Please input your E-mail!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }

              return Promise.reject(
                new Error("The two passwords that you entered do not match!")
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="username"
        label="Username"
        tooltip="this will be used to login"
        rules={[
          {
            required: true,
            message: "Please input your nickname!",
            whitespace: true,
          },
        ]}
      >

        
        <Input />
      </Form.Item>
      <Form.Item
        name="first_name"
        label="First Name"
        tooltip="As it is writen in the Passport"
        rules={[
          {
            required: true,
            message: "Please input your nickname!",
            whitespace: true,
          },
        ]}
      >

        
        <Input />
      </Form.Item>



      <Form.Item
        name="telephone_number"
        label="Phone Number"
        rules={[
          {
            required: true,
            message: "Please input your phone number!",
          },
        ]}
      >
        <Input
          addonBefore={prefixSelector}
          style={{
            width: "100%",
          }}
        />
      </Form.Item>
      <Form.Item
        name="phone"
        label="Phone Number 2"
        rules={[
          {
            required: false,
            message: "Please input your phone number!",
          },
        ]}
      >
        <Input
          addonBefore={prefixSelector}
          style={{
            width: "100%",
          }}
        />
      </Form.Item>

      <Form.Item
        name="last_name"
        label="Last Name"
        rules={[
          {
            required: true,
            message: "Family Name",
          },
        ]}
      >
        <Input
          style={{
            width: "100%",
          }}
        />
      </Form.Item>
      <Form.Item
        name="home_address"
        label="Address"
        rules={[
          {
            required: false,
            message: "Billing",
          },
        ]}
      >
        <Input
         
          style={{
            width: "100%",
          }}
        />
      </Form.Item>



      <Form.Item
        name="gender"
        label="Gender"
        rules={[
          {
            required: true,
            message: "Please select gender!",
          },
        ]}
      >
        <Select placeholder="select your gender">
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="passport"
        label="Passport"
        rules={[
          {
            required: true,
            message: "enter passport number",
          },
        ]}
      >
        <Input />
      </Form.Item>


      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegistrationForm;
