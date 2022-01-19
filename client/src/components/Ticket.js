import React, { Component, Fragment } from "react";
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
  Typography,
  Space,
  PageHeader,
  Alert,
  Popconfirm,
} from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { DownloadOutlined } from "@ant-design/icons";
import "../App.css";
import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import Send_request from "../util/send_request";

const { Text, Link } = Typography;

const Ticket = ({  }) => {
  const [start_date, setStart_date] = useState(0);
  const [end_date, setEnd_date] = useState(2);
  const [from, setFrom] = useState(3);
  const [to, setTo] = useState(4);
  const [tripduration, setTripduration] = useState(5);
  const [flight_id, setFlight_id] = useState(6);
  const [user_email, setUser_email] = useState("");
  const [price, setPrice] = useState(8);
  const [seat_nr, setSeat_nr] = useState("E0");
  const [ticket, setTicket] = useState({})
  const [flight, setFlight] = useState({})
  const location = useLocation();
  const navigate = useNavigate();
  
  const [msg, setMsg] = useState("")
  useEffect(async () => {
    let ticket = location.state.ticket; // get from nav
    let {flight} = await Send_request("get-flight", { flight_id: ticket.IDFlight });
   console.log('got flight data = ', flight);
    const { user } =  await Send_request("get-user");
    
    console.log(
      `ticket ${JSON.stringify(location.state)}, flight:${JSON.stringify(
        flight
      )}\nuser:${JSON.stringify(user)}`
    );
    setStart_date(`${new Date(flight["departure_time"])}`);
    setEnd_date(`${new Date(flight["arrival_time"])}`);
    setFrom(flight["from"]);
    setTo(flight["to"]);
    setTripduration(flight["duration"]);
    setFlight_id(flight["id"]);
    setUser_email(user["email"]);
    setPrice(ticket["price"]);
    setSeat_nr(ticket["seat_number"]);
    setFlight(flight)
    setTicket(ticket)
  }, []);
  return (
    <div className="card-container">
      <Card title="TICKET" style={{ width: 900 }}>
        <Form name="search from" layout="inline">
          <Row>
            <Col span={10} align="center">
              <Form.Item name="start_date" label="Departure Time">
                {start_date}
              </Form.Item>
            </Col>
            <Col span={10} align="center">
              <Form.Item name="end_date" label="Arrival Time">
                {end_date}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={10} align="center">
              <Form.Item label="from">{from}</Form.Item>
            </Col>
            <Col span={10} align="center">
              <Form.Item label="to">{to}</Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={10} align="center">
              <Form.Item label="trip duration">{tripduration}</Form.Item>
            </Col>
            <Col span={10} align="center">
              <Form.Item label="flight id">{flight_id}</Form.Item>
            </Col>
            <Col span={10} align="center">
              <Form.Item label="email">{user_email}</Form.Item>
            </Col>
            <Col span={10} align="center">
              <Form.Item label="price">{price}</Form.Item>
            </Col>
          </Row>
          
          <Popconfirm
            placement="right"
            title="Are you sure you want to change this flight.This flight will be cancelled and a refund may take a few days."
            onConfirm={async () => {
              const { error, msg } = await Send_request("CancelTicket", {
                ticket_id: ticket["_id"],
                seat_nr: seat_nr,
                flight_id: flight["_id"],
              });
              console.log(
                `canceled ${ticket} seat number : ${seat_nr} from flight: ${flight}` +"Will redirect to search"
              );
              navigate("../SearchPage");
              if (!error) {
                setMsg(msg);
              }
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary">Change Flight</Button>
          </Popconfirm>
          <Popconfirm
            placement="right"
            title="Are you sure you want to cancel this flight a refund may take a few days"
            onConfirm={async () => {
              const { error, msg } = await Send_request("CancelTicket", {
                ticket_id: ticket["_id"],
                seat_nr: seat_nr,
                flight_id: flight["_id"],
              });
              console.log(
                `canceled ${ticket} seat number : ${seat_nr} from flight: ${flight}`
              );

              if (!error) {
                setMsg(msg);
              }
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Cancel</Button>
          </Popconfirm>

          {/* <img src="http://eslkidsgames.com/Flash/QR%20Code%20Maker/eslkidsgames.com.png"  alt="" title="Ticket" /> */}
          <Row>
            <Col span={8}>
              <QRCode value="https://thumbs.dreamstime.com/z/realistic-airline-ticket-boarding-pass-design-blue-unreal-flight-time-passenger-name-vector-illustration-pattern-136281503.jpg" />
            </Col>
            <Col span={8}>
              <PageHeader title={`Seat Number: ${seat_nr}`}></PageHeader>
            </Col>
          </Row>

          {msg != "" && (
            <Fragment>
              <Alert message="Cancled Ticet" type="success" />
              <Button
                onClick={() => {
                  navigate("../MyTickets");
                }}
              >
                My Tickets
              </Button>
            </Fragment>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default Ticket;
