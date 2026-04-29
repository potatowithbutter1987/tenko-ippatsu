"use client";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
  error?: boolean;
};

export const CheckCard = ({ checked, onChange, children, error }: Props) => {
  const bgClass = checked
    ? "bg-[#e2f6d5] hover:bg-[#d4ebc6]"
    : "bg-white hover:bg-[#f7f7f5]";
  const resolveBorderClass = (): string => {
    if (error) return "border-[#e23b4a]";
    if (checked) return "border-[#e2f6d5]";
    return "border-[#e8ebe5]";
  };
  const borderClass = resolveBorderClass();

  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={`w-full ${bgClass} border ${borderClass} rounded-[12px] px-4 py-3 flex items-center gap-3 text-left cursor-pointer transition-colors`}
    >
      <span
        className={`w-6 h-6 rounded-[6px] flex items-center justify-center flex-shrink-0 ${
          checked ? "bg-[#9fe870]" : "bg-white border border-[#e8ebe5]"
        }`}
      >
        {checked ? (
          <span className="text-[#163300] text-[16px] font-bold leading-none">
            ✓
          </span>
        ) : null}
      </span>
      <span
        className={`flex-1 text-[14px] font-medium leading-[20px] ${
          checked ? "text-[#163300]" : "text-[#0e0f0c]"
        }`}
      >
        {children}
      </span>
    </button>
  );
};
