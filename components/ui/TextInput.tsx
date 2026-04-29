type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

const TEL_DISALLOWED_PATTERN = /[^0-9０-９ー-]/g;

export const TextInput = ({
  type = "text",
  error,
  className,
  onChange,
  ...rest
}: Props) => {
  const borderClass = error ? "border-[#e23b4a]" : "border-[#e8ebe5]";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "tel") {
      const cleaned = e.target.value.replace(TEL_DISALLOWED_PATTERN, "");
      if (cleaned !== e.target.value) {
        e.target.value = cleaned;
      }
    }
    onChange?.(e);
  };

  return (
    <input
      type={type}
      aria-invalid={error}
      {...rest}
      onChange={handleChange}
      className={`w-full bg-white border ${borderClass} rounded-[10px] px-4 py-[14px] text-[14px] text-[#0e0f0c] placeholder:text-[#bfbfbf] outline-none ${className ?? ""}`}
    />
  );
};
