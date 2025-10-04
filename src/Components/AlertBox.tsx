import React, { ReactNode } from "react";
import classNames from "classnames";
import { X } from "lucide-react";



// ==============================
// 📘 Developer Usage Guide: AlertBox Component
// ==============================

// ✅ Step 1: Import the component
// import AlertBox from './components/AlertBox';

// ✅ Step 2: Basic usage with required props
// <AlertBox title="Success!" />

// ✅ Step 3: Choose an alert type (default: "success")
// Options: 'success' | 'error' | 'warning'
// <AlertBox type="error" title="Something went wrong" />

// ✅ Step 4: Add an optional subtitle for more context
// <AlertBox title="Success" subtitle="Your action was successful!" />

// ✅ Step 5: Add a close button handler (optional)
// <AlertBox title="Notice" onClose={() => console.log("Closed")} />

// ✅ Step 6: Add custom buttons (optional)
// Example: Pass in action buttons like Retry or Dismiss
// <AlertBox
//   title="Warning"
//   subtitle="This action is irreversible."
//   type="warning"
//   buttons={
//     <>
//       <button onClick={handleRetry}>Retry</button>
//       <button onClick={handleDismiss}>Dismiss</button>
//     </>
//   }
// />



type AlertType = "success" | "error" | "warning";

type AlertBoxProps = {
  type?: AlertType;
  title: string;
  subtitle?: string;
  onClose?: () => void;
  buttons?: ReactNode;
};

const alertStyles: Record<
  AlertType,
  {
    border: string;
    bg: string;
    icon: string;
    title: string;
    subtitle: string;
  }
> = {
  success: {
    border: "border-[#149E32]",
    bg: "bg-[#E2FAE7]",
    icon: "text-[#000000]",
    title: "text-[#000000]",
    subtitle: "text-[#666666]",
  },
  error: {
    border: "border-[#E22D0D]",
    bg: "bg-[#F8E7E7]",
    icon: "text-[#000000]",
    title: "text-[#000000]",
    subtitle: "text-[#666666]",
  },
  warning: {
    border: "border-yellow-300",
    bg: "bg-yellow-50",
    icon: "text-yellow-600",
    title: "text-[#000000]",
    subtitle: "text-[#666666]",
  },
};

const AlertBox: React.FC<AlertBoxProps> = ({
  type = "success",
  title,
  subtitle,
  onClose,
  buttons,
}) => {
  const style = alertStyles[type];

  return (
    <div
      className={classNames(
        "rounded-md border p-4 sm:p-3 max-w-[360px] max-[600px]:min-w-[320px] max-[420px]:min-w-[300px] w-full text-sm shadow-md relative transition-transform transform ease-out duration-300",
        style.border,
        style.bg,
        "animate-slideIn"
      )}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-sm text-black"
      >
        <X size={16} />
      </button>

      <div className="flex items-start gap-3">
        <div className={classNames("mt-[2px]", style.icon)}>
          {type === "success" && (
            <span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C15.5 20 20 15.5 20 10C20 4.5 15.5 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM14.59 5.58L8 12.17L5.41 9.59L4 11L8 15L16 7L14.59 5.58Z"
                  fill="#149E32"
                />
              </svg>
            </span>
          )}
          {type === "error" && (
            <span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 5C10.2652 5 10.5196 5.10536 10.7071 5.29289C10.8946 5.48043 11 5.73478 11 6V11C11 11.2652 10.8946 11.5196 10.7071 11.7071C10.5196 11.8946 10.2652 12 10 12C9.73478 12 9.48043 11.8946 9.29289 11.7071C9.10536 11.5196 9 11.2652 9 11V6C9 5.73478 9.10536 5.48043 9.29289 5.29289C9.48043 5.10536 9.73478 5 10 5ZM10 15C9.73478 15 9.48043 14.8946 9.29289 14.7071C9.10536 14.5196 9 14.2652 9 14C9 13.7348 9.10536 13.4804 9.29289 13.2929C9.48043 13.1054 9.73478 13 10 13C10.2652 13 10.5196 13.1054 10.7071 13.2929C10.8946 13.4804 11 13.7348 11 14C11 14.2652 10.8946 14.5196 10.7071 14.7071C10.5196 14.8946 10.2652 15 10 15Z"
                  fill="#E22D0D"
                />
              </svg>
            </span>
          )}
          {type === "warning" && <span>⚠️</span>}
        </div>
        <div className="flex-1">
          <div
            className={classNames(
              "font-inter font-normal text-[14px] max-[420px]:text-[13px] leading-[20px] tracking-[-0.02em]",
              style.title
            )}
          >
            {title}
          </div>
          {subtitle && (
            <p
              className={classNames(
                "mt-1 font-inter text-xs max-[420px]:text-[11px] tracking-normal",
                style.subtitle
              )}
            >
              {subtitle}
            </p>
          )}
          {buttons && (
            <div className="flex gap-2 mt-2 justify-end">{buttons}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertBox;
