interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
}) => {
  return (
    <div className="flex flex-col mt-4 w-full max-md:max-w-full">
      <label className="text-sm font-medium text-neutral-950 max-md:max-w-full">
        {label}
      </label>
      <div className="relative flex gap-2 items-center px-3.5 py-2.5 mt-1.5 w-full text-base bg-white rounded-lg border border-solid border-zinc-300 text-neutral-500 max-md:max-w-full hover:cursor-pointer hover:border-blue-500 hover:shadow-sm transition-all group">
        <select
          className="w-full text-base rounded-lg border-none cursor-pointer focus:outline-none appearance-none bg-transparent"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          style={{ color: value ? "#0B0B0B" : "#7C7C7C" }}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option: string) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2">
          <svg
            className="w-4 h-4 text-gray-500 group-hover:text-blue-500 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
