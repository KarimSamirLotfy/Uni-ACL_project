import logo from './logo.svg';
import './App.css';
import Guest from './components/Guest.js'
import Airplanes from './components/Airplanes.js';
import AllAirplanes from './components/AllAirplanes.js';
import LoginPage from './components/Login';
import SearchPage from './components/SearchPage'
import Reservedflights from './components/Reservedflights'
import HomeGuest from './components/HomeGuest'//home page that the guest gets to see when he logs in
import MyFlights from './components/myFlights'//page containing the flights of the user signed in
import UserAllFlights from './components/UserAllFlights'//contains all flights with an option to reserve it
import EditUser from './components/EditUser'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddAirplane from './components/AddAirplane';
import ReturnTrip from './components/ReturnTrip';
function App() {
  return (
    <div>
      <header></header>
      <Routes>
        <Route path="/" element={<AddAirplane />} exact />
        <Route path="/AddAirplane" element={<AddAirplane />} exact />
        <Route path="/ReturnTrip" element={<ReturnTrip />} exact />
        <Route path="/EditUser" element={<EditUser />} />
        <Route path="/SearchPage" element={<SearchPage />} exact />
        <Route path="/LoginUser" element={<LoginPage />} />
        <Route path="/ReservedFlights" element={<Reservedflights />} />
        <Route path="/myFlights" element={<MyFlights />} />
        <Route path="/userAllFlights" element={<UserAllFlights />} />
        <Route path="/RegisterUser" element={<Guest />} />
        <Route path="/AddAirplanes" element={<Airplanes />} />
        <Route path="/HomeGuest" element={<HomeGuest />} />
      </Routes>
    </div>
  );
}

export default App;
