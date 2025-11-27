import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);

    // Save user details
    localStorage.setItem("user", JSON.stringify({
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture,
    }));

    navigate("/dashboard");
  };

  const handleError = () => {
    alert("Google login failed!");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-100 to-gray-300">

      <div className="bg-white p-8 rounded-3xl shadow-xl w-[380px] text-center">

        <h1 className="text-3xl font-extrabold text-gray-800">
          Payroll Login
        </h1>

        <p className="text-gray-500 mb-6">
          Sign in using your Google account
        </p>

        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Secure authentication powered by Google OAuth
        </p>
      </div>

    </div>
  );
}
