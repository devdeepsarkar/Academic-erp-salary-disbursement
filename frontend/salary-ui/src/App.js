import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SalaryApp from "./pages/SalaryApp";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Protected route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <SalaryApp />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
