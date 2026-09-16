import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/home" />}
        />
        <Route
        path="home"
        element={<Home/>}
        />
         <Route
        path="login"
        element={<LoginPage/>}
        />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/add-client"
          element={<LandingPage />}
        />

        <Route
          path="/clients"
          element={<Clients />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;