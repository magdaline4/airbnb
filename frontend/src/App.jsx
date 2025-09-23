import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/home/Home";
import Service from "./Pages/services/service";
import RoomPage from "./Pages/Room/RoomPage";


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
