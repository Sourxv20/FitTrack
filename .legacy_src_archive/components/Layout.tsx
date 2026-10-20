import { Bell } from "lucide-react";
import Sidebar from "./Sidebar";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">

      <Sidebar />

      <main className="main-content">

        <header className="topbar">

          <button className="notification-button">
            <Bell size={20} />
          </button>

          <div className="top-avatar">
            SP
          </div>

        </header>

        {children}

      </main>

    </div>
  );
}

export default Layout;