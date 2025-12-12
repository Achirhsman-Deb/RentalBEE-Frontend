import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import InputField from '../Components/InputField';
import PasswordField from '../Components/PasswordField';
import Button from '../Components/Button';
import { useAlert } from '../Components/AlertProvider';
import { googleLoginUser, loginUser } from '../slices/ThunkAPI/ThunkAPI';
import { AppDispatch, RootState } from '../store/store';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const myAlert = useAlert();
  
  const { user, error: signInError, loading } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      await dispatch(googleLoginUser({ credential: credentialResponse.credential }));
    }
  };

  const handleGoogleError = () => {
    myAlert({ type: "error", title: "Error", subtitle: "Google Sign In Failed" });
  };

  useEffect(() => {
    if (user) {
      myAlert({
        type: "success",
        title: "Congratulations!",
        subtitle: "You have successfully logged into your account!"
      });
      navigate("/");
    }

    if (signInError) {
      setErrors({ email: "", password: "" });
      const lower = signInError.toLowerCase();

      if (lower.includes("password")) {
        setErrors(prev => ({
          ...prev,
          password: "Password is incorrect, please try again."
        }));
      } else if (lower.includes("email") || lower.includes("user")) {
        setErrors(prev => ({
          ...prev,
          email: "User not found, please check your email."
        }));
      } else if (lower.includes("credentials")) {
        setErrors(prev => ({
          ...prev,
          email: "Invalid email or password."
        }));
      } else {
        myAlert({
          type: "error",
          title: "Login Failed",
          subtitle: signInError || "Something went wrong, please try again."
        });
      }
    }
  }, [user, signInError, navigate, myAlert, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setErrors(prev => ({ ...prev, [id]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      await dispatch(loginUser({ email: formData.email, password: formData.password }));
    }
  };

  return (
    <div className="flex flex-col justify-center gap-6 font-inter px-4 sm:px-6 md:px-8 w-full max-w-[448px] mx-auto min-h-screen py-10">
      <div className="mb-2">
        <h2 className="text-3xl sm:text-4xl md:text-[44px] leading-tight font-semibold tracking-wide text-[#333333] text-center">
          Log in
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-[#666666] text-center mt-2">
          Glad to see you again
        </p>
      </div>

      <form id="form-sign-in" className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
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
            <span className="text-red-500 text-xs mt-1 animate-pulse">
              {errors.email}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <PasswordField
            id="password"
            placeholder="Write your password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <span className="text-red-500 text-xs mt-1 animate-pulse">
              {errors.password}
            </span>
          )}
          <div className="flex justify-end mt-1">
            <Link to="/forgot-password" className="text-xs sm:text-sm text-[#666666] hover:text-black transition-colors">
              Forgot password?
            </Link>
          </div>
        </div>

        <Button id="btn-sign-in" type="filled" onClick={handleSubmit} width="w-full">
          {loading ? "Logging you in..." : "Login"}
        </Button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            width="100%" 
            text="signin_with"
            shape="pill"
          />
        </div>

        <p className="text-center text-sm sm:text-base text-[#666666] mt-2">
          New here?{" "}
          <Link to="/signup" className="text-black font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;