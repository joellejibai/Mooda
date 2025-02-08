import { useLogout } from "../hooks/useLogout"
import { useAuthPages } from "../hooks/useAuthPages"
import { Link } from "react-router-dom"

const Navbar = () => {
    const { logout } = useLogout()
    const handelClick = () => {
        logout()
    }

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
                </span>
                
               <nav>
                    <div>
                        
                        <button onClick={handelClick}>Logout</button>
                    </div>
                
                    <div>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Sign Up</Link>
                    </div>
                    </nav>
            </div>
        </header>
    )
}

export default Navbar
