type InputFieldProps = {
    id: string;
    type: string;
    placeholder: string;
    label: string;
    widthClass?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  
  const InputField: React.FC<InputFieldProps> = ({
    id,
    type,
    placeholder,
    label,
    widthClass = 'w-full',
    value,
    onChange,
  }) => {
    return (
      <div className={`text-[#666] flex flex-col gap-[5px] mb-2.5 ${widthClass}`}>
        <label htmlFor={id} className="text-[10px] sm:text-xs md:text-[11px] lg:text-sm leading-4">
          {label}
        </label>
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="p-1.5 sm:p-2 md:p-1.5 lg:p-2 pr-10 border border-[#ccc] rounded-lg box-border text-xs sm:text-sm md:text-[11px] lg:text-base leading-5 bg-[#FFFBF3] focus:outline-none focus:border-black w-full"
        />
      </div>
    );
  };
  
  export default InputField;
  