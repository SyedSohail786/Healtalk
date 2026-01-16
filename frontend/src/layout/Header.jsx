import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  if (location.pathname === "/" || location.pathname === "/register") {
    return (
      <header className="header">
        <h2>HealTalk</h2>
        <nav>
          {!user && (
            <>
              <Link to="/">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
    );
  }

  return (
    <header className="header">
      <h2>HealTalk</h2>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <span onClick={() => {
          localStorage.removeItem("user");
          window.location.href = "/";
        }}>Logout</span>
      </nav>
    </header>
  );
}
