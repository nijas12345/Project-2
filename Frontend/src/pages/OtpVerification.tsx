import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resendUserOtp,verifyOtp } from "../services/userApi/userAuthService";

const OtpVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const resendDelay = 30; // 30 seconds delay for the resend button
  const initialTimer = resendDelay; // Start with 30 seconds for the OTP expiration timer
  const [otp, setOtp] = useState<string>(""); // State to hold OTP input
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Flag to track if request is being sent
  const [canResend, setCanResend] = useState<boolean>(false); // State to control the visibility of "Resend OTP"
  const [timer, setTimer] = useState<number>(initialTimer); // Timer state for the expiration countdown
  const [hideOtpExpirationText, setHideOtpExpirationText] =
    useState<boolean>(false); // State to control the visibility of OTP expiration text

  // Format time for display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
    }`;
  };

  const handleOtpSubmit = async (): Promise<void> => {
    setIsSubmitting(true); // Disable the button while submitting

    try {
      const data = await verifyOtp(otp);

      toast.success("Sign in successful! Please log in.", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "Incorrect OTP") {
          toast.error("Incorrect OTP");
        } else if (error.message === "OTP is expired") {
          toast.error("OTP is expired");
        } else {
          toast.error("An unknown error occurred");
        }
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setIsSubmitting(false); // Re-enable the button after the request is done
    }
  };

  // Handle OTP input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;

    // Ensure that the OTP input is exactly 4 digits and only numeric
    if (/^\d{0,4}$/.test(value)) {
      setOtp(value); // Set OTP value if it's a valid number
    }
  };

  const resendOtp = async () => {
    setOtp(""); // Clear the OTP input field
    setCanResend(false); // Disable the "Resend OTP" button until 30 seconds
    setTimer(initialTimer); // Reset the timer to 30 seconds
    setHideOtpExpirationText(false); // Show the OTP expiration text again
    try {
      await resendUserOtp();
      toast.success("OTP resent successfully!");
      setTimeout(() => {
        setCanResend(true);
      }, resendDelay * 1000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "Too many attempts") {
          toast.error("You’ve reached the resend limit. Try again later.");
        } else if (error.message === "Please wait before resending OTP") {
          toast.error("Please wait a few seconds before requesting a new OTP.");
        } else {
          toast.error("Failed to resend OTP");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  // Update the timer every second
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true); // Enable the resend button when the timer reaches 0
      return;
    }

    if (timer <= 1) {
      setHideOtpExpirationText(true); // Hide OTP expiration text after 25 seconds
    }

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown); // Cleanup the interval on component unmount
  }, [timer]);

  // Handle OTP submission to the backend using axios

  return (
    <div className="flex h-screen">
      {/* Left side with the image */}
      <div className="w-1/2 h-full bg-white-500 relative rounded-r-lg">
        <img
          src="/images/card.png"
          alt="otp-verification"
          className="w-full h-full object-cover rounded-r-lg"
        />

        {/* Title and description */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
          <h1 className="font-mulish text-40px font-medium text-white">
            Verify OTP
          </h1>
          <p className="font-mulish text-24px font-medium text-white mt-6">
            Enter the OTP sent to your Email
          </p>
        </div>
      </div>

      {/* Right side with OTP input */}
      <div className="w-1/2 h-full bg-white flex flex-col justify-center items-center">
        {/* Reduced right-hand side image */}
        <img
          src="/images/3180764.jpg"
          alt="OTP Illustration"
          className="w-1/2 mb-6" // Reduced image size
        />

        {/* OTP Expiration Message */}
        {!hideOtpExpirationText && (
          <div className="mb-4 text-lg text-gray-700">
            Resend the OTP in : {formatTime(timer)}
          </div>
        )}

        {/* OTP Input Field */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={otp}
            onChange={handleInputChange}
            placeholder="Enter OTP"
            className="text-center text-xl py-2 px-4 border border-gray-5 00 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
            disabled={isSubmitting} // Disable input when submitting
            maxLength={4} // Ensure OTP input is limited to 4 digits
          />
        </div>

        {/* Submit and Resend OTP */}
        <div className="flex items-center gap-4">
          {/* Submit Button */}
          <button
            onClick={handleOtpSubmit}
            className={`bg-[#5453ab] text-white font-bold py-2 px-4 rounded flex items-center gap-2 hover:bg-[#4a4a9b] transition duration-300 ${
              isSubmitting || otp.length !== 4
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
            disabled={isSubmitting || otp.length !== 4} // Disable the button if submitting or OTP is not 4 digits
          >
            {isSubmitting ? "Submitting..." : "Verify OTP"}
          </button>

          {/* Resend OTP text */}
          {canResend && (
            <span
              onClick={resendOtp}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Resend OTP
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
