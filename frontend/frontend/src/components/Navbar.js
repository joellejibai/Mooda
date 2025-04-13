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
                    <div className="nav-bar" style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                        {/* Wardrobe */}
                        <Link to="/" className="nav-link" style={{ display: "flex", alignItems: "center" }}>
                            <img
                                src="/wardrobe.png"
                                alt="Wardrobe Icon"
                                style={{ width: "20px", height: "20px", marginRight: "8px" }}
                            />
                            Wardrobe
                        </Link>

                        

                        {/* About Us with dropdown */}
                        <div
                            className="dropdown"
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                            style={{ position: "relative" }}
                        >
                            <Link to="/AboutUs" className="dropdown-btn" style={{ display: "flex", alignItems: "center" }}>
                                <img
                                    src="/aboutus.png"
                                    alt="About Icon"
                                    style={{ width: "30px", height: "20px", marginRight: "8px" }}
                                />
                                AboutUs
                            </Link>

                            {isDropdownOpen && (
                                <ul className="dropdown-menu" style={{
                                    position: "absolute",
                                    top: "100%",
                                    left: "0",
                                    padding: "10px",
                                    listStyle: "none",
                                    margin: 0,
                                }}>
                                    <li>
                                        <Link to="/fashiontips" style={{ display: "flex", alignItems: "center", padding: "5px 0" }}>
                                            <img
                                                src="/tips.png"
                                                alt="Fashion Tips Icon"
                                                style={{ width: "30px", height: "20px", marginRight: "5px" }}
                                            />
                                            Fashion Tips
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/contactUs" style={{ display: "flex", alignItems: "center", padding: "5px 0" }}>
                                            <img
                                                src="/contactus.png"
                                                alt="Contact Icon"
                                                style={{ width: "30px", height: "20px", marginRight: "5px" }}
                                            />
                                            Contact Us
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>

                    {user && (
                        
                        <div className="nav-buttons" style={{ display: "flex", gap: "10px" }}>
                            <Link to="/savedOutfits" className="nav-link" style={{ display: "flex", alignItems: "center" }}>
                            <img
                                src="/savedoutfits.png" // Replace with a valid icon path or image
                                alt="Saved Outfits Icon"
                                style={{ width: "20px", height: "20px", marginRight: "8px" }}
                            />
                            Profile
                        </Link>
                            <Link to="/outfit" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                <img
                                    src="/dressup.png"
                                    alt="DressUp Icon"
                                    style={{
                                        width: "35px",
                                        height: "25px",
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
                            <Link to="/login" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                <img
                                    src="/login.png"
                                    alt="Login Icon"
                                    style={{ width: "20px", height: "20px" }}
                                />
                                Login
                            </Link>

                            <Link to="/signup" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
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
