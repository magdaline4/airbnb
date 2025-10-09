import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import HomePage from "./Pages/home/Home.jsx";
import RoomPage from "./Pages/Room/RoomPage.jsx";
import RoomDetailPage from "./Pages/Room/RoomDetailPage.jsx";
import BookingRequestPage from "./Pages/Room/BookingRequestPage.jsx";
import HostOnboardingPage from "./Pages/Host/HostOnboardingPage.jsx";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomPage />} />
          <Route path="/rooms/:id" element={<RoomDetailPage />} />
          <Route path="/rooms/:id/book" element={<BookingRequestPage />} />
          <Route path="/host/onboarding" element={<HostOnboardingPage />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
