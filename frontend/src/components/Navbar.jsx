import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="navbar">

      <Link to="/home" className="logo">
        SocialHub
      </Link>

      <div className="nav-links">

        <Link to="/home">🏠 Home</Link>

        <Link to={`/profile/${user.username}`}>
          👤 Me
        </Link>

        <button onClick={logout}>
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;