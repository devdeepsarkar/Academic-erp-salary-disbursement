import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");

  // Check if user exists and has a valid employeeId
  if (!user) {
    return <Navigate to="/" replace />;
  }

  try {
    const userData = JSON.parse(user);
    if (!userData.employeeId) {
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    // Invalid JSON, redirect to login
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }

  return children;
}
