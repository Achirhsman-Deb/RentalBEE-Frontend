import { useState } from 'react';
import eyeClosedIcon from '../assets/Eye closed.svg';
import eyeOpenIcon from '../assets/Eye.svg';

type PasswordFieldProps = {
  id: string;
  placeholder: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  placeholder,
  label,
  value,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={`text-[#666] flex flex-col gap-[5px] mb-2.5`}>
      <label htmlFor={id} className="text-[10px] sm:text-xs md:text-[11px] lg:text-sm leading-4">
        {label}
      </label>

      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full p-1.5 sm:p-2 md:p-1.5 lg:p-2 pr-10 border border-[#ccc] rounded-lg box-border text-xs sm:text-sm md:text-[11px] lg:text-base leading-5 bg-[#FFFBF3] focus:outline-none focus:border-black appearance-none"
        />

        {isFocused && (
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-none border-none cursor-pointer p-0 w-5 h-5 flex items-center justify-center outline-none"
            onClick={togglePasswordVisibility}
            onMouseDown={(e) => e.preventDefault()}
          >
            <img
              src={showPassword ? eyeOpenIcon : eyeClosedIcon}
              alt={showPassword ? 'Hide password' : 'Show password'}
              className="w-full h-full object-contain"
            />
          </button>
        )}
      </div>
    </div>

  );
};

export default PasswordField;
