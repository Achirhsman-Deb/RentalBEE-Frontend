import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Button from "../Button";
import { changePassword } from "../../slices/ThunkAPI/ThunkAPI";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useAlert } from "../AlertProvider";

const ChangePasswordForm = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const user= useSelector((state: RootState) => state.auth.user || "");
  const passwordError = useSelector((state: RootState) => state.auth.error);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const dispatch = useDispatch<AppDispatch>();
  const myAlert = useAlert();
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    if (passwordError?.toLowerCase().includes("incorrect") || passwordError?.toLowerCase().includes("requirements")) {
      setError(passwordError);
    } else {
      setError("");
      if (!loading && showAlert && passwordError === "") 
        myAlert({
        type: "success",
        title: "Success",
        subtitle: "Password Changed Successfully!",
      });
    }
  }, [passwordError, loading]);

  const validatePasswords = (current: string, newPass: string) => {
    console.log(!current, !newPass);
    if (!current || !newPass) {
      setError("Both fields are required.");
    } else if (current === newPass) {
      setError("The password is wrong");
    } else {
      setError("");
    }
  };

  const handleCurrentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowAlert(true)
    const value = e.target.value;
    setCurrentPassword(value);
    validatePasswords(value, newPassword);
  };

  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    validatePasswords(currentPassword, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    validatePasswords(currentPassword, newPassword);
    if (typeof user !== "string") {
      await dispatch(changePassword({ id: user.userId, currentPassword: currentPassword, newPassword: newPassword}));
    } else {
      setError("User information is missing.");
    }

    if (!error) {
      console.log("Password changed successfully");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-16">
      <h2 className="text-2xl font-semibold">Change password</h2>

      <div>
        <h3 className="text-base font-medium mb-2">Password</h3>
        <div className="border border-[#000000] rounded-md p-5 pb-6 bg-transparent grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
          <div className="relative">
            <label htmlFor="current-password" className="text-sm text-gray-medium block mb-1">Current password</label>
            <input
              id="current-password"
              type={showCurrent ? "text" : "password"}
              placeholder="Enter your password"
              className={`w-full border rounded-md outline-none px-4 py-3 text-sm bg-transparent pr-10 ${error ? "border-red-500" : "border-gray-light"
                }`}
              value={currentPassword}
              onChange={handleCurrentChange}
            />
            <button
              id="btn-toggle-current-password"
              type="button"
              className="absolute right-3 top-9 text-gray-500"
              onClick={() => setShowCurrent(!showCurrent)}
            >
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="relative">
            <label htmlFor="new-password" className="text-sm text-gray-medium block mb-1">New password</label>
            <input
              id="new-password"
              type={showNew ? "text" : "password"}
              placeholder="Create new password"
              className={`w-full border rounded-md outline-none px-4 py-3 text-sm bg-transparent pr-10 ${error ? "border-red-500" : "border-gray-light"
                }`}
              value={newPassword}
              onChange={handleNewChange}
            />
            <button
              id="btn-toggle-new-password"

              type="button"
              className="absolute right-3 top-9 text-gray-500"
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <div className="col-span-2">
              <p className="text-sm text-red-600" id="error">{error}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="filled" width="w-48" id="btn-change-password">
          {loading ? "Changing password...." : "Change password"}
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
