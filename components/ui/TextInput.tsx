type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

const TEL_DISALLOWED_PATTERN = /[^0-9０-９ー-]/g;

const toHalfWidthDigits = (value: string): string =>
  value.replace(/[０-９]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0xfee0),
  );

const cleanNumeric = (value: string): string =>
  toHalfWidthDigits(value).replace(/[^0-9.]/g, "");

const cleanDecimal = (value: string): string => {
  const halfWidth = toHalfWidthDigits(value).replace(/[^0-9.]/g, "");
  const firstDotIndex = halfWidth.indexOf(".");
  if (firstDotIndex === -1) return halfWidth;
  return (
    halfWidth.slice(0, firstDotIndex + 1) +
    halfWidth.slice(firstDotIndex + 1).replace(/\./g, "")
  );
};

const cleanInputValue = (
  value: string,
  type: string,
  inputMode: string | undefined,
): string => {
  if (type === "tel") return value.replace(TEL_DISALLOWED_PATTERN, "");
  if (inputMode === "numeric") return cleanNumeric(value);
  if (inputMode === "decimal") return cleanDecimal(value);
  return value;
};

export const TextInput = ({
  type = "text",
  error,
  className,
  onChange,
  inputMode,
  ...rest
}: Props) => {
  const borderClass = error ? "border-[#e23b4a]" : "border-[#e8ebe5]";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = cleanInputValue(e.target.value, type, inputMode);
    if (cleaned !== e.target.value) {
      e.target.value = cleaned;
    }
    onChange?.(e);
  };

  return (
    <input
      type={type}
      inputMode={inputMode}
      aria-invalid={error}
      {...rest}
      onChange={handleChange}
      className={`w-full bg-white border ${borderClass} rounded-[10px] px-4 py-[14px] text-[14px] text-[#0e0f0c] placeholder:text-[#bfbfbf] outline-none ${className ?? ""}`}
    />
  );
};
