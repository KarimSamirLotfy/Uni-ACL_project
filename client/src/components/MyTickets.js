import React, { Component, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Tabs,
  Divider,
  Tag,
  Typography,
  Popconfirm,
  Card,
} from "antd";
import "antd/dist/antd.css";
import {
  SketchOutlined,
  DingdingOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Seat from "./Seat";
import "../App.css";
import Flight from "./Flight";
import Ticket from './Ticket'
import Send_request from "../util/send_request";
const { Title } = Typography;

const PayPage = () => {

  const [tickets, setTickets] = useState([])
  const location = useLocation();
  const navigate = useNavigate();
  const reserve_seat = async (flight_id, seat_nr, price) => {
   
  };
  useEffect(async () => {
    try{
    let tickets = (await Send_request("get-user-tickets", {}))['tickets'];
    setTickets(tickets)
    console.log(`recived ${tickets}`);
    setTickets(tickets);
    } catch(e){
      console.log('redirecting to user')
      navigate("/LoginUser");}
  }, []);
  return <div>
    {tickets.map((ticket, index)=>
      <Card key={index}>
        <h1>Booking ID</h1>
        <h2>{ticket['_id']}</h2>
        <Button
        onClick={()=>{
          let params={ticket:ticket}
          navigate('../Ticket', {state:params})
        }}
        >Details</Button>
      </Card>
    )}
  </div>;
};

export default PayPage;
