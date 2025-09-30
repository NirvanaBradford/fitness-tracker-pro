import { NavLink } from "react-router";

/** Navbar with site navigation links */
export default function Navbar() {
  return (
    <header>
      <p>Fitness Trackr</p>
      <nav>
        <NavLink
          to="/activities"
          className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? "active" : ""
          }
        >
          Activites
        </NavLink>
        <NavLink
          to="/register"
          className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? "active" : ""
          }
        >
          Register
        </NavLink>
        <NavLink
          to="/login"
          className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? "active" : ""
          }
        >
          Login
        </NavLink>
      </nav>
    </header>
  );
}
