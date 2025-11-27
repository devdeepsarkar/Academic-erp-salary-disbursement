import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleSuccess = async (googleResponse) => {
    const googleToken = googleResponse.credential;

    try {
      const response = await fetch("http://localhost:8080/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken }),
      });

      if (!response.ok) {
        const msg = await response.text();
        alert(msg || "Unauthorized user!");
        return;
      }

      const data = await response.json();

      // Save user data to localStorage (no JWT)
      localStorage.setItem(
        "user",
        JSON.stringify({
          employeeId: data.employeeId,
          name: data.name,
          email: data.email,
          department: data.department,
        })
      );

      navigate("/dashboard");
    } catch (e) {
      alert("Login Failed: " + e.message);
    }
  };

  const handleError = () => {
    alert("Google authentication failed.");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center space-y-6 w-[400px]">
        <h1 className="text-3xl font-bold text-gray-700">Payroll Login</h1>

        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />

        <p className="text-xs text-gray-400">Secure Google OAuth Login</p>
      </div>
    </div>
  );
}
