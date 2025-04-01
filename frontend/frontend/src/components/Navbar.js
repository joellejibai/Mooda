import { useLogout } from "../hooks/useLogout";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuthPages } from "../hooks/useAuthPages";



const Navbar = () => {
    const { logout } = useLogout();
    const { user} =useAuthPages()
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
                        <Link to="/" className="dropdown-btn">Wardrobe</Link>
                        {isDropdownOpen && (
                            <ul className="dropdown-menu">
                                <li><Link to="/AboutUs">About Us</Link></li>
                                <li><Link to="/contactUs">Contact Us</Link></li>
                                <li><Link to="/fashiontips">Fashion Tips</Link></li>
                            </ul>
                        )}
                    </div>
                    {user && (
                        <div>
                        <span> </span>
    <button onClick={handleClick}>Logout</button>
    <Link to="/DressUp">DressUp</Link>
</div>
)
}

                    {!user &&(
                        <div>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Sign Up</Link>
                    </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
