import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import "./index.css";

// Pages and components
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ContactUs from './pages/contactUs'; // Capitalized 'ContactUs'
import FashionTips from './pages/fashiontips'; 
import AboutUs from './pages/aboutus'; 

import DressUp from './pages/DressUp';  // Ensure the path is correct

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/dressUp" element={<DressUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} /> 
            <Route path="/contactUs" element={<ContactUs />} /> 
            <Route path="/virtual" element={<virtual />} /> 
            <Route path="/fashiontips" element={<FashionTips />} />
            <Route path="/aboutus" element={<AboutUs />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
