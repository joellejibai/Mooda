import { useLogout } from "../hooks/useLogout";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthPages } from "../hooks/useAuthPages";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
    const { logout } = useLogout();
    const { user } = useAuthPages();  // Get user authentication state
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleClick = () => logout();

    // Effect to listen to user login/logout changes
    useEffect(() => {
        // This ensures that when the user state changes, the component re-renders
    }, [user]);  // The component will re-render whenever `user` changes

    return (
        <header className="navbar">
            <div className="navbar-container">
                <Link to="/" className="logo">
                    <img src="/logo.png" alt="ModaNova Logo" />
                </Link>

                <div className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
                    <Link to="/" className="nav-link">Wardrobe</Link>
                    <div
                        className="dropdown"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                        style={{ position: "relative", zIndex: 1000 }}
                    >
                        {/* AboutUs button */}
                        <Link to="/AboutUs" className="dropdown-btn" style={{ display: "flex", alignItems: "center" }}>
                            AboutUs
                        </Link>

                        {/* Dropdown content (stays visible when hovering) */}
                        {isDropdownOpen && (
                            <ul className="dropdown-menu" style={{
                                position: "absolute",
                                top: "100%",
                                left: "0",
                                padding: "10px 0",
                                listStyle: "none",
                                margin: 0,
                                zIndex: 9999,
                            }}>
                                <li>
                                    <Link to="/fashiontips" style={{ display: "flex", alignItems: "center", padding: "10px 20px" }}>
                                        Fashion Tips
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contactUs" style={{ display: "flex", alignItems: "center", padding: "10px 20px" }}>
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </div>

                    {user ? (
                        <>
                            <Link to="/savedOutfits" className="nav-link">Profile</Link>
                            <Link to="/outfit" className="nav-link">DressUp</Link>
                            <button onClick={handleClick} className="nav-link">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/signup" className="nav-link">Sign Up</Link>
                        </>
                    )}
                </div>

                <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
