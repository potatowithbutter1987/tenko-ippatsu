"use client";

import { useState } from "react";

type Option = { value: string; label: string };

type Props = {
  name?: string;
  placeholder: string;
  options?: Option[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onClick?: () => void;
  error?: boolean;
};

export const SelectInput = ({
  name,
  placeholder,
  options,
  value,
  defaultValue,
  onChange,
  onClick,
  error,
}: Props) => {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const isPlaceholder = currentValue === "";
  const borderClass = error ? "border-[#e23b4a]" : "border-[#e8ebe5]";

  if (!options) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`w-full bg-white border ${borderClass} rounded-[10px] px-4 py-[14px] flex items-center justify-between`}
      >
        <span className="text-[14px] text-[#bfbfbf]">{placeholder}</span>
        <span className="text-[12px] text-[#868685]">▼</span>
      </button>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (!isControlled) setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="relative w-full">
      <select
        name={name}
        value={currentValue}
        onChange={handleChange}
        aria-invalid={error}
        className={`w-full bg-white border ${borderClass} rounded-[10px] px-4 py-[14px] pr-10 text-[14px] appearance-none outline-none cursor-pointer ${
          isPlaceholder ? "text-[#bfbfbf]" : "text-[#0e0f0c]"
        }`}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-[#0e0f0c]">
            {o.label}
          </option>
        ))}
      </select>
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-[#868685] pointer-events-none">
        ▼
      </span>
    </div>
  );
};
