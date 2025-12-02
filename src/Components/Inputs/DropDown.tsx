import { motion } from "framer-motion";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  MouseEvent as ReactMouseEvent,
} from "react";
import { DropDownOption } from "../../types/types";
import DatePicker from "../DatePicker";


interface RenderOptionsProps {
  options: DropDownOption[];
  selectedValue: string;
  handleSelectOption: (option: DropDownOption) => void;
  closeDropdown?: () => void;
  id?: string;
}

const RenderOptions: React.FC<RenderOptionsProps> = ({
  options,
  selectedValue,
  handleSelectOption,
  closeDropdown,
  id
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Helper: Get index from value
  function findIndexByValue(val: string | null): number {
    return options.findIndex(opt => { return opt.value === val });
  }

  // For keyboard and hover focus
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);

  // On mount or option/selection change, set initial focus
  useEffect(() => {
    if (selectedValue && findIndexByValue(selectedValue) !== -1) {
      setHoveredValue(selectedValue);
    } else if (options.length > 0) {
      setHoveredValue(options[0].value);
    } else {
      setHoveredValue(null);
    }
  }, [options, selectedValue]);

  // Dropdown positioning (unchanged)
  const [openUpward, setOpenUpward] = useState(false);
  const [openRightToLeft, setOpenRightToLeft] = useState(false);

  useEffect(() => {
    const calculateDropdownDirection = () => {
      if (wrapperRef.current && optionsRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        const dropdownHeight = optionsRef.current.offsetHeight;
        const dropdownWidth = optionsRef.current.offsetWidth;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        const spaceLeft = rect.left;
        const spaceRight = viewportWidth - rect.right;

        setOpenUpward(spaceBelow < dropdownHeight && spaceAbove > dropdownHeight);
        setOpenRightToLeft(spaceLeft > dropdownWidth && spaceRight < dropdownWidth);
      }
    };

    calculateDropdownDirection();
    window.addEventListener("resize", calculateDropdownDirection);
    return () => window.removeEventListener("resize", calculateDropdownDirection);
  }, []);
  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.focus();
    }
  }, []);
  
  // KEYBOARD HANDLING
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currIdx = findIndexByValue(hoveredValue);
    if (e.key === "ArrowDown") {
      console.log("ArrowDown pressed", currIdx, options.length);
      // Only proceed if you have options!
      if (!options.length) return;
      const nextIdx = currIdx >= 0 && currIdx < options.length - 1 ? currIdx + 1 : 0;
      setHoveredValue(options[nextIdx].value);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      if (!options.length) return;
      const nextIdx = currIdx > 0 ? currIdx - 1 : options.length - 1;
      setHoveredValue(options[nextIdx].value);
      e.preventDefault();
    } else if (e.key === "Enter" || e.key === " ") {
      if (hoveredValue) {
        const hoveredOption = options.find(opt => opt.value === hoveredValue);
        if (hoveredOption) {
          handleSelectOption(hoveredOption);
        }
      }
      e.preventDefault();
    } else if (e.key === "Escape" && closeDropdown) {
      closeDropdown();
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (hoveredValue && itemRefs.current[hoveredValue]) {
      itemRefs.current[hoveredValue]!.scrollIntoView({
        block: "nearest",
        behavior: "smooth"
      });
    }
  }, [hoveredValue]);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <motion.div
        ref={optionsRef}
        initial={{ opacity: 0, y: openUpward ? 10 : -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        // 👇 Add styles for width, max-height and overflow-y
        className={`absolute mt-1 w-56 max-h-64 overflow-y-auto bg-beige border border-beige rounded-md shadow-lg z-10 ${openUpward ? "bottom-full mb-2" : "top-full mt-2"
          } ${openRightToLeft ? "right-0" : "left-0"}`}
        role="listbox"
        tabIndex={0}
      >
        <div className="p-4">
          {options.map((option) => {
            const isActive =
              hoveredValue !== null
                ? hoveredValue === option.value
                : selectedValue === option.value;

            return (
              <div
                ref={el => { itemRefs.current[option.value] = el; }}
                id={id + "-" + option.value}
                key={option.value}
                // onMouseOverCapture={() => setHoveredValue(option.value)}
                className={`option rounded px-1 py-1 text-sm cursor-pointer
                  ${isActive
                    ? "bg-black text-white"
                    : "text-gray-medium hover:bg-black hover:text-white"
                  }`}
                role="option"
                tabIndex={0}
                aria-selected={selectedValue === option.value}
                onMouseEnter={() => setHoveredValue(option.value)}
                // onMouseLeave={() => setHoveredValue(null)}
                onClick={() => handleSelectOption(option)}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleSelectOption(option);
                  }
                }}
              >
                {option.label}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

interface DropDownProps {
  options?: DropDownOption[];
  label: string;
  context?: string;
  placeholder: string;
  width?: string;
  required?: boolean;
  onchange?: (val: string[]) => void;
  calendar?: boolean;
  id?: string;
}

const DropDown: React.FC<DropDownProps> = ({
  options = [],
  label,
  context,
  placeholder,
  width,
  id,
  // required = false,
  onchange,
  calendar = false,
}) => {
  const [inputValue, setInputValue] = useState<string[]>(["*", placeholder]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);


  // Option selection handler
  const handleSelectOption = useCallback(
    (option: DropDownOption) => {
      setInputValue([option.value, option.label]);
      if (onchange) onchange([option.value, option.label]);
      setIsOpen(false);
    },
    [onchange]
  );

  // Date selection handler
  const handleDateChange = useCallback(
    ({ startDate, endDate }: { startDate: string; endDate: string }) => {
      setInputValue([startDate, endDate]);
      if (onchange) onchange([startDate, endDate]);
      setIsOpen(false);
    },
    [onchange]
  );

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset input value to placeholder when placeholder changes (calendar mode only)
  useEffect(() => {
    setInputValue([options.filter(op => op.label === placeholder)[0]?.value, placeholder]);
  }, [placeholder, calendar]);

  // Trigger open dropdown
  const handleTriggerClick = (e: ReactMouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };


  // Render datepicker panel
  const renderDatePicker = () =>
    isOpen && (
      <DatePicker
        showMonths={2}
        showTime={false}
        onDateChange={handleDateChange}
      />
    );

  return (
    <>
      <div
        // aria-label, role, and width for accessibility and style
        className="relative"
        style={{ width }}
        ref={dropdownRef}
        aria-label={label}
      >
        <label className="text-gray-medium text-[0.9rem] block mb-1">
          {label}
        </label>
        <div
          id={id}
          className="flex items-center border-[1.5px] border-gray-light rounded-md cursor-pointer"
          onClick={handleTriggerClick}
          role="button"
        >
          <span className="flex-grow text-black pl-4 md:pl-2 py-2 w-5/6 ellipse-hide">
            {inputValue[1]}
          </span>
          <span className="mr-4 md:mr-1" aria-hidden>
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.97007 5.49158C3.1107 5.35113 3.30132 5.27224 3.50007 5.27224C3.69882 5.27224 3.88945 5.35113 4.03007 5.49158L8.00007 9.46158L11.9701 5.49158C12.0387 5.41789 12.1215 5.35879 12.2135 5.3178C12.3055 5.2768 12.4048 5.25476 12.5056 5.25299C12.6063 5.25121 12.7063 5.26973 12.7997 5.30745C12.8931 5.34518 12.9779 5.40132 13.0491 5.47254C13.1203 5.54376 13.1765 5.62859 13.2142 5.72198C13.2519 5.81537 13.2704 5.9154 13.2687 6.0161C13.2669 6.1168 13.2448 6.21612 13.2039 6.30811C13.1629 6.40011 13.1038 6.48291 13.0301 6.55158L8.53007 11.0516C8.38945 11.192 8.19882 11.2709 8.00007 11.2709C7.80132 11.2709 7.6107 11.192 7.47007 11.0516L2.97007 6.55158C2.82962 6.41095 2.75073 6.22033 2.75073 6.02158C2.75073 5.82283 2.82962 5.6322 2.97007 5.49158Z"
                fill="black"
              />
            </svg>
          </span>
        </div>
        {context && <p className="text-[#666666] mt-1">{context}</p>}

        {/* Options */}
        {!calendar && isOpen && <RenderOptions id={id} selectedValue={inputValue[0]} options={options} handleSelectOption={handleSelectOption} />}

        {/* Calendar/Date Picker */}
        {calendar && isOpen && renderDatePicker()}
      </div>
    </>
  );
};

export default DropDown;


interface ProfileDropDownProps {
  options?: DropDownOption[];
  label?: string;
  onchange?: (val: string[]) => void;
  children: React.ReactNode;
}

export const ProfileDropDown: React.FC<ProfileDropDownProps> = ({
  options = [],
  label,
  onchange,
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Option selection handler
  const handleSelectOption = useCallback(
    (option: DropDownOption) => {
      if (onchange) onchange([option.value, option.label]);
      setIsOpen(false);
    },
    [onchange]
  );

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Trigger open dropdown
  const [, forceRerender] = useState(0);
  const handleTriggerClick = (e: ReactMouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <span className="flex items-center gap-2 " onClick={(e) => {
          handleTriggerClick(e), forceRerender(1)
        }}>
          {" "}
          {children}
          {label}
        </span>

        {isOpen && <RenderOptions selectedValue={options[0].value} options={options} handleSelectOption={handleSelectOption} />}
      </div>
    </>
  );
};