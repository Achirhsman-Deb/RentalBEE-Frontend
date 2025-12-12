import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import { GoogleLogin } from "@react-oauth/google";
import Button from "../Components/Button";
import InputField from "../Components/InputField";
import PasswordField from "../Components/PasswordField";
import { useAlert } from "../Components/AlertProvider";
import { googleLoginUser, registerUser } from "../slices/ThunkAPI/ThunkAPI";
import { resetSignUpConf } from "../slices/AuthSlices";
import { RootState, AppDispatch } from "../store/store";
import { ApiEndPoint } from "../utils";

interface Errors {
  firstName: string;
  lastName: string;
  email: string;
  otp: string;
  password: string | string[];
  confirmPassword: string;
}

const Signup: React.FC = () => {
  const captchaSiteKey = "6LdyYN4rAAAAAIoYZZTkD_dw5J8zXUef4egxWJsV";
  const navigate = useNavigate();
  const myAlert = useAlert();
  const dispatch = useDispatch<AppDispatch>();

  const { signUpConf, error: signUpError, loading } = useSelector(
    (state: RootState) => state.auth
  );

  const [loadingOTP, setLoadingOTP] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    otp: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState<Errors>({
    firstName: "",
    lastName: "",
    email: "",
    otp: "",
    password: "",
    confirmPassword: ""
  });

  const validateField = (field: string, value: string, currentFormData = formData) => {
    let errorMsg: string | string[] = "";

    switch (field) {
      case "firstName":
        if (!value.trim()) errorMsg = "First name is required";
        break;
      case "lastName":
        if (!value.trim()) errorMsg = "Last name is required";
        break;
      case "email":
        if (!value.trim()) {
          errorMsg = "Email is required";
        } else if (!/^[a-zA-Z0-9_%+-]+(\.[a-zA-Z0-9_%+-]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          errorMsg = "Invalid email format";
        }
        break;
      case "password":
        const passErrors: string[] = [];
        if (/\s/.test(value)) passErrors.push("Password should not contain spaces");
        if (!/[A-Z]/.test(value)) passErrors.push("Password should contain an uppercase letter");
        if (!/[0-9]/.test(value)) passErrors.push("Password should contain a number");
        if (!/[!@#$%^&*]/.test(value)) passErrors.push("Password should contain a special character");
        if (value.length < 8) passErrors.push("Password should be at least 8 characters long");
        if (value.length > 100) passErrors.push("Password is too long");
        if (passErrors.length > 0) errorMsg = passErrors;
        break;
      case "confirmPassword":
        if (!value.trim()) {
          errorMsg = "Confirm Password is required";
        } else if (value !== currentFormData.password) {
          errorMsg = "Passwords do not match";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    return errorMsg;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let updatedValue = value;

    if (id === "password" || id === "confirmPassword") {
      updatedValue = value.replace(/\s/g, "");
    }

    const updatedFormData = { ...formData, [id]: updatedValue };
    setFormData(updatedFormData);

    validateField(id, updatedValue, updatedFormData);

    if (id === "password" && formData.confirmPassword) {
      validateField("confirmPassword", formData.confirmPassword, updatedFormData);
    }

    if (id === "email") {
      setOtpSent(false);
      setShowCaptcha(false);
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handleGetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;

    setLoadingOTP(true);
    const email = formData.email.trim();

    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      setLoadingOTP(false);
      return;
    }

    const emailError = validateField("email", email);
    if (emailError) {
      setLoadingOTP(false);
      return;
    }

    setErrors((prev) => ({ ...prev, email: "" }));
    setShowCaptcha(true);
    setLoadingOTP(false);
  };

  const handleCaptchaSuccess = async (token: string | null) => {
    if (!token) return;
    try {
      const res = await fetch(`${ApiEndPoint}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, captchaToken: token, type: "Registration" })
      });

      if (res.ok) {
        setOtpSent(true);
        setShowCaptcha(false);
        myAlert({ type: "success", title: "OTP Sent", subtitle: "Check your email for the OTP." });
      } else if (res.status === 409) {
        setErrors((prev) => ({ ...prev, email: "Email is already registered" }));
      } else {
        throw new Error("Failed to send OTP");
      }
    } catch (err) {
      myAlert({ type: "error", title: "Error", subtitle: "Unable to send OTP, please try again." });
      setOtpSent(false);
      setShowCaptcha(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const fields = ["firstName", "lastName", "email", "password", "confirmPassword", "otp"];
    let isValid = true;

    fields.forEach((field) => {
      const value = formData[field as keyof typeof formData];
      const error = validateField(field, value);
      if (error && error.length > 0) isValid = false;
    });

    if (isValid) {
      await dispatch(registerUser(formData));
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const result = await dispatch(googleLoginUser({ credential: credentialResponse.credential }));
      if (result.meta.requestStatus === 'fulfilled') {
        navigate("/");
      }
    }
  };

  const handleGoogleError = () => {
    myAlert({ type: "error", title: "Error", subtitle: "Google Signup Failed" });
  };

  useEffect(() => {
    if (signUpConf) {
      myAlert({
        type: "success",
        title: "Congratulations!",
        subtitle: "You have successfully created your account!"
      });
      dispatch(resetSignUpConf());
      navigate("/login");
    }

    if (signUpError) {
      const lower = signUpError.toLowerCase();
      if (lower.includes("email")) {
        setErrors((prev) => ({ ...prev, email: "Email is already registered" }));
      } else if (lower.includes("otp")) {
        setErrors((prev) => ({ ...prev, otp: "OTP is expired or invalid" }));
      } else {
        myAlert({ type: "error", title: "Error", subtitle: "Something went wrong, please try again." });
      }
    }
  }, [signUpConf, signUpError, navigate, myAlert, dispatch]);

  return (
    <div className="flex flex-col justify-start font-inter px-4 sm:px-6 md:px-8 w-full max-w-[480px] mx-auto h-screen overflow-y-auto scrollbar-hide py-6">
      <div className="mb-6 text-center shrink-0">
        <h2 className="text-[36px] sm:text-[40px] md:text-[44px] font-semibold tracking-wide text-[#333333]">
          Create an account
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-[#666666] mt-2">
          Enter your details below to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} id="form-sign-up" className="flex flex-col gap-3 w-full">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col sm:w-1/2">
            <InputField
              id="firstName"
              type="text"
              placeholder="Write your name"
              label="First name"
              widthClass="w-full"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && (
              <span className="text-red-500 text-xs">{errors.firstName}</span>
            )}
          </div>
          <div className="flex flex-col sm:w-1/2">
            <InputField
              id="lastName"
              type="text"
              placeholder="Write your surname"
              label="Surname"
              widthClass="w-full"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && (
              <span className="text-red-500 text-xs">{errors.lastName}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <InputField
            id="email"
            type="email"
            placeholder="Write your email"
            label="Email"
            widthClass="w-full"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email}</span>
          )}

          {!otpSent && !showCaptcha && (
            <Button
              id="btn-get-otp"
              type={loadingOTP || !formData.email ? "disabled" : "filled"}
              onClick={handleGetOtp}
              width="w-full"
            >
              Get OTP
            </Button>
          )}

          {showCaptcha && !otpSent && (
            <div className="flex w-full justify-center mt-1">
              <ReCAPTCHA sitekey={captchaSiteKey} onChange={handleCaptchaSuccess} />
            </div>
          )}
        </div>

        {otpSent && (
          <div className="flex flex-col gap-1">
            <InputField
              id="otp"
              type="text"
              placeholder="Enter OTP"
              label="OTP"
              value={formData.otp}
              onChange={handleChange}
            />
            {errors.otp && (
              <span className="text-red-500 text-xs">{errors.otp}</span>
            )}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <PasswordField
            id="password"
            placeholder="Create password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {Array.isArray(errors.password) ? (
            <ul className="text-red-500 text-xs mt-1 space-y-1 list-disc list-inside">
              {errors.password.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          ) : errors.password ? (
            <span className="text-red-500 text-xs">{errors.password}</span>
          ) : null}
        </div>

        <div className="flex flex-col gap-1">
          <PasswordField
            id="confirmPassword"
            placeholder="Confirm password"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-xs">{errors.confirmPassword}</span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-2">
          <Button id="btn-cancel" type="outline" onClick={() => navigate("/")} width="w-full sm:w-1/2">
            Cancel
          </Button>
          <Button id="btn-sign-up" type="filled" onClick={handleSubmit} width="w-full sm:w-1/2">
            {loading ? "Registering" : "Register"}
          </Button>
        </div>

        <div className="w-full flex flex-col gap-4 mb-4 mt-2">
          <div className="flex items-center gap-3">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>
          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              width="100%"
              text="signup_with"
              shape="pill"
            />
          </div>
        </div>

        <div className="text-center text-sm sm:text-base text-[#666666] pb-2">
          Already have an account?{" "}
          <Link id="link-sign-in" to="/login" className="text-black font-medium no-underline">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;