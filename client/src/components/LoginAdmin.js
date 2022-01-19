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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Send_request from "../util/send_request";

const FormItem = Form.Item;
const Admin1 = () => {
  let navigate = useNavigate();
  const [Err, setErr] = useState(false);
  const onFinish = async (values) => {
    if (values.password == 12345) {
      console.log("Success:", values);
      const { msg, error, token } = await Send_request("LoginUser", {
        username: 'admin',
        password: '12345',
      });

      if (error) {
        //setMessage(msg);
      } else {
        localStorage.setItem("token", token);
      }
      navigate("./AdminPage", {
        replace: true,
      });
    } else {
      setErr(true);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="basic"
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

        {Err && (
          <FormItem>
            <Alert
              message={"Invalid Password"}
              description="Your Password is wrong"
              type="error"
              showIcon
              display
            />
          </FormItem>
        )}
      </Form.Item>
    </Form>
  );
};
export default Admin1;
