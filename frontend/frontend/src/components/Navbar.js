import { useLogout } from "../hooks/useLogout";
import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
    const { logout } = useLogout();
    const handleClick = () => {
        logout();
    };

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <header>
            <div className="container">
                <Link to="/">
                    <img src="/logo.png" alt="ModaNova Logo" style={{ width: "130px", height: "auto" }} />
                </Link>

                <span className="view">
                    <Link to="/view-all">
                        <h2>Items</h2>
                    </Link>
                </span>

                <nav>
                  

                    

                    {/* Contact Us with Hover Dropdown */}
                    <div 
                        className="dropdown"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        <Link to="/pages/Home" className="dropdown-btn">Wardrobe</Link>
                        {isDropdownOpen && (
                            <ul className="dropdown-menu">
                                <li><Link to="/contact/email">About Us</Link></li>
                                <li><Link to="/contact/phone">Contact Us</Link></li>
                                <li><Link to="/contact/social-media">Fashion Tips</Link></li>
                            </ul>
                        )}
                    </div>
                    <div>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Sign Up</Link>
                    </div>
                    <div>
    <button onClick={handleClick}>Logout</button>
</div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
