// Could work as an insert page in the right format as it was used to insert the initial flights
// change some of the input fields 
import React, { Component } from "react";
import { Link } from "react-router-dom";
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
  Card,
  Radio,
  DatePicker,
  Slider,
  Divider,
} from "antd";
import "antd/dist/antd.css";
import axios from "axios";

class SearchPage extends Component {
  state = {
    flights: [],
  };

  // handel changes
  handleChange = async (evt) => {
    const value = evt.target.value;
    console.log(typeof evt.target.value);
    this.setState({
      [evt.target.name]: typeof value === "string" ? value.trim() : value,
    }); // here SetState is async non bloking and making it bloking is bad so we change a opy of the state better
    const new_state_after_async_setState = this.state;
    new_state_after_async_setState[evt.target.name] = value;
    const { ["flights"]: deletedKey, ...querry } =
      new_state_after_async_setState; // as we do not want to send the flights from state but send eveything else
    const response = await axios.post("http://localhost:5000/get-flights", {
      querry: querry,
    });

    const flights = response["data"]["data"];
    console.log("recived updated flights: ", flights);
    this.setState({ flights: flights });
  };
  handleChangeDepartureDate = (evt) => {
    if (evt == null) return;
    const obj = {
      target: {
        name: "departure_time",
        value: evt._d,
      },
    };
    this.handleChange(obj);
  };
  handleChangePrice = (evt) => {
    const obj = {
      target: {
        name: "price",
        value: evt * 10,
      },
    };
    this.handleChange(obj);
  };
  handleChangeArrivalDate = (evt) => {
    if (evt == null) return;
    const obj = {
      target: {
        name: "arrival_time",
        value: evt._d,
      },
    };
    this.handleChange(obj);
  };

  handleSubmit = (e) => {
    console.log(this.state);
    axios
      .post("http://localhost:5000/RegisterFlight", this.state)
      .then((response) =>
        console.log("sucessfully saved\n" + JSON.stringify(this.state))
      );
  };
  render() {
    return (
      <div>
        <Form name="search from" layout="inline" onSubmit={this.handleSubmit}>
          <Row>
            <Col span={8}>
              <Form.Item name="departure_time" label="Departure Time">
                <DatePicker
                  onChange={this.handleChangeDepartureDate}
                  showTime
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="arrival_time" label="Arrival Time">
                <DatePicker
                  name="arrival_time"
                  onChange={this.handleChangeArrivalDate}
                  showTime
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item label="from">
                <Input name="from" onChange={this.handleChange} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="to">
                <Input name="to" onChange={this.handleChange} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={8}>
              <Form.Item label="trip duration">
                <Input name="duration" onChange={this.handleChange} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="flight number">
                <Input name="id" onChange={this.handleChange} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item label="Eco Seats">
                <Input name="Economy_seats" onChange={this.handleChange} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="High Class Seats">
                <Input
                  name="BusinessClass_seats"
                  onChange={this.handleChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item label="Terminal Departure">
                <Input name="terminal_deptarture" onChange={this.handleChange} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Terminal Arrival">
                <Input
                  name="terminal_arrival"
                  onChange={this.handleChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item name="price" label="Price">
                <Slider
                  onChange={this.handleChangePrice}
                  marks={{
                    0: "100",
                    20: "200",
                    40: "400",
                    60: "600",
                    80: "800",
                    100: "1000",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" onClick={this.handleSubmit}>
              Submit
            </Button>
          </Form.Item>
        </Form>
        
      </div>
    );
  }
}

export default SearchPage;
