import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../Components/InputField';
import PasswordField from '../Components/PasswordField';
import Button from '../Components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from '../Components/AlertProvider';
import { loginUser } from '../slices/ThunkAPI/ThunkAPI';
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
      // Clear previous errors
      setErrors({ email: "", password: "" });

      const lower = signInError.toLowerCase();

      if (lower.includes("password")) {
        setErrors(prev => ({
          ...prev,
          password: "Password is incorrect, check it and try again."
        }));
      } else if (lower.includes("email") || lower.includes("user")) {
        setErrors(prev => ({
          ...prev,
          email: "User not found, create a new account."
        }));
      } else if (lower.includes("credentials")) {
        // backend generic "Invalid credentials"
        setErrors(prev => ({
          ...prev,
          email: "Invalid email or password."
        }));
      } else {
        myAlert({
          type: "error",
          title: "Login Failed!",
          subtitle: signInError || "Something went wrong, please try again."
        });
      }
    }
  }, [user, signInError, navigate, myAlert, dispatch]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    validateField(id, value);
  };

  const validateField = (field: string, value: string) => {
    let errorMsg = '';

    if (field === 'email' && !/^[a-zA-Z0-9_%+-]+(\.[a-zA-Z0-9_%+-]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      errorMsg = 'Invalid email format';
    }

    if (field === 'password') {
      const errors: string[] = [];

      if (value.length > 100) {
        errors.push('Password is too long');
      }

      if (errors.length > 0) {
        errorMsg = errors.join(' | ');
      }
    }
    setErrors(prev => ({ ...prev, [field]: errorMsg }));
    return errorMsg;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();


      const newErrors: Record<string, string> = {};
      Object.entries(formData).forEach(([key, value]) => {
        const error = validateField(key, value); // should return error message if any
        console.log(error)
        if (error) {
          newErrors[key] = error;
        }
      });

      // setErrors(newErrors);
      console.log(newErrors)

      // Returns early if there are any (non-empty) error messages
      if (Object.values(newErrors).some((val) => val !== '')) {
        return;
      }

      const data = {
        email: formData.email,
        password: formData.password,
      };
      await dispatch(loginUser(data));

    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="flex flex-col justify-center gap-6 font-inter px-4 sm:px-6 md:px-8 w-full max-w-[448px] mx-auto overflow-y-auto scrollbar-hide min-h-screen">

      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-[36px] sm:text-[40px] md:text-[44px] leading-[44px] sm:leading-[48px] md:leading-[52px] font-semibold tracking-wide text-[#333333] text-center">
          Log in
        </h2>
        <p className="text-sm sm:text-base md:text-lg leading-5 sm:leading-6 text-[#666666] text-center mt-2">
          Glad to see you again
        </p>
      </div>

      {/* Form */}
      <form id="form-sign-in" className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>

        {/* Email */}
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
          {formData.email === '' ? (
            <span className="text-gray-500 text-xs" id="email-error">Please enter a valid email address</span>
          ) : (
            errors.email && <span className="text-red-500 text-xs" id="email-error">{errors.email}</span>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <PasswordField
            id="password"
            placeholder="Write your password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {formData.password === '' ? (
            <span className="text-gray-500 text-xs" id="password-error-primary">
              Minimum 8 characters with at least 1 letter and 1 digit.
            </span>
          ) : (
            errors.password && (
              <ul className="text-red-500 text-xs list-disc ml-5">
                {errors.password.split(' | ').map((err, idx) => (
                  <li id={"password-error" + idx} key={idx}>{err}</li>
                ))}
              </ul>
            )
          )}
          <p className="text-xs sm:text-base md:text-sm text-[#666666]">
            forgot password?{" "}
            <Link id="link-sign-up" to="/forgot-password" className="text-black no-underline">
              change Password
            </Link>
          </p>
        </div>

        {/* Button */}
        <Button id="btn-sign-in" type="filled" onClick={handleSubmit} width="w-full">
          {loading ? "Logging you in..." : "Login"}
        </Button>

        {/* Signup Link */}
        <p className="text-center text-sm sm:text-base md:text-lg text-[#666666]">
          New here?{" "}
          <Link id="link-sign-up" to="/signup" className="text-black font-medium no-underline">
            Create an account
          </Link>
        </p>

      </form>
    </div>
  );
};

export default Login;
