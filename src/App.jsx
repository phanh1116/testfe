import Navbar from "@/components/Navbar";
import PrivateRoute from "@/components/PrivateRoute";
import Admin from "@/pages/Admin";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import { useLocalStorage } from "@/util/useLocalStorage";
import { Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Signup from "@/pages/Signup";

function App() {
  const location = useLocation();

  const [role, setRole] = useLocalStorage("", "role");

  return (
    <>
      {!["/login", "/signup"].includes(location.pathname) ? <Navbar /> : null}
      <Routes>
        <Route
          path="/profile"
          element={
            role === "USER" ? (
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            ) : (
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            )
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
