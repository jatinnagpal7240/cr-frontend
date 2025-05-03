"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function SignupPage() {
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/session/verify`,
          { method: "GET", credentials: "include" }
        );
        if (res.ok) router.replace("/dashboard");
        else setCheckingSession(false);
      } catch (err) {
        setCheckingSession(false);
      }
    };

    checkSession();
    const syncSession = (e) => {
      if (e.key === "session-updated") checkSession();
    };
    window.addEventListener("storage", syncSession);
    return () => window.removeEventListener("storage", syncSession);
  }, [router]);

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-500 rounded-full animate-spin mb-3"></div>
          <p className="text-sm">Checking your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center bg-gray-50 text-gray-800 min-h-screen">
      <header className="fixed top-0 left-0 w-full flex items-center p-4 bg-white z-50 shadow-md">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={150} height={50} priority />
        </Link>
      </header>

      <div className="pt-[80px]" />

      <div className="mt-10 p-4 w-full max-w-md bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold">Create an Account</h2>
      </div>

      <div className="mt-6" />

      <div className="p-6 w-full max-w-md bg-white rounded-lg shadow-md">
        <SignupForm />
      </div>
    </div>
  );
}

// =============================
// SIGNUP FORM
// =============================

const SignupForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [signupStage, setSignupStage] = useState("step1");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpStatus, setOtpStatus] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value.trimStart() }));
    setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  const handleMainButtonClick = async (e) => {
    e.preventDefault();
    if (signupStage === "step1") {
      await sendOtpsToBoth();
    } else if (signupStage === "step2") {
      const validEmail = await verifyEmailOtp();
      const validPhone = await verifyPhoneOtp();
      if (validEmail && validPhone) setSignupStage("step3");
    } else if (signupStage === "step3") {
      await handleSignup();
    }
  };

  const sendOtpsToBoth = async () => {
    const { email, phone } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    let newErrors = {};
    if (!email || !emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!phone || !phoneRegex.test(phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const [emailRes, phoneRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/otp/email/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/otp/phone/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        }),
      ]);

      const emailJson = await emailRes.json();
      const phoneJson = await phoneRes.json();

      if (!emailRes.ok || !phoneRes.ok) {
        alert(
          `Failed to send:\n${
            !emailRes.ok ? `• Email OTP: ${emailJson.message}` : ""
          }\n${!phoneRes.ok ? `• Phone OTP: ${phoneJson.message}` : ""}`
        );
      } else {
        alert("OTP sent to both email and phone.");
        setSignupStage("step2");
        setResendTimer(30);
      }
    } catch (err) {
      console.error("Send OTP Error:", err);
      alert("Something went wrong while sending OTPs.");
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailOtp = async () => {
    if (!emailOtp.trim()) {
      setErrors((prev) => ({ ...prev, emailOtp: "Please enter the OTP." }));
      setOtpStatus("invalid");
      return false;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/otp/email/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, otp: emailOtp }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setErrors((prev) => ({ ...prev, emailOtp: undefined }));
        setOtpStatus("valid");
        return true;
      } else {
        setErrors((prev) => ({
          ...prev,
          emailOtp: data.message || "Invalid or expired OTP.",
        }));
        setOtpStatus("invalid");
        return false;
      }
    } catch (error) {
      console.error("Verify OTP Error:", error);
      setErrors((prev) => ({
        ...prev,
        emailOtp: "Something went wrong. Try again.",
      }));
      setOtpStatus("invalid");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneOtp = async () => {
    if (!phoneOtp.trim()) {
      setErrors((prev) => ({ ...prev, phoneOtp: "Please enter the OTP." }));
      setOtpStatus("invalid");
      return false;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/otp/phone/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: formData.phone, otp: phoneOtp }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        setErrors((prev) => ({ ...prev, phoneOtp: undefined }));
        setOtpStatus("valid");
        return true;
      } else {
        setErrors((prev) => ({
          ...prev,
          phoneOtp: data.message || "Invalid or expired OTP.",
        }));
        setOtpStatus("invalid");
        return false;
      }
    } catch (err) {
      console.error("Phone OTP Verify Error:", err);
      setErrors((prev) => ({
        ...prev,
        phoneOtp: "Something went wrong. Try again.",
      }));
      setOtpStatus("invalid");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@*.])[A-Za-z\d@*.]{8,16}$/;

    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.identifier = "Email or phone is required.";
    }
    if (formData.email.trim() && !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (formData.phone.trim() && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Invalid phone format.";
    }
    if (!formData.password.trim() || !passwordRegex.test(formData.password)) {
      newErrors.password = "Password must meet security rules.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/signup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, emailOtp }),
          }
        );
        const data = await res.json();
        if (res.ok) {
          setAccountCreated(true);
          setTimeout(() => router.replace("/login"), 4000);
        } else {
          alert(data.message || "Signup failed.");
        }
      } catch (error) {
        console.error("Signup Error:", error);
        alert("Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (accountCreated) {
    return (
      <div className="text-center flex flex-col items-center justify-center min-h-[240px]">
        <div className="w-16 h-16 mb-4 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-green-600">Welcome!</h2>
        <p className="text-gray-600 text-sm">
          Account created. Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-12 h-12 border-4 border-green-500 rounded-full animate-spin"></div>
        </div>
      )}
      <form
        className={`${loading ? "blur-sm" : ""} space-y-6`}
        onSubmit={handleMainButtonClick}
      >
        {signupStage === "step1" && (
          <>
            <InputField
              id="phone"
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
            />
            <InputField
              id="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
          </>
        )}

        {signupStage === "step2" && (
          <>
            <InputField
              id="emailOtp"
              label="Enter Email OTP"
              value={emailOtp}
              onChange={(e) => setEmailOtp(e.target.value)}
              error={errors.emailOtp}
              otpStatus={otpStatus}
            />
            <InputField
              id="phoneOtp"
              label="Enter Phone OTP"
              value={phoneOtp}
              onChange={(e) => setPhoneOtp(e.target.value)}
              error={errors.phoneOtp}
              otpStatus={otpStatus}
            />
          </>
        )}

        {signupStage === "step3" && (
          <>
            <InputField
              id="password"
              label="Create Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
            <InputField
              id="confirmPassword"
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />

            {/* ✅ Show Password toggle */}
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="w-4 h-4"
                id="showPassword"
              />
              <label
                htmlFor="showPassword"
                className="ml-2 text-gray-600 text-sm cursor-pointer"
              >
                Show Password
              </label>
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-emerald-700"
        >
          {signupStage === "step1"
            ? "Send OTP"
            : signupStage === "step2"
            ? "Verify OTPs"
            : "Sign Up"}
        </button>

        {signupStage === "step2" && resendTimer === 0 && (
          <div className="text-center text-sm mt-2 text-gray-600">
            <button
              type="button"
              onClick={sendOtpToEmail}
              className="text-blue-600 hover:underline"
            >
              Didn&apos;t receive OTP? Resend
            </button>
          </div>
        )}

        <div className="text-center text-sm text-gray-600 mt-[-10px]">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

// ================
// InputField
// ================

const InputField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  otpStatus,
  disabled,
}) => (
  <div className="relative w-full">
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`peer w-full px-4 pt-5 pb-2 border ${
        error ? "border-red-500" : "border-gray-400"
      } rounded-md disabled:bg-gray-100`}
      placeholder=" "
    />
    <label
      htmlFor={id}
      className={`absolute left-3 px-1 bg-white text-gray-500 text-sm transition-all ${
        value ? "top-[-10px] text-sm text-blue-500" : "top-4 text-base"
      } peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-blue-500`}
    >
      {label}
    </label>

    {(id === "emailOtp" || id === "phoneOtp") && (
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300">
        {otpStatus === "valid" && (
          <span className="text-green-500 text-xl">✔️</span>
        )}
        {otpStatus === "invalid" && (
          <span className="text-red-500 text-xl">❌</span>
        )}
      </div>
    )}

    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);
