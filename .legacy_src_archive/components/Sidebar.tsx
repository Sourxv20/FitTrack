import {
  Home as HomeIcon,
  Dumbbell,
  Footprints,
  TrendingUp,
  User,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="logo-section">
        <div className="logo-box">FT</div>

        <div>
          <h2>FITTRACK</h2>
          <span>GYM + RUNNING</span>
        </div>
      </div>

      <div className="menu-title">
        MENU
      </div>

      <nav>

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <HomeIcon size={19} />
          Home
        </NavLink>

        <NavLink
          to="/gym"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <Dumbbell size={19} />
          Gym
        </NavLink>

        <NavLink
          to="/running"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <Footprints size={19} />
          Running
        </NavLink>

        <NavLink
          to="/progress"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <TrendingUp size={19} />
          Progress
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <User size={19} />
          Profile
        </NavLink>

      </nav>

      <div className="sidebar-user">

        <div className="avatar">
          SP
        </div>

        <div>
          <strong>Sourav Pandey</strong>
          <span>Intermediate</span>
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;