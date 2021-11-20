import React, { Component } from "react";
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
} from "antd";
import "antd/dist/antd.css";
import axios from 'axios';

const FormItem = Form.Item;
// const { getFieldDecorator } = this.props.form;

class HelloWorld extends Component {
  // state
  state = {
    user_email: "",
  };
  // functions to controll input
  
  // geters
  get_email = (event) => {
    this.setState({
      user_email: event.target.value,
    });
  };
  get_password = (event) => {
    this.setState({
      user_password: event.target.value,
    });
  };
  get_confirm_passowrd = (event) => {
    this.setState({
      user_confirm_password: event.target.value,
    });
  };
  get_nickname = (event) => {
    this.setState({
      user_nickname: event.target.value,
    });
  };



  handleSubmit = (e) => {
    console.log(this.state);
    axios
      .post("http://localhost:5000/", this.state)
      .then((response) => this.setState({ articleId: response.data.id }));
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };
    return (
      <Form
        onSubmit={this.handleSubmit}
        {...formItemLayout}
        /* style={{ width: "600px" }}*/
        style={{ height : "1200px",
          backgroundImage:
            "url(" +
            "https://cdn.jetphotos.com/full/5/60768_1635979380.jpg" +
            ")",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <FormItem type="primary" {...formItemLayout} label="E-mail" hasFeedback>
          <Input onChange={this.get_email} />
        </FormItem>
        <FormItem label="Password"  hasFeedback>
          <Input.Password onChange={this.get_password} />
        </FormItem>
        <FormItem label="Confirm Password" hasFeedback>
          <Input.Password onChange={this.get_confirm_passowrd} />
        </FormItem>
        <FormItem
          label={
            <span>
              Nickname&nbsp;
              <Tooltip title="What do you want other to call you?">
                {/* <Icon type="question-circle-o" /> */}
              </Tooltip>
            </span>
          }
          hasFeedback
        >
          <Input onChange={this.get_nickname} />
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" onClick={this.handleSubmit}>
            Register
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default HelloWorld;
