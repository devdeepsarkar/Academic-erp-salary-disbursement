import { GoogleLogin } from "@react-oauth/google";

export default function GoogleLoginButton({ onSuccess }) {
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        onSuccess(credentialResponse.credential);
      }}
      onError={() => {
        alert("Login Failed");
      }}
    />
  );
}
