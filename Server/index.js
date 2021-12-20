import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import crypto, { createDecipheriv } from "crypto";
//
import userDataSchema from "./models/UserDataSchema.js";
import flightSchema from "./models/FlgihtsSchema.js";
import { timeDiffCalc } from "./util/diffrenceHours.js";
import { create_functional_querry_from_request } from "./util/querry_func.js";
import CreateSeatsObject from "./util/CreateSeatsObject.js";
//
console.log("server is running");

const app = express();
const Schema = mongoose.Schema;

app.use(express.json({ limit: "30mb", extended: "true" })); //Used to parse JSON bodies
app.use(express.urlencoded({ limit: "30mb", extended: "true" }));
app.use(
  cors({
    origin: "*",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  })
);

// Connect to DB and Server
const CONNECTION_URL =
  "mongodb+srv://karim:karim@cluster0.gmzul.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;
mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, UseUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => console.log(`server running on port:${PORT}`))
  )
  .catch((error) => console.log(error.message));

// Data Models
var UserData = mongoose.model("UserData", userDataSchema);
let flightData = mongoose.model("flightData", flightSchema);
// GET REQUESTS
// get request get-data to get all users
app.get("/get-data", function (req, res) {
  //to get all users
  UserData.find().then(function (doc) {
    console.log("all users " + doc);
  });
});
app.get("/get-all-flights", function (req, res) {
  //to get all users
  flightData.find().then(function (doc) {
    res.status(200).json({ data: doc });
  });
});

app.post("/get-seats", async (req, res) => {
  const flight_id = req.body?.flight_id;
  const flight = await flightData.findById(flight_id);
  console.log(flight);
  res.status(201).send({ seat: flight["Seats"] });
});
app.post("/get-flights", async function (req, res) {
  //to get all users
  console.log(req.body.querry);
  const querry = req.body.querry;
  const returned_response = await create_functional_querry_from_request(querry);
  res.status(200).send({ data: returned_response });
});

// POST REQUESTS
app.post("/", (req, res) => {
  console.log("request sent", req.body);
});
// post request to post a user
app.post("/RegisterUser", function (req, res) {
  console.log(
    "in the post method server resived post request with body:\n" +
      JSON.stringify(req.body)
  );
  const {
    user_email,
    user_password,
    user_passport_number,
    user_first_name,
    user_last_name,
    user_home_address,
    user_nickname,
    user_contry_code,
    user_telephone_number,
  } = req.body;
  var item = {
    email: user_email,
    password: user_password,
    nickname: user_nickname,
    first_name: user_first_name,
    last_name: user_last_name,
    home_address: user_home_address,
    contry_code: user_contry_code,
    telephone_number: user_telephone_number,
    passport: user_passport_number,
  };
  var data = new UserData(item);
  data
    .save()
    .then((doc) => {
      console.log("saved sucess " + doc);
      res.status(200).json({ status: "ok" }); // this means that it was great and it worked quiet well if i can say so myself
    })
    .catch((err) => {
      console.error(err);
    });
});

app.post("/RegisterFlight", function (req, res) {
  console.log(
    "in the post method server resived post request with body:\n" +
      JSON.stringify(req.body)
  );
  const {
    id,
    name,
    seat_number,
    duration,
    arrival_time,
    departure_time,
    from,
    to,
    price,
    baggage_allowance,
    BusinessClass_seats,
    Economy_seats,
  } = req.body;
  // TODO: first class seats == buissness class seats
  var item = {
    id: id,
    name: name,
    seat_number: seat_number,
    duration: timeDiffCalc(
      Date.parse(arrival_time),
      Date.parse(departure_time)
    ), // departure_time.diff(arrival_time, 'hours'),
    arrival_time: arrival_time,
    departure_time: departure_time,
    from: from,
    to: to,
    price: price,
    baggage_allowance: baggage_allowance,
    BusinessClass_seats: BusinessClass_seats,
    Economy_seats: Economy_seats,
    Seats: CreateSeatsObject(
      Economy_seats,
      BusinessClass_seats,
      BusinessClass_seats // this is not truly correct but assume # of first class seats == buissness class seats TODO:
    ),
  };
  var data = new flightData(item);
  data
    .save()
    .then((doc) => {
      console.log("saved sucess " + doc);
      res.status(200).json({ status: "ok" }); // this means that it was great and it worked quiet well if i can say so myself
    })
    .catch((err) => {
      console.error(err);
    });
});

app.post("/LoginUser", function (req, res) {
  console.log(
    "in the post method server resived post request with body:\n" +
      JSON.stringify(req.body)
  );
  console.log(req.body.user_email);
  console.log(req.body.user_password);

  let querry = {
    email: req.body.user_email,
    password: req.body.user_password,
  };
  UserData.findOne(querry)
    .then(function (doc) {
      if (doc) {
        console.log("found user login successfull" + doc);
        res.status(200).json({ status: "ok", success: true, err: null }); // this means that it was great and it worked quiet well if i can say so myself
      } else {
        //nothing found then return bad
        console.log("no user found with " + querry);
        res
          .status(200)
          .json({ status: "ok", success: false, err: "Invalid Credentials" });
      }
    })
    .catch((err) => console.error(err));
});

app.post("/ReserveSeats", async (req, res) => {
  console.log("reserving seats:\n" + JSON.stringify(req.body));
  const { flight_id, reserved_seats, seat_class } = req.body;
  const flight = await flightData.findById(flight_id).then((doc) => {
    for (const reserved_seat of reserved_seats) {
      doc.Seats[seat_class].set(reserved_seat, "taken"); // setting these seats to taken in this seat class
    }
    doc.save().then((doc) => {
      console.log(`saved seats successfully`);
      res.status(200).json({ status: "ok", success: true, err: null }); // this means that it was great and it worked quiet well if i can say so myself
    });
  });
});

export default app;
