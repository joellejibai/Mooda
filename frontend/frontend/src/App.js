import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import "./index.css";

// Pages and components
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';import ContactUs from './pages/contactUs'; // Capitalized 'ContactUs'
import FashionTips from './pages/fashiontips'; // Adjust the path if necessary
import AboutUs from './pages/aboutus'; // Adjust the path if necessary


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/ressUp" element={<dressUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} /> 
            <Route path="/contactUs" element={<ContactUs />} /> 
            <Route path="/fashiontips" element={<FashionTips/> } />
            <Route path="/aboutus" element={<AboutUs/> } />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
