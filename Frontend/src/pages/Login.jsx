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
    <div className="min-h-screen bg-[#09090b] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.05),rgba(255,255,255,0))] flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-[#09090b]/80 backdrop-blur-xl border border-[#27272a] p-8 rounded-2xl shadow-2xl">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-zinc-700 to-zinc-500 flex items-center justify-center shadow-lg shadow-zinc-500/10 mb-4">
            <Code2 size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm mt-2 text-center">
            Login to continue your coding journey.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Email */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-[#18181b]/60 border border-[#27272a] rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition duration-200"
                {...register("emailId")}
              />
            </div>
            <p className="text-rose-500 text-xs mt-1.5 ml-1">
              {errors.emailId?.message}
            </p>
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full bg-[#18181b]/60 border border-[#27272a] rounded-xl pl-10 pr-10 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition duration-200"
                {...register("password")}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-rose-500 text-xs mt-1.5 ml-1">
              {errors.password?.message}
            </p>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              className="text-xs text-gray-400 hover:text-white transition duration-200"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-medium py-3.5 rounded-xl shadow-lg shadow-zinc-500/5 hover:shadow-zinc-500/10 active:scale-[0.99] transition-all duration-200 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Logging In...
              </>
            ) : (
              "Login"
            )}
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-[#27272a]"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase tracking-wider">Or continue with</span>
            <div className="flex-grow border-t border-[#27272a]"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log("Login Failed")}
            />
          </div>

          {/* Signup */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-zinc-300 font-semibold hover:text-white hover:underline transition duration-200"
            >
              Create Account
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}