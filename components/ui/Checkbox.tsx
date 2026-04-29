"use client";

type Props = {
  id?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  error?: boolean;
  children: React.ReactNode;
};

export const Checkbox = ({ id, checked, onChange, error, children }: Props) => {
  const borderClass = error ? "border-[#e23b4a]" : "border-[#0e0f0c]";
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2 cursor-pointer select-none"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        aria-invalid={error}
        className={`appearance-none w-[18px] h-[18px] bg-white border-[1.5px] ${borderClass} rounded-[4px] shrink-0 cursor-pointer relative checked:bg-[#9fe870] checked:after:content-[''] checked:after:absolute checked:after:left-[4px] checked:after:top-[1px] checked:after:w-[6px] checked:after:h-[10px] checked:after:border-r-[1.5px] checked:after:border-b-[1.5px] checked:after:border-[#0e0f0c] checked:after:rotate-45`}
      />
      <span className="text-[14px] text-[#0e0f0c]">{children}</span>
    </label>
  );
};
