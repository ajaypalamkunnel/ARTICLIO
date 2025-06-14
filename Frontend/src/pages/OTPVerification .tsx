/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { Clock, ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/userStore";
import { toast } from "react-toastify";
import { resendOtp, verifyOtp } from "../services/userService";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResendActive, setIsResendActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const { tempEmail, clearTempEmail } = useAuthStore();
  const navigate = useNavigate();
  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendActive(true);
    }
  }, [timeLeft]);

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: {
    preventDefault: () => void;
    clipboardData: { getData: (arg0: string) => string | any[] };
  }) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }

    setOtp(newOtp);

    // Focus next empty input or last input
    const nextEmptyIndex = newOtp.findIndex((digit) => digit === "");
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (!tempEmail) return;
    setIsLoading(true);

    try {
      const response = await resendOtp(tempEmail);
      console.log(response);

      if (response.success) {
        toast.success("OTP resent successfully");
        setOtp(["", "", "", "", "", ""]);
        setTimeLeft(60);
        setIsResendActive(false);
        inputRefs.current[0]?.focus();
      } else {
        toast.error(response.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unexpected error occurred while resending OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verify OTP
  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6 || !tempEmail) {
      toast.error("Please enter complete OTP");
      return;
    }

    setIsLoading(true);

    try {
      const response = await verifyOtp(otpValue, tempEmail);

      if (response.success) {
        toast.success("OTP Verified Successfully");

        navigate("/login");
      } else {
        toast.error(response.message || "Invalid OTP");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unexpected error occurred while verifying OTP");
    } finally {
      setIsLoading(false);
      clearTempEmail();
    }
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <button className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-blue-500" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Your Account
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            We've sent a 6-digit verification code to your registered email
            address. Please enter the code below to continue.
          </p>
        </div>

        {/* OTP Input Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <label className="text-sm font-medium text-gray-700">
              Enter verification code
            </label>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* OTP Input Fields */}
          <div className="flex gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handleOtpChange(index, e.target.value.replace(/\D/g, ""))
                }
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                disabled={isLoading}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerifyOtp}
            disabled={!isOtpComplete || isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              "Verify Code"
            )}
          </button>
        </div>

        {/* Resend Section */}
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-4">Didn't receive the code?</p>

          <button
            onClick={handleResendOtp}
            disabled={!isResendActive || isLoading}
            className="inline-flex items-center text-blue-500 hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed font-medium text-sm transition-colors duration-200"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            {isResendActive
              ? "Resend Code"
              : `Resend in ${formatTime(timeLeft)}`}
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-blue-800 text-xs text-center">
            <strong>Having trouble?</strong> Check your spam folder or contact
            support if you don't receive the code within a few minutes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
