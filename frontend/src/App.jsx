import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/home/Home.jsx";
import Service from "./Pages/services/service.jsx";
import RoomPage from "./Pages/Room/RoomPage.jsx";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<Service/>} />
         <Route path="/rooms" element={<RoomPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
