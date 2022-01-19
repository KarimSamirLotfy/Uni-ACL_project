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
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripPayPage from "./StripPayPage";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import Send_request from "../util/send_request";



const { Title } = Typography;

   const  options = {
      // passing the client secret obtained from the server
      clientSecret:
        "sk_test_51KHWXsLgiWcF7ZDafaMlq9FWUT5jo8jU6kP0tgomJm3lKfkUvyVMabgWq5e8ODY4X9jXei2ryfLQWYkNpj2DzDT700ahwa474v",
    };
   const stripe = loadStripe(
      "pk_test_51KHWXsLgiWcF7ZDaZjtY4a30WCMKUnX94ZJ0oRmtEsmcvddajlMkXaX9jfW5OhkcsUS8xz1EZRXb7dBPc4UYRiEa00D3YyVwsE"
    );

const PayPage = () => {

  const [flight, setFlight] = useState({});
  const [eco, setEco] = useState([]);
  const [business, setBusiness] = useState([]);
  const [first, setfirst] = useState([]);
  const [price, setPrice] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const reserve_seat=(flight_id, seat_nr, price)=>{


        // Creating a ticket
        Send_request("createTicket", {
          flight_id: flight["_id"],
          seat_nr,
          price,
        });

        console.log('Scucessfull created a ticket')
  }
  useEffect( async () => {
    const f = location.state.flight;
    setFlight(f);
    console.log(`paying for flight ${f}`);
    let res_eco = location.state.reserved_seats_eco;
    setEco(res_eco);
    let res_bui = location.state.reserved_seats_business;
    setBusiness(res_bui);
    let res_fir = location.state.reserved_seats_first;
    setfirst(res_fir);
    let price = f["price"];
    let total_price =
      res_eco.length * price +
      res_bui.length * (price * 1.2) +
      res_fir.length * (price * 1.4);
    setPrice(Math.floor(total_price));

    // 

    
  }, []);
  return (
    <div>
      <Flight flight={flight} />

      <Divider>First Class</Divider>
      {first.map((seat, index) => (
        <Tag key={index} color="magenta">
          {seat}
        </Tag>
      ))}
      <Divider>Buisness</Divider>

      {business.map((seat, index) => (
        <Tag key={index} color="cyan">
          {seat}
        </Tag>
      ))}
      <Divider>Economy</Divider>

      {eco.map((seat) => (
        <Tag color="green">{seat}</Tag>
      ))}

      <Title>Total Price</Title>
      <Row>
        <Col span={4}>
          <Title level={2}>{price}</Title>
        </Col>
        <Col>
          <Popconfirm
            placement="rightBottom"
            title={"Sure You want to Confirm Payment"}
            onConfirm={async () => {
              console.log("confirmed the payment");
              // Here we actually Pay we keda

              //
              // here we update database
              for (const seat of eco) {
                reserve_seat(flight["_id"], seat, price);
              }
              for (const seat of business) {
                reserve_seat(flight["_id"], seat, price * 1.2);
              }
              for (const seat of first) {
                reserve_seat(flight["_id"], seat, price * 1.4);
              }

              console.log("going to strip pay now");
              const data = {
                flight_id:flight["_id"],
                seat_price:parseInt(flight['price']) || 100,
                items: [
                  { id: "e", quantity: eco.length || 0 },
                  { id: "b", quantity: business.length || 0 },
                  { id: "f", quantity: first.length || 0 },
                ],
              };
              const { error, url, msg } = await Send_request("StripePay", data);

              window.open(url, "_blank");
              
            }}
            okText="Yes Pay"
            cancelText="Wait"
          >
           
              <Button>
                pay
              </Button>
            
          </Popconfirm>
        </Col>
      </Row>
    </div>
  );
};
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: "https://my-site.com/order/123/complete",
      },
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe}>Submit</button>
    </form>
  );
};

export default PayPage;
