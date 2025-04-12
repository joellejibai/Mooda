import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./index.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ContactUs from "./pages/contactUs";
import FashionTips from "./pages/fashiontips";
import AboutUs from "./pages/aboutus";
import DressUp from "./pages/DressUp";
import Virtual from "./pages/virtual";
import Outfit from "./pages/outfit";
import Plan from "./pages/plan";  // Correct the path if needed
import Footer from "./components/Footer";
import MoreTips from "./pages/moretips";
import VirtualFit from "./pages/virtualfit";


function Pages() {
  const location = useLocation();
  const background =
    location.pathname === "/contactUs" ||
      location.pathname === "/fashiontips" ||
      location.pathname === "/AboutUs"||
      location.pathname === "/moretips"
      ? "url('/contactus1.png')"
      : "url('/home.jpg')";

  return (
    <div
      style={{
        backgroundImage: background,
        backgroundSize: "cover",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <div className="pages">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dressUp" element={<DressUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/fashiontips" element={<FashionTips />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/virtual" element={<Virtual />} />
          <Route path="/outfit" element={<Outfit />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/moretips" element={<MoreTips />} />
          <Route path="/virtualfit" element={<VirtualFit />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Pages />
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
