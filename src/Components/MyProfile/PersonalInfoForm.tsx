import { useEffect, useState } from "react";
import Button from "../Button";
import UploadProfilePicModal from "./UploadProfilePicModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { personalInfoGet, personalInfoPut, PersonalInfoPutData } from "../../slices/ThunkAPI/ThunkAPI";
import { useAlert } from "../AlertProvider";

const PersonalInfoForm = () => {
  const [UploadProfilePic, setUploadProfilePic] = useState(false);
  const { user, error: personalInfoError, loading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const myAlert = useAlert();
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    if (personalInfoError) {

      console.error("Error fetching personal info:", personalInfoError);
      // Handle the error as needed (e.g., show a notification or alert)
      myAlert({
        type: "error",
        title: "Please try again later.",
        subtitle: personalInfoError
      });
    }
    else if (!loading && showAlert) {
      myAlert({
        type: "success",
        title: "Success",
        subtitle: "Personal info updated successfully."
      });
    }
  }, [personalInfoError, showAlert, loading]);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phoneNumber: user?.phoneNumber || "",
    country: user?.country || "",
    city: user?.city || "",
    street: user?.street || "",
    postalCode: user?.postalCode || "",
    imageUrl: user?.imageUrl || "",
    imageFile: null as File | null,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    country: "",
    city: "",
    street: "",
    postalCode: "",
  });

  useEffect(() => {
    const func = async () => {
      await dispatch(personalInfoGet({ id: user?.userId + ""}));
    }
    func();
  }, []);


  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phoneNumber: user?.phoneNumber || "",
        country: user?.country || "",
        city: user?.city || "",
        street: user?.street || "",
        postalCode: user?.postalCode || "",
        imageUrl: user?.imageUrl || "",
        imageFile: null as File | null,
      });
    }
  }, [user]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log("formData", formData);
  }

  const isLatin = (str: string) => /^[A-Za-z\s]+$/.test(str.trim());
  const validateField = (field: string, value: string) => {
    let errorMsg = '';
    const trimmedValue = value.trim();
    if (field === 'firstName') {
      if (trimmedValue.length < 1 || trimmedValue.length > 50) {
        errorMsg = 'Must be between 2 and 50 characters';
      } else if (!isLatin(trimmedValue)) {
        errorMsg = 'Only latin letters are allowed';
      } else if (/\s{2,}/.test(trimmedValue)) {
        errorMsg = 'First name cannot have multiple spaces together';
      }
    }
    else if (field === 'lastName' && trimmedValue) {
      if (trimmedValue.length < 1 || trimmedValue.length > 50) {
        errorMsg = 'Must be between 2 and 50 characters';
      } else if (!isLatin(trimmedValue)) {
        errorMsg = 'Only latin letters are allowed';
      } else if (/\s{2,}/.test(trimmedValue)) {
        errorMsg = 'First name cannot have multiple spaces together';
      }
    }
    else if (field === 'phoneNumber' && trimmedValue) {
      if (trimmedValue.length < 1 || trimmedValue.length > 50) {
        errorMsg = 'Must be between 2 and 50 characters';
      } else if (!/^\+?[0-9\s]+$/.test(trimmedValue)) {
        errorMsg = 'Only numbers and + are allowed';
      } else if (/\s{2,}/.test(trimmedValue)) {
        errorMsg = 'Phone number cannot have multiple spaces together';
      }
    }
    else if (field === 'country' && trimmedValue) {
      if (trimmedValue.length < 1 || trimmedValue.length > 50) {
        errorMsg = 'Must be between 2 and 50 characters';
      } else if (!isLatin(trimmedValue)) {
        errorMsg = 'Only latin letters are allowed';
      } else if (/\s{2,}/.test(trimmedValue)) {
        errorMsg = 'Country cannot have multiple spaces together';
      }
    }
    else if (field === 'city' && trimmedValue) {
      if (trimmedValue.length < 1 || trimmedValue.length > 50) {
        errorMsg = 'Must be between 2 and 50 characters';
      } else if (!isLatin(trimmedValue)) {
        errorMsg = 'Only latin letters are allowed';
      } else if (/\s{2,}/.test(trimmedValue)) {
        errorMsg = 'City cannot have multiple spaces together';
      }
    }
    else if (field === 'street' && trimmedValue) {
      if (trimmedValue.length < 1 || trimmedValue.length > 50) {
        errorMsg = 'Must be between 2 and 50 characters';
      } else if (!(/^[A-Za-z\s\d,.]+$/.test(trimmedValue))) {
        errorMsg = 'Only latin letters are allowed';
      } else if (/\s{2,}/.test(trimmedValue)) {
        errorMsg = 'Street cannot have multiple spaces together';
      }
    }
    else if (field === 'postalCode' && trimmedValue) {
      if (trimmedValue.length < 1 || trimmedValue.length > 50) {
        errorMsg = 'Must be between 2 and 50 characters';
      } else if (!/^[0-9\s]+$/.test(trimmedValue)) {
        errorMsg = 'Only numbers are allowed';
      } else if (/\s{2,}/.test(trimmedValue)) {
        errorMsg = 'Postal code cannot have multiple spaces together';
      }
    }
    setErrors(prev => ({ ...prev, [field]: errorMsg }));
    return errorMsg;
  };

  const handleSubmit = async () => {
    setShowAlert(true);

    const errors = (Object.keys(formData) as Array<keyof typeof formData>)
      .map((key) => {
        if (typeof formData[key] === "string") {
          return validateField(key, formData[key] as string);
        }
        return "";
      });

    if (errors.some((error) => error !== "")) {
      console.log("Validation errors:", errors);
      return;
    }

    const data: PersonalInfoPutData = {
      id: user?.userId + "",
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
      country: formData.country,
      city: formData.city,
      street: formData.street,
      postalCode: formData.postalCode,
      imageFile: formData.imageFile,
    };

    console.log("data", data);
    await dispatch(personalInfoPut(data));
  };


  return (
    <div className="p-6 space-y-6 mt-10">
      <section className="flex flex-row items-center gap-x-3 mb-4">
        <h1 className="text-[#000000] text-2xl font-semibold">Personal info</h1>
        <span
          className={`px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium flex items-center justify-center
      ${user?.status === "UNVERIFIED"
              ? "bg-red-100 text-[#E22D0D]"
              : "bg-[#8df39e] text-[#00bf20]"
            }`}
        >
          {user?.status === "UNVERIFIED" ? "UNVERIFIED" : "VERIFIED"}
        </span>
      </section>
      <div className="border border-[#000000] rounded-md p-4 flex items-center justify-between max-[560px]:justify-center max-[560px]:text-center h-[132px] max-[560px]:h-auto max-[560px]:relative max-[560px]:-z-10">
        <div className="flex items-center gap-4 max-[560px]:flex-col max-[560px]:justify-center ">
          <img
            src={formData?.imageUrl || "https://res.cloudinary.com/duyv9y7fc/image/upload/v1756390169/20171206_01_ixegsw.jpg"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover"
          />
        
          <div className="flex flex-col  justify-start ">
            <p className="font- text-2xl">{user?.username}</p>
            <p className="text-sm  text-gray-medium">{user?.email}</p>
          </div>
        </div>
        <div className="h-full flex justify-start items-start max-[560px]:absolute  max-[560px]:right-2 max-[560px]:top-2  max-[560px]:-z-10 ">
          <button className="text-[15px] text-[#000000] hover:underline" onClick={() => setUploadProfilePic(true)}>Change</button>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-xl mb-4">Personal info</h2>
        <div className="border border-[#000000] rounded-md p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="input-name"
                className="block text-sm mb-1 text-gray-medium">Name</label>
              <input
                id="input-name"
                type="text"
                className="w-full border border-gray-light rounded-md p-2 bg-transparent outline-none caret-gray-400 "
                value={formData?.firstName}
                onChange={handleChange}
                name="firstName"
              />
              {errors.firstName && <span className="text-red-500 text-xs" id="firstname-error">{errors.firstName}</span>}
            </div>
            <div>
              <label
                htmlFor="input-surname"
                className="block text-sm mb-1 text-gray-medium">Surname</label>
              <input
                id="input-surname"
                type="text"
                className="w-full border border-gray-light rounded-md p-2 bg-transparent outline-none caret-gray-400 "
                value={formData?.lastName}
                onChange={handleChange}
                name="lastName"
              />
              {errors.lastName && <span className="text-red-500 text-xs" id="lastname-error">{errors.lastName}</span>}
            </div>
            <div className="md:col-span-1">
              <label
                htmlFor="input-phone"
                className="block text-sm mb-1 text-gray-medium">Phone</label>
              <input
                id="input-phone"
                type="text"
                className="w-full border  border-gray-lightrounded-md p-2 bg-[#fdf9f3] outline-none caret-gray-400 "
                value={formData?.phoneNumber}
                onChange={handleChange}
                name="phoneNumber"
              />
              {errors.phoneNumber && <span className="text-red-500 text-xs" id="phone-error">{errors.phoneNumber}</span>}
            </div>
          </div>

        </div>

      </div>

      <div className="">
        <h2 className="font-semibold text-xl mb-4">Address</h2>
        <div className="border border-[#000000] rounded-md p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="input-country"
                className="block text-sm mb-1 text-gray-medium">Country</label>
              <input
                id="input-country"
                type="text"
                className="w-full border rounded-md p-2 bg-transparent   outline-none caret-gray-400"
                value={formData?.country}
                onChange={handleChange}
                name="country"
              />
              {errors.country && <span className="text-red-500 text-xs" id="country-error">{errors.country}</span>}
            </div>
            <div>
              <label
                htmlFor="input-city"
                className="block text-sm mb-1 text-gray-medium">City</label>
              <input
                id="input-city"
                type="text"
                className="w-full border rounded-md p-2 bg-transparent   outline-none caret-gray-400 "
                value={formData?.city}
                onChange={handleChange}
                name="city"
              />
              {errors.city && <span className="text-red-500 text-xs" id="city-error">{errors.city}</span>}
            </div>
            <div>
              <label
                htmlFor="input-postal-code"
                className="block text-sm mb-1 text-gray-medium">Postal code</label>
              <input
                id="input-postal-code"
                type="text"
                className="w-full border rounded-md p-2 bg-transparent   outline-none caret-gray-400"
                value={formData?.postalCode}
                onChange={handleChange}
                name="postalCode"
              />
              {errors.postalCode && <span className="text-red-500 text-xs" id="postalcode-error">{errors.postalCode}</span>}
            </div>
            <div>
              <label
                htmlFor="input-street"
                className="block text-sm mb-1 text-gray-medium">Street</label>
              <input
                id="input-street"
                type="text"
                className="w-full border rounded-md p-2 bg-transparent   outline-none caret-gray-400"
                value={formData?.street}
                onChange={handleChange}
                name="street"
              />
              {errors.street && <span className="text-red-500 text-xs" id="street-error">{errors.street}</span>}
            </div>
          </div>
        </div>

      </div>


      <div className="flex justify-end">
        <Button type="filled" width="w-44" id="btn-save-changes" onClick={handleSubmit}>
          {loading ? "Saving Changes..." : "Save Changes"}
        </Button>
      </div>

      <UploadProfilePicModal
        isOpen={UploadProfilePic}
        onClose={() => setUploadProfilePic(false)}
        setFile={(file: File | null) =>
          setFormData((prev) => ({
            ...prev,
            imageFile: file,
            imageUrl: file ? URL.createObjectURL(file) : prev.imageUrl,
          }))
        }
      />
    </div>
  );
};

export default PersonalInfoForm;
