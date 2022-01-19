import React, { useState, useEffect, Fragment } from "react";
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
  Typography,
  AutoComplete,
} from "antd";
import crypto, { AES, createCipheriv, createHash, randomBytes } from "crypto";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Send_request from "../util/send_request";
import encrypt from "../util/encrypt";


const { Option } = Select;
const { Paragraph, Text } = Typography;

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

  const onFinish = (values) => {
    let updated_obj = {
      first_name: first_name,
      email: email,
      username: username,
      password: encrypt( password),
      home_address: home_address,
      last_name: last_name,
      contry_code: contry_code,
      telephone_number: telephone_number,
      passport: passport,
    };

    Send_request("./EditUser", {
      ...updated_obj,
      token: window.localStorage.getItem("token"),
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
        <Option value="02">+02</Option>
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

  const [user, setUser] = useState({});
  const [first_name, setFirst_name] = useState("");
  const [username, setUsername] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telephone_number, settelephone_number] = useState("");
  const [contry_code, setContry_code] = useState("");
  const [home_address, setHome_address] = useState("");
  const [passport, setPassport] = useState("");
  const navigate = useNavigate();
  /// States for all the fields from the initial User
  useEffect(async () => {
    try {
      const data = await Send_request("get-user");

      const _user = data["user"];
      console.log(`initial user data`);
      console.dir(_user);
      setFirst_name(_user["first_name"]);
      setLast_name(_user.last_name);
      setUsername(_user.username);
      setEmail(_user["email"]);
      setPassword(_user["password"]);
      settelephone_number(_user["telephone_number"]);
      setHome_address(_user["home_address"]);
      setPassport(_user["passport"]);
    } catch (error) {
      console.error(error);
      navigate("/LoginUser");
    }
  }, []);
  return (
    <Form {...formItemLayout} form={form} name="register" onFinish={onFinish}>
      <Form.Item name="email" label="E-mail">
        <Paragraph editable={{ onChange: setEmail }}>{email}</Paragraph>
      </Form.Item>
      <Form.Item>
        <ChangePassword password={password} onChange={setPassword}/>
      </Form.Item>

      <Form.Item name="username" label="username">
        <Paragraph editable={{ onChange: setUsername }}>{username}</Paragraph>
      </Form.Item>

      <Form.Item name="first_name" label="First Name">
        <Paragraph editable={{ onChange: setFirst_name }}>
          {first_name}
        </Paragraph>
      </Form.Item>

      <Form.Item name="last_name" label="Last Name">
        <Paragraph editable={{ onChange: setLast_name }}>{last_name}</Paragraph>
      </Form.Item>

      <Form.Item name="telephone_number" label="Phone Number">
        <Paragraph editable={{ onChange: settelephone_number }}>
          {telephone_number}
        </Paragraph>
      </Form.Item>

      <Form.Item name="home_address" label="Address">
        <Paragraph editable={{ onChange: setHome_address }}>
          {home_address}
        </Paragraph>
      </Form.Item>

      <Form.Item name="contry_code" label="Country Code">
        <Paragraph editable={{ onChange: setContry_code }}>
          {contry_code}
        </Paragraph>
      </Form.Item>
      <Form.Item name="passport" label="Passprot Number">
        <Paragraph editable={{ onChange: setPassport }}>{passport}</Paragraph>
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Edit
        </Button>
      </Form.Item>
    </Form>
  );
};

function ChangePassword({ password, onChange }) {
  const [see_password_field_, setsee_password_field_] = useState(false);
  return (
    <div>
     
      {!see_password_field_ && (
        
        <Form.Item
          {...formItemLayout}
          name="old_password"
          label="Old Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "write old password",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                let hash = encrypt(value);
                console.log(`${hash}, ${value}`);
                if (!value || hash === password) {
                  if (hash === password) {
                    setsee_password_field_(true);
                  }
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Sorry this is not your old Password")
                );
              },
            }),
          ]}
        >
          <Text>Add your old Password</Text>
          <Input.Password />
        </Form.Item>
      )}
      {see_password_field_ && (
        <Fragment>
          <Form.Item
            name="password"
            label="New Passowrd"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "write new password",
              },
            ]}
          >
            
            <Text>Choose a New Passwrod</Text>
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm_new_password"
            label="Confirm New Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "confirm new password",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  console.log(getFieldValue("password"));
                  if (!value || value === getFieldValue("password")) {
                    //
                    onChange(value); // calling to set the new password
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Fragment>
      )}
    </div>
  );
}

export default RegistrationForm;
