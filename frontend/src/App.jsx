import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/home/Home";
import Service from "./Pages/services/service";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<Service/>} />
      </Routes>
    </Router>
  );
}

export default App;
