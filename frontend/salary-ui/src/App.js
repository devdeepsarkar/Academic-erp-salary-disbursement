import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SalaryApp from "./pages/SalaryApp";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<SalaryApp />} />
    </Routes>
  );
}

export default App;
