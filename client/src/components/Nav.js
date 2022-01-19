import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Avatar, Button } from "antd";
import { UserOutlined, VerticalLeftOutlined } from "@ant-design/icons";
import Title from "antd/lib/skeleton/Title";
import { Context } from "./Contexts";

const { Header, Content, Footer } = Layout;
const Nav = ({}) => {
  const location = useLocation();
  const { user } = useContext(Context);
  const navigate = useNavigate();
  return (
    <div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
        <Menu.Item>
          <Title>{location.pathname || "Home"}</Title>
        </Menu.Item>
        <Menu.Item>
          <Link to="/SearchPage">Search Flights</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/FavFlights">Favorites</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/MyTickets">My Tickets</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/Fav"></Link>
        </Menu.Item>
        <Menu.Item>
          <Link to={"/EditUser"} style={{ marginLeft: "auto" }}>
            <Avatar
              style={{ backgroundColor: "#87d068" }}
              icon={<UserOutlined />}
            />
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Button onClick={()=>{
            console.log('Logout user')
            localStorage.setItem('token', undefined)
            navigate('../')
          }}>Log out</Button>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Nav;
