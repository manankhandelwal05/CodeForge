import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import {registerUser} from '../authSlice'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { signupSchema } from "../schemas/signupSchema";
import { GoogleLogin } from "@react-oauth/google";
import axiosClient from "../utils/axiosClient";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated} = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated,navigate]);
  
  const onSubmit = (data) => {
    dispatch(registerUser(data)) ;
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

        <div className="text-center mb-10">

          <div className="text-5xl mb-3">{`{}`}</div>

          <h1 className="text-5xl font-semibold text-white">
            Welcome to <span className="font-bold">CodeForge</span>
          </h1>

        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >

          {/* First Name */}

          <div>
            <input
              type="text"
              placeholder="First Name"
              className="input input-bordered bg-black border-gray-700 w-full text-white focus:border-white"
              {...register("firstName")}
            />

            <p className="text-red-500 text-sm mt-1">
              {errors.firstName?.message}
            </p>
          </div>

          {/* Last Name */}

          <div>
            <input
              type="text"
              placeholder="Last Name"
              className="input input-bordered bg-black border-gray-700 w-full text-white focus:border-white"
              {...register("lastName")}
            />

            <p className="text-red-500 text-sm mt-1">
              {errors.lastName?.message}
            </p>
          </div>

          {/* Email */}

          <div>
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered bg-black border-gray-700 w-full text-white focus:border-white"
              {...register("emailId")}
            />

            <p className="text-red-500 text-sm mt-1">
              {errors.email?.message}
            </p>
          </div>

          {/* Password */}

          <div>
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered bg-black border-gray-700 w-full text-white focus:border-white"
              {...register("password")}
            />

            <p className="text-red-500 text-sm mt-1">
              {errors.password?.message}
            </p>
          </div>

          {/* Button */}

          <button
            className="btn w-full bg-neutral text-white hover:bg-neutral-focus border-none text-lg"
            // type="submit"
            // disabled={loading}

          >
            Create Account
            
          </button>
          {/* <GoogleLogin
    onSuccess={handleGoogleLogin}
    onError={() => console.log("Login Failed")}
/> */}

          {/* Login */}

          <div className="text-center mt-6">

            <p className="text-gray-400">

              Already have an account?

              <Link
              to="/login"
              className="text-white font-semibold hover:underline"
            >
              Login
            </Link>

            </p>

          </div>

        </form>

      </div>

    </div>
  );
}

