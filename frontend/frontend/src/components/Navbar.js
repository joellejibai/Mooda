import { useLogout } from "../hooks/useLogout";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuthPages } from "../hooks/useAuthPages";

const Navbar = () => {
    const { logout } = useLogout();
    const { user } = useAuthPages();
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

                <nav>
                    {/* Contact Us with Hover Dropdown */}
                    <div
                        className="dropdown"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        <Link to="/" className="dropdown-btn" style={{ display: "flex", alignItems: "center" }}>
                            <img
                                src="/wardrobe.png"
                                alt="Wardrobe Icon"
                                style={{ width: "20px", height: "20px", marginRight: "8px" }}
                            />
                            Wardrobe
                        </Link>

                        {isDropdownOpen && (
                            <ul className="dropdown-menu">
                                <li>
                                    <Link to="/AboutUs">
                                        <img
                                            src="/aboutus.png"
                                            alt="About Icon"
                                            style={{ width: "30px", height: "20px", marginRight: "5px" }}
                                        />
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contactUs">
                                        <img
                                            src="/contactus.png"
                                            alt="Contact Icon"
                                            style={{ width: "30px", height: "20px", marginRight: "5px" }}
                                        />
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/fashiontips">
                                        <img
                                            src="/tips.png"
                                            alt="Fashion Tips Icon"
                                            style={{ width: "30px", height: "20px", marginRight: "5px" }}
                                        />
                                        Fashion Tips
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </div>

                    {user && (
                        <div className="nav-buttons" style={{ display: "flex", gap: "10px" }}>
                            <Link to="/dressUp" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                <img
                                    src="/dressup.png"
                                    alt="DressUp Icon"
                                    style={{
                                        width: "40px",
                                        height: "30px",
                                        marginRight: "5px",
                                        verticalAlign: "middle",
                                    }}
                                />
                                DressUp
                            </Link>
                            <button
                                onClick={handleClick}
                                style={{ display: "flex", alignItems: "center", gap: "5px" }}
                            >
                                <img
                                    src="/logout.png"
                                    alt="Logout Icon"
                                    style={{ width: "50px", height: "20px" }}
                                />
                                Logout
                            </button>
                        </div>
                    )}

                    {!user && (
                        <div style={{ display: "flex", gap: "10px" }}>
                            <Link
                                to="/login"
                                style={{ display: "flex", alignItems: "center", gap: "5px" }}
                            >
                                <img
                                    src="/login.png"
                                    alt="Login Icon"
                                    style={{ width: "20px", height: "20px" }}
                                />
                                Login
                            </Link>

                            <Link
                                to="/signup"
                                style={{ display: "flex", alignItems: "center", gap: "5px" }}
                            >
                                <img
                                    src="/signup.png"
                                    alt="Sign Up Icon"
                                    style={{ width: "20px", height: "20px" }}
                                />
                                Sign Up
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
