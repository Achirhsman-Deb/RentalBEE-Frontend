import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Components/Button";
import { useAlert } from "../Components/AlertProvider";
import InputField from "../Components/InputField";
import PasswordField from "../Components/PasswordField";
import ReCAPTCHA from "react-google-recaptcha";
import { EndPoint } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface Errors {
    email: string;
    otp: string;
    password: string | string[];
    confirmPassword: string;
}

const ForgotPassword: React.FC = () => {
    const captchaSiteKey = "6LeDUskrAAAAAIewowvu3jzakc_9BGODaloO4jqt";
    const navigate = useNavigate();
    const myAlert = useAlert();

    const [LoadingPassChangeReq, setLoadingPassChangeReq] = useState(false);
    const [LoadingOTP, setLoadingOTP] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        otp: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState<Errors>({
        email: "",
        otp: "",
        password: "",
        confirmPassword: ""
    });

    const [showCaptcha, setShowCaptcha] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [PasswordFieldShow, setPasswordFieldShow] = useState(false);

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
            setPasswordFieldShow(false);
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

        if (field === "otp") {
            if (!value.trim()) {
                errorMsg = "OTP is required";
            } else if (!/^\d{4,6}$/.test(value)) {
                errorMsg = "OTP must be 4-6 digits";
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
            const res = await fetch(`${EndPoint}/auth/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, captchaToken: token, type: "ForgotPassword" })
            });

            if (res.ok) {
                setOtpSent(true);
                setShowCaptcha(false);
                setPasswordFieldShow(true);
                myAlert({
                    type: "success",
                    title: "OTP Sent",
                    subtitle: "Check your email for the OTP."
                });
            } else if (res.status === 409) {
                setErrors((prev) => ({ ...prev, email: "Email is not registered" }));
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
            setPasswordFieldShow(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoadingPassChangeReq(true);

        const fields = ["email", "password", "confirmPassword", "otp"];
        let isValid = true;

        fields.forEach((field) => {
            const value = (formData as any)[field];
            const error = validateField(field, value);
            if (error) isValid = false;
        });

        if (!isValid) {
            setLoadingPassChangeReq(false);
            return;
        }
        //change pass dispatch

        try {
            const response = await axios.post(`${EndPoint}/auth/forgot-pass`,
                {
                    email: formData.email,
                    otp: formData.otp,
                    newPassword: formData.confirmPassword
                }
            )
            if (response) {
                if (response.status == 404) {
                    setErrors((prev) => ({ ...prev, email: "Email is not registered" }));
                } else if (response.status == 400) {
                    setErrors((prev) => ({ ...prev, otp: response.data.error }));
                }

                if (response.status == 200) {
                    myAlert({
                        type: "success",
                        title: "Password Changed",
                        subtitle: "Password changed for the account."
                    });
                    navigate("/login");
                    setLoadingPassChangeReq(false);
                    setFormData({
                        email: "",
                        otp: "",
                        password: "",
                        confirmPassword: ""
                    });
                }
            }
        } catch (error) {
            myAlert({
                type: "error",
                title: "Error",
                subtitle: "Something went wrong."
            });
            setLoadingPassChangeReq(false);
            setOtpSent(false);
            setShowCaptcha(false);
            setPasswordFieldShow(false);
        }
    };

    return (
        <div className="flex flex-col justify-center font-inter px-4 sm:px-6 md:px-8 w-full max-w-[480px] mx-auto h-screen overflow-y-auto scrollbar-hide py-6">
            {/* Header */}
            <div className="mb-6 text-center">
                <h2 className="text-[36px] sm:text-[40px] md:text-[44px] font-semibold tracking-wide">
                    Forgot Reset
                </h2>
            </div>

            {/* Form */}
            <form id="form-sign-up" className="flex flex-col gap-2 w-full">
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
                            <div>
                                {errors.email && (
                                    <span className="text-red-500 text-xs">{errors.email}</span>
                                )}
                            </div>
                        </div>

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

                <AnimatePresence>
                    {PasswordFieldShow && (
                        <motion.div
                            key="password-fields"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="flex flex-col gap-3"
                        >
                            {/* Password */}
                            <div>
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

                            {/* Confirm Password */}
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
                        </motion.div>
                    )}
                </AnimatePresence>


                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 mt-6">
                    <Button id="btn-cancel" type={LoadingPassChangeReq ? "disabled" : "outline"} onClick={() => navigate("/")} width="w-full sm:w-1/2">
                        Cancel
                    </Button>
                    <Button id="btn-sign-up" type={LoadingPassChangeReq ? "disabled" : "filled"} onClick={handleSubmit} width="w-full sm:w-1/2">
                        {LoadingPassChangeReq ? "Changing Password" : "Change Password"}
                    </Button>
                </div>
            </form >
        </div >
    );
};

export default ForgotPassword;
