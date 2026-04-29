type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
};

export const TextArea = ({ error, className, ...rest }: Props) => {
  const borderClass = error ? "border-[#e23b4a]" : "border-[#e8ebe5]";
  return (
    <textarea
      aria-invalid={error}
      {...rest}
      className={`w-full bg-white border ${borderClass} rounded-[10px] px-4 py-[14px] text-[14px] text-[#0e0f0c] placeholder:text-[#bfbfbf] outline-none min-h-[80px] resize-none ${className ?? ""}`}
    />
  );
};
