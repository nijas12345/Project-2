import React, { useState, useEffect } from "react";
import {
  AtSymbolIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../Loader/Loader";
import { RootState } from "../redux/RootState/RootState";
import { AdminData, UserData } from "../apiTypes/apiTypes";
import { setAdminCredentials } from "../redux/Slices/AdminAuth";
import { userLogout } from "../redux/Slices/UserAuth";
import {
  googleAdminLogin,
  loginAdmin,
  logoutUser,
} from "../services/adminApi/adminAuthService";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const adminInfo = useSelector(
    (state: RootState): AdminData | null => state.adminAuth.adminInfo
  );
  const userInfo = useSelector(
    (state: RootState): UserData | null => state.userAuth.userInfo
  );

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (adminInfo) navigate("/admin/home");
  }, [adminInfo, navigate]);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const handleError = (message: string) => {
    toast.error(message || "Something went wrong, please try again later.");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!password) {
      toast.error("Please enter your password", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      setLoading(true);
      const data = await loginAdmin(email, password);
      setTimeout(() => {
        setLoading(false);
        dispatch(setAdminCredentials(data));
        navigate("/admin/home");
      }, 2000);
      if (userInfo) {
        await logoutUser();
        dispatch(userLogout());
      }
    } catch (error: unknown) {
      setLoading(false);

      if (error instanceof Error) {
        // `error.message` is already formatted from interceptor
        switch (error.message) {
          case "Email not found":
            handleError("Email not found");
            break;
          case "Wrong password":
            handleError("Password is wrong");
            break;
          case "Please login through google":
            handleError("Please use your Google account to log in. Thank you!");
            break;
          case "User is blocked":
            handleError(
              "Your account has been blocked. Please contact support."
            );
            break;
          default:
            handleError("Login failed. Please try again.");
        }
      } else {
        handleError("Unexpected error occurred.");
      }
    }
  };

  const handleGoogleLoginSuccess = async (response: any) => {
    try {
      setLoading(true);
      const data = await googleAdminLogin(response.credential);
      setTimeout(() => {
        setLoading(false);
        dispatch(setAdminCredentials(data));
        navigate("/admin/home");
      }, 2000);
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        const message = error.message;
        if (message === "User not found") {
          handleError("User not found");
        } else if (message === "User is blocked") {
          handleError("Your account has been blocked. Please contact support.");
        } else {
          handleError("An error occurred during login.");
        }
      } else {
        handleError("Unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* Left Section */}
          <div className="lg:w-1/2 w-full h-1/2 lg:h-full relative bg-gray-100">
            <img
              src="/images/card.png"
              alt="landing"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
              <h1 className="text-4xl lg:text-5xl text-white font-bold">
                Welcome!
              </h1>
              <p className="text-lg lg:text-2xl text-white mt-4">
                Access your projects seamlessly.
              </p>
            </div>
            <div className="absolute top-8 left-6 text-2xl text-white font-bold">
              <button
                onClick={() => navigate("/")}
                className="text-2xl font-bold bg-transparent border-none cursor-pointer"
              >
                Projec<span className="text-[#00A3FF]">-X</span>
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:w-1/2 w-full h-1/2 lg:h-full flex justify-center items-center bg-white p-4">
            <div className="p-6 w-full max-w-sm">
              <h2 className="hidden lg:block text-2xl font-bold text-center mb-6">
                Login
              </h2>

              <GoogleLogin
                shape="circle"
                logo_alignment="center"
                size="large"
                onSuccess={handleGoogleLoginSuccess}
              />

              <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
                {/* Email Input */}
                <div className="flex items-center border rounded-md p-2">
                  <AtSymbolIcon className="h-6 w-6 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 pl-2 bg-transparent outline-none text-sm"
                  />
                </div>

                {/* Password Input */}
                <div className="flex items-center border rounded-md p-2">
                  <LockClosedIcon className="h-6 w-6 text-gray-400" />
                  <input
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="flex-1 pl-2 bg-transparent outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="ml-2"
                  >
                    {passwordVisible ? (
                      <EyeSlashIcon className="h-6 w-6 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="flex justify-end items-center text-sm">
                  {/* <label>
                    <input type="checkbox" className="mr-2" /> Remember me
                  </label> */}
                  <button
                  type="button"
                    onClick={() => {
                      navigate("/admin/forgot");
                    }}
                    className="text-blue-500"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="bg-indigo-600 text-white w-full py-2 rounded-md hover:bg-indigo-700 transition"
                >
                  Log In
                </button>

                <p className="text-center mt-4 text-sm">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/admin/sign-in")}
                    className="text-blue-500"
                  >
                    Sign Up
                  </button>
                </p>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminLogin;
