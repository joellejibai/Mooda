import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <header>
            <div className="container">
                <Link to="/">
                    <img src="/logo.png" alt="ModaNova Logo" />
                </Link>
                <span className="view">
                    <Link to="/view-all">
                        <h2>Items</h2>
                    </Link>
                    <nav>
                        <div>
                            <Link to="/login">Login</Link>
                            <Link to="/signup">Signup</Link>
                        </div>
                    </nav>

                </span>
            </div>
        </header>
    );
};

export default Navbar;
