type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const PrimaryButton = ({
  type = "button",
  className,
  children,
  ...rest
}: Props) => {
  return (
    <button
      type={type}
      {...rest}
      className={`w-full bg-[#9fe870] rounded-full py-4 text-[18px] font-semibold text-[#163300] cursor-pointer transition-colors enabled:hover:bg-[#8edc5e] disabled:bg-[#e8ebe6] disabled:text-[#868685] disabled:cursor-not-allowed ${className ?? ""}`}
    >
      {children}
    </button>
  );
};
