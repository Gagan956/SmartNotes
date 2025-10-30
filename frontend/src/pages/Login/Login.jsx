import React, { useState, useEffect } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/user/userSlice";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state?.user?.currentUser);

  useEffect(() => {
    if (currentUser) {
      navigate("/", { replace: true });
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");
    dispatch(signInStart());

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );

      // If backend sends success:false
      if (res.data.success === false) {
        const message =
          res.data.message || "Username or password might be wrong";
        setError(message);
        toast.error(message);
        dispatch(signInFailure(message));
        return;
      }

  toast.success("Login successful!");
  dispatch(signInSuccess(res.data));
  navigate("/", { replace: true });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const message = "Username or password might be wrong";
        setError(message);
        toast.error(message);
        dispatch(signInFailure(message));
      } else {
        const message = error.response?.data?.message || error.message;
        setError(message);
        toast.error(message);
        dispatch(signInFailure(message));
      }
    }
  };

  return (
    <div className="flex items-center justify-center mt-28">
      <div className="w-96 border rounded bg-white px-7 py-10">
        <form onSubmit={handleLogin}>
          <h4 className="text-2xl mb-7">Login</h4>

          <input
            type="text"
            placeholder="Email"
            className="input-box"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm pb-1">{error}</p>}

          <button type="submit" className="btn-primary">
            LOGIN
          </button>

          <p className="text-sm text-center mt-4">
            Not registered yet?{" "}
            <Link
              to={"/signup"}
              className="font-medium text-[#2B85FF] underline"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
