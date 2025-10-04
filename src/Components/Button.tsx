import React from "react";
import classNames from "classnames";

// ==============================
// 👇 Developer Usage Guide
// ==============================

// ✅ Step 1: Import the component
// import Button from './components/Button';

// ✅ Step 2: Use the component in your JSX
// <Button>Click Me</Button>

// ✅ Step 3: Customize the type
// Options: 'filled' | 'outline' | 'default' | 'disabled'
// <Button type="filled">Submit</Button>

// ✅ Step 4: Customize the size
// Options: 'small' | 'medium'
// <Button type="filled" size="small">Small Button</Button>

// ✅ Step 5: Set a custom width using Tailwind classes
// <Button width="w-1/2">Half Width</Button>

// ✅ Step 6: Attach an onClick handler if needed
// <Button onClick={() => console.log('Clicked!')}>Click Me</Button>

// ✅ Step 7: Disable the button if required
// <Button disabled>Disabled</Button>
// width you can pass any width in tailwind like w-[100%] w-[50%] like that


type ButtonProps = {
  children: React.ReactNode;
  type?: "filled" | "outline" | "default" | "disabled" | "underline";
  width?: string;
  size?: "small" | "medium" | "large";
  onClick?: (() => void) | ((e: React.FormEvent) => void);
  disabled?: boolean;
  id?: string;
};

const Button: React.FC<ButtonProps> = ({
  children,
  type = "default",
  width = "w-full",
  size = "medium",
  id,
  onClick,
  disabled = false,
}) => {
  const baseStyles = "rounded-full font-medium text-sm transition-all duration-200";

  const sizeStyles = {
    small: "px-1 py-2 text-xs",
    medium: "px-4 py-2 text-sm",
    large: "px-4 py-2 text-md",
  };

  const styles = {
    filled: "bg-[#FFD60A] text-black hover:bg-[#E6B800]", // Taxi yellow filled button
    outline: "border border-black text-[#222222] hover:bg-[#FFD60A] hover:text-black", // Black outline, slightly softer text
    default: "bg-black text-white hover:bg-gray-800", // Neutral black button
    disabled: "bg-[#DCDCDD] text-[#A29E9E] cursor-not-allowed", // Disabled (grayed out)
    disabledoutline: "bg-transparent border border-[#DCDCDD] text-[#A29E9E] cursor-not-allowed", // Disabled outline
    underline: "mt-1 hover:opacity-80 text-black underline hover:text-[#E6B800] hover:underline", // Underline link with yellow hover
    underlinedisabled: "text-[#A29E9E] cursor-not-allowed", // Disabled underline (gray)
  };


  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        baseStyles,
        sizeStyles[size],
        styles[disabled ? (type === "underline" ? "underlinedisabled" : (type === "filled" ? "disabled" : "disabledoutline")) : type],
        width,
      )}
    >
      {children}
    </button>
  );
};

export default Button;