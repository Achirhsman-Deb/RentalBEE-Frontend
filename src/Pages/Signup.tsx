import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../Components/Button";
import { useAlert } from "../Components/AlertProvider";
import InputField from "../Components/InputField";
import PasswordField from "../Components/PasswordField";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../slices/ThunkAPI/ThunkAPI";
import { resetSignUpConf } from "../slices/AuthSlices";
import { RootState } from "../store/store";
import type { AppDispatch } from "../store/store";
import ReCAPTCHA from "react-google-recaptcha";
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
  const [LoadingOTP, setLoadingOTP] = useState(false);

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

  const [showCaptcha, setShowCaptcha] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // handle input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let updatedValue = value;

    if (id === "password" || id === "confirmPassword") {
      updatedValue = value.replace(/\s/g, ""); // strip spaces
    }

    setFormData((prev) => ({ ...prev, [id]: updatedValue }));

    // validate live while typing
    validateField(id, updatedValue);

    // extra: if confirmPassword is updated, validate match
    if (id === "confirmPassword" || id === "password") {
      if (formData.confirmPassword && id === "password") {
        validateField("confirmPassword", formData.confirmPassword);
      }
      if (id === "confirmPassword") {
        if (updatedValue !== formData.password) {
          setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
        } else {
          setErrors((prev) => ({ ...prev, confirmPassword: "" }));
        }
      }
    }

    if (id === "email") {
      setOtpSent(false);
      setShowCaptcha(false);
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  // request OTP
  const handleGetOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingOTP(true);

    const email = formData.email.trim();

    // Email validations
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      setLoadingOTP(false);
      return;
    } else if (
      !/^[a-zA-Z0-9_%+-]+(\.[a-zA-Z0-9_%+-]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        email
      )
    ) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      setLoadingOTP(false);
      return;
    }

    // If validation passes
    setErrors((prev) => ({ ...prev, email: "" })); // clear error if valid
    setShowCaptcha(true);
    setLoadingOTP(false);
  };


  const validateField = (field: string, value: string) => {
    let errorMsg: string | string[] = "";

    if (field === "firstName" && !value.trim()) {
      errorMsg = "First name is required";
    }

    if (field === "lastName" && !value.trim()) {
      errorMsg = "Last name is required";
    }

    if (field === "email") {
      if (!value.trim()) {
        errorMsg = "Email is required";
      } else if (
        !/^[a-zA-Z0-9_%+-]+(\.[a-zA-Z0-9_%+-]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
          value
        )
      ) {
        errorMsg = "Invalid email format";
      }
    }

    if (field === "password") {
      const errors: string[] = [];

      if (/\s/.test(value)) errors.push("Password should not contain spaces");
      if (!/[A-Z]/.test(value)) errors.push("Password should contain an uppercase letter");
      if (!/[0-9]/.test(value)) errors.push("Password should contain a number");
      if (!/[!@#$%^&*]/.test(value)) errors.push("Password should contain a special character");
      if (value.length < 8) errors.push("Password should be at least 8 characters long");
      if (value.length > 100) errors.push("Password is too long");

      errorMsg = errors.length > 0 ? errors : "";
    }


    if (field === "confirmPassword") {
      if (!value.trim()) {
        errorMsg = "Confirm Password is required";
      } else if (value !== formData.password) {
        errorMsg = "Passwords do not match";
      }
    }

    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    return errorMsg;
  };


  // captcha success handler
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
        myAlert({
          type: "success",
          title: "OTP Sent",
          subtitle: "Check your email for the OTP."
        });
      } else if (res.status === 409) {
        setErrors((prev) => ({ ...prev, email: "Email is already registered" }));
      } else {
        myAlert({
          type: "error",
          title: "Failed",
          subtitle: "Unable to send OTP, try again."
        });
        setOtpSent(false);
        setShowCaptcha(false);
      }
    } catch (err) {
      myAlert({
        type: "error",
        title: "Error",
        subtitle: "Something went wrong."
      });
      setOtpSent(false);
      setShowCaptcha(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const fields = ["firstName", "lastName", "email", "password", "confirmPassword", "otp"];
    let isValid = true;

    fields.forEach((field) => {
      const value = (formData as any)[field];
      const error = validateField(field, value);
      if (error) isValid = false;
    });

    if (!isValid) return;
    await dispatch(registerUser(formData));
  };

  useEffect(() => {
    if (signUpConf) {
      myAlert({
        type: "success",
        title: "Congratulations!",
        subtitle: "You have successfully created your account!"
      });
      navigate("/login");
      dispatch(resetSignUpConf());
    }
    if (signUpError) {
      if (signUpError.toLowerCase().includes("email")) {
        setErrors((prev) => ({ ...prev, email: "Email is already registered" }));
      } else if (signUpError.toLowerCase().includes("otp")) {
        setErrors((prev) => ({ ...prev, otp: "OTP is expired or invalid" }));
      } else {
        myAlert({
          type: "error",
          title: "Error!",
          subtitle: "Something went wrong, please try again."
        });
      }
    }
  }, [signUpConf, signUpError, navigate, myAlert, dispatch]);

  return (
    <div className="flex flex-col justify-start font-inter px-4 sm:px-6 md:px-8 w-full max-w-[480px] mx-auto h-screen overflow-y-auto scrollbar-hide py-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-[36px] sm:text-[40px] md:text-[44px] font-semibold tracking-wide">
          Create an account
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-[#666666] mt-2">
          Enter your details below to get started
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} id="form-sign-up" className="flex flex-col gap-2 w-full">
        {/* Name + Surname */}
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

        {/* Email + OTP */}
        <div>
          <div className="flex flex-col gap-2">
            <div className=" gap-2 items-end">
              <InputField
                id="email"
                type="email"
                placeholder="Write your email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {!otpSent && !showCaptcha && (
                <Button
                  id="btn-get-otp"
                  type={LoadingOTP ? "disabled" : "filled"}
                  onClick={handleGetOtp}
                >
                  Get OTP
                </Button>
              )}
            </div>
            {errors.email && (
              <span className="text-red-500 text-xs">{errors.email}</span>
            )}

            {/* reCAPTCHA (only after click) */}
            {showCaptcha && !otpSent && (
              <div className=" flex w-full justify-center">
                <ReCAPTCHA sitekey={captchaSiteKey} onChange={handleCaptchaSuccess} />
              </div>
            )}
          </div>

          {/* OTP Field */}
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
        </div>


        {/* Passwords */}
        <div className="mt-2">
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

        {/* confirm password */}
        <div>
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-2">
          <Button id="btn-cancel" type="outline" onClick={() => navigate("/")} width="w-full sm:w-1/2">
            Cancel
          </Button>
          <Button id="btn-sign-up" type="filled" onClick={handleSubmit} width="w-full sm:w-1/2">
            {loading ? "Registering" : "Register"}
          </Button>
        </div>

        {/* Login Link */}
        <div className="text-center text-sm sm:text-base text-[#666666] mt-4">
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
