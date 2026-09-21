import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/dashboard">CRM</Link>
      </div>

      <div className="navbar-links">
        <Link
          to="/dashboard"
          className={location.pathname === "/dashboard" ? "active" : ""}
        >
          Dashboard
        </Link>

        {/* <Link
          to="/add-client"
          className={location.pathname === "/add-client" ? "active" : ""}
        >
          Add Client
        </Link> */}

        <Link
          to="/clients"
          className={location.pathname === "/clients" ? "active" : ""}
        >
          Clients
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;