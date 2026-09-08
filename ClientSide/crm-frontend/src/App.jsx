import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/dashboard" />}
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