import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import ProtectedRoutes from "../ProtectedRoutes";

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
          element={ <ProtectedRoutes>
            <Dashboard/>
          </ProtectedRoutes>}
        />

       

        <Route
          path="/clients"
          element={ <ProtectedRoutes>
            <Clients/>
          </ProtectedRoutes>}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;