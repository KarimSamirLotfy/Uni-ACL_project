import { Image, Avatar, Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

function AdminPage() {
  const navigate = useNavigate();
  return (
    <div>
      <Avatar
        src={
          <Image
            src="https://joeschmoe.io/api/v1/random"
            style={{
              width: 32,
            }}
          />
        }
      />

      <Button
        onClick={() => {
          navigate("../admin/ Flight");
        }}
      >
        Edit Flights
      </Button>
      <Button
        onClick={() => {
          navigate("../admin/CreateFlight");
        }}
      >
        Create Flight
      </Button>
    </div>
  );
}

export default AdminPage;
