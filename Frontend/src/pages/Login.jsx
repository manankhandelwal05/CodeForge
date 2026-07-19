import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/loginSchema";
// import {loginUser} from '../authSlice'
import { loginUser, checkAuth } from "../authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate ,Link} from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axiosClient from "../utils/axiosClient";

import { useEffect } from "react";
// import { Link } from "react-router-dom";
import {
  Code2,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated,navigate]);
  const onSubmit = (data) => {
    // console.log(data);
    dispatch(loginUser(data)) ;
  };

  const handleGoogleLogin = async (credentialResponse) => {

    try{

        const response = await axiosClient.post(
            "/user/google-login",
            {
                credential:
                credentialResponse.credential
            }
        );

        await dispatch(checkAuth());
        navigate("/");


        console.log(response.data);

    }catch(err){

        console.log(err);

    }

}

  return (
    <div className="min-h-screen bg-black flex justify-center items-center px-4">

      <div className="w-full max-w-md">

        {/* Logo */}

        <div className="flex flex-col items-center mb-10">

          <div className="mb-4">
            <Code2
              size={50}
              className="text-white"
            />
          </div>

          <h1 className="text-4xl font-light text-white">

            Welcome to{" "}

            <span className="font-bold">
              CodeForge
            </span>

          </h1>

          <p className="text-gray-400 mt-3 text-center">
            Login to continue your coding journey.
          </p>

        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >

          {/* Email */}

          <div>

            <label className="w-full input input-bordered bg-black border-gray-700 flex items-center gap-3 h-14">

              <Mail
                size={18}
                className="text-gray-400"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="grow bg-transparent text-white"
                {...register("emailId")}
              />

            </label>

            <p className="text-error text-sm mt-1">
              {errors.email?.message}
            </p>

          </div>

          {/* Password */}

          <div>

            <label className="w-full input input-bordered bg-black border-gray-700 flex items-center gap-3 h-14">

              <Lock
                size={18}
                className="text-gray-400"
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                className="grow bg-transparent text-white"
                {...register("password")}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <EyeOff
                    size={18}
                    className="text-gray-400"
                  />
                ) : (
                  <Eye
                    size={18}
                    className="text-gray-400"
                  />
                )}
              </button>

            </label>

            <p className="text-error text-sm mt-1">
              {errors.password?.message}
            </p>

          </div>

          {/* Forgot Password */}

          <div className="text-right">

            <button
              type="button"
              className="text-sm text-gray-400 hover:text-white duration-200"
            >
              Forgot Password?
            </button>

          </div>

          {/* Login Button */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-neutral w-full h-14 text-lg rounded-xl"
          >

            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Logging In...
              </>
            ) : (
              "Login"
            )}

          </button>
          <div className="divider">OR</div>

<GoogleLogin
    onSuccess={handleGoogleLogin}
    onError={() => console.log("Login Failed")}
/>

          {/* Signup */}

          <p className="text-center text-gray-400">

            Don't have an account?{" "}

            <Link
              to="/signup"
              className="text-white font-semibold hover:underline"
            >
              Create Account
            </Link>

          </p>

        </form>
        

      </div>

    </div>
  );
}