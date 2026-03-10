import { Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

export default function AppLayout() {
  const { isAuthed, logout } = useAuth();

  return (
    <div>
      <Navbar isAuthed={isAuthed} logout={logout} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
