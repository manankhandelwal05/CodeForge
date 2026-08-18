import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { registerUser, sendOtp, checkAuth } from "../authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signupSchema } from "../schemas/signupSchema";
import { GoogleLogin } from "@react-oauth/google";
import axiosClient from "../utils/axiosClient";
import { Code2, Mail, Lock, User, KeyRound, ArrowLeft, Loader2 } from "lucide-react";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Form handling
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  // OTP State Machine
  const [showOtp, setShowOtp] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [signupPayload, setSignupPayload] = useState(null);
  
  // Local loading / error
  const [localError, setLocalError] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  const otpInputsRef = useRef([]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (showOtp && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [showOtp, otpTimer]);

  // Auto-focus OTP inputs sequence
  const handleOtpChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.slice(-1); // only keep last character
    setOtpValues(newOtpValues);
    setLocalError("");

    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const digits = pastedData.split("");
    setOtpValues(digits);
    otpInputsRef.current[5]?.focus();
  };

  // Dispatch OTP code request
  const onSubmitDetails = async (data) => {
    try {
      setLocalLoading(true);
      setLocalError("");
      await dispatch(sendOtp(data)).unwrap();
      setSignupPayload(data);
      setShowOtp(true);
      setOtpTimer(60);
      setCanResend(false);
      // Wait for DOM update, then focus first input
      setTimeout(() => otpInputsRef.current[0]?.focus(), 100);
    } catch (err) {
      setLocalError(err.message || "Failed to send verification code. Please try again.");
    } finally {
      setLocalLoading(false);
    }
  };

  // Final Registration Step
  const onVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otpValues.join("");
    if (otpCode.length < 6) {
      setLocalError("Please enter all 6 digits of the OTP code.");
      return;
    }

    try {
      setLocalLoading(true);
      setLocalError("");
      await dispatch(registerUser({
        emailId: signupPayload.emailId,
        otp: otpCode
      })).unwrap();
      navigate("/");
    } catch (err) {
      setLocalError(err.message || "Invalid or expired OTP code.");
    } finally {
      setLocalLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!signupPayload) return;
    try {
      setLocalLoading(true);
      setLocalError("");
      await dispatch(sendOtp(signupPayload)).unwrap();
      setOtpTimer(60);
      setCanResend(false);
      setOtpValues(["", "", "", "", "", ""]);
      setTimeout(() => otpInputsRef.current[0]?.focus(), 100);
    } catch (err) {
      setLocalError(err.message || "Failed to resend verification code.");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await axiosClient.post(
        "/user/google-login",
        {
          credential: credentialResponse.credential
        }
      );
      await dispatch(checkAuth());
      navigate("/");
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.05),rgba(255,255,255,0))] flex justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-[#09090b]/80 backdrop-blur-xl border border-[#27272a] p-8 rounded-2xl shadow-2xl transition-all duration-300">
        
        {/* Toggle between Signup details and OTP code verification */}
        {!showOtp ? (
          <>
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-zinc-700 to-zinc-500 flex items-center justify-center shadow-lg shadow-zinc-500/10 mb-4">
                <Code2 size={24} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white animate-fade-in">
                Create Account
              </h1>
              <p className="text-gray-400 text-sm mt-2 text-center font-normal">
                Join CodeForge to start sharpening your DSA skills.
              </p>
            </div>

            {localError && (
              <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-xl text-center">
                {localError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmitDetails)} className="space-y-5">
              
              {/* First Name */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full bg-[#18181b]/60 border border-[#27272a] rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition duration-200"
                    {...register("firstName")}
                  />
                </div>
                <p className="text-rose-500 text-xs mt-1.5 ml-1">
                  {errors.firstName?.message}
                </p>
              </div>

              {/* Last Name */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full bg-[#18181b]/60 border border-[#27272a] rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition duration-200"
                    {...register("lastName")}
                  />
                </div>
                <p className="text-rose-500 text-xs mt-1.5 ml-1">
                  {errors.lastName?.message}
                </p>
              </div>

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
                    type="password"
                    placeholder="Password"
                    className="w-full bg-[#18181b]/60 border border-[#27272a] rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition duration-200"
                    {...register("password")}
                  />
                </div>
                <p className="text-rose-500 text-xs mt-1.5 ml-1">
                  {errors.password?.message}
                </p>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={localLoading}
                className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-medium py-3.5 rounded-xl shadow-lg shadow-zinc-500/5 hover:shadow-zinc-500/10 active:scale-[0.99] transition-all duration-200 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {localLoading ? (
                  <>
                    <Loader2 className="animate-spin text-zinc-950" size={18} />
                    Sending OTP...
                  </>
                ) : (
                  "Create Account"
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

              {/* Login Link */}
              <div className="text-center mt-6">
                <p className="text-gray-400 text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-zinc-300 font-semibold hover:text-white hover:underline transition duration-200"
                  >
                    Login
                  </Link>
                </p>
              </div>

            </form>
          </>
        ) : (
          // Verification Code Step
          <div className="animate-fade-in">
            {/* Header */}
            <div className="flex flex-col items-center mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-zinc-700 to-zinc-500 flex items-center justify-center shadow-lg shadow-zinc-500/10 mb-4">
                <KeyRound size={24} className="text-white animate-pulse" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Verify Email
              </h1>
              <p className="text-gray-400 text-sm mt-2.5 text-center font-normal leading-relaxed">
                Enter the 6-digit verification code sent to <br />
                <span className="text-zinc-200 font-medium">{signupPayload?.emailId}</span>
              </p>
            </div>

            {localError && (
              <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-xl text-center">
                {localError}
              </div>
            )}

            <form onSubmit={onVerifyOtp} className="space-y-6">
              
              {/* Sleek 6-Digit Inputs container */}
              <div className="flex justify-center gap-2.5 my-8">
                {otpValues.map((val, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputsRef.current[idx] = el)}
                    type="text"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    className="w-12 h-14 bg-[#18181b]/50 border border-[#27272a] rounded-xl text-center text-xl font-bold text-white focus:outline-none focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 transition-all duration-200 shadow-inner"
                  />
                ))}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={localLoading}
                className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold py-3.5 rounded-xl shadow-lg shadow-zinc-500/5 hover:shadow-zinc-500/10 active:scale-[0.99] transition-all duration-200 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {localLoading ? (
                  <>
                    <Loader2 className="animate-spin text-zinc-950" size={18} />
                    Verifying...
                  </>
                ) : (
                  "Verify & Sign Up"
                )}
              </button>

              {/* Timer & Resend code */}
              <div className="text-center text-sm text-gray-400 mt-4">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={localLoading}
                    className="text-zinc-200 font-semibold hover:text-white hover:underline transition duration-200 cursor-pointer disabled:opacity-50"
                  >
                    Resend Code
                  </button>
                ) : (
                  <p>
                    Resend code in{" "}
                    <span className="text-zinc-300 font-medium">
                      {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, "0")}
                    </span>
                  </p>
                )}
              </div>

              {/* Back to details button */}
              <button
                type="button"
                onClick={() => {
                  setShowOtp(false);
                  setLocalError("");
                }}
                disabled={localLoading}
                className="w-full flex items-center justify-center gap-2 text-zinc-400 hover:text-white text-sm font-medium pt-2 transition duration-200 cursor-pointer disabled:opacity-50"
              >
                <ArrowLeft size={16} />
                Back to Edit Details
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}

