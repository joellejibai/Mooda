import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import "./index.css";

// Pages and components
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ViewAll from './pages/ViewAll';
import contactUs from './pages/contactUs'; // Fixed: Capitalized

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/view-all" element={<ViewAll />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} /> 
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
