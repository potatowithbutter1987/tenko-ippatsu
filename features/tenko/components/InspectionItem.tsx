"use client";

export type InspectionResultValue = "ok" | "ng";

type Props = {
  label: string;
  value: InspectionResultValue | null;
  onChange: (value: InspectionResultValue) => void;
  error?: boolean;
};

const resolveBorderClass = (isActive: boolean, hasError: boolean): string => {
  if (isActive) return "border-transparent";
  if (hasError) return "border-[#e23b4a]";
  return "border-[#e8ebe6]";
};

const renderToggleClass = (isActive: boolean, hasError: boolean): string => {
  const base =
    "w-[38px] h-6 rounded-full text-[14px] font-semibold flex items-center justify-center cursor-pointer transition-colors border";
  const borderClass = resolveBorderClass(isActive, hasError);
  return isActive
    ? `${base} ${borderClass} bg-[#9fe870] text-[#163300] hover:bg-[#8edc5e]`
    : `${base} ${borderClass} bg-white text-[#868685] hover:bg-[#f7f7f5]`;
};

export const InspectionItem = ({ label, value, onChange, error }: Props) => {
  const hasError = Boolean(error);
  return (
    <div className="flex items-center justify-between py-[2px] w-full">
      <span className="text-[13px] text-[#0e0f0c]">{label}</span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange("ok")}
          aria-pressed={value === "ok"}
          aria-label={`${label} 異常なし`}
          className={renderToggleClass(value === "ok", hasError)}
        >
          ○
        </button>
        <button
          type="button"
          onClick={() => onChange("ng")}
          aria-pressed={value === "ng"}
          aria-label={`${label} 異常あり`}
          className={renderToggleClass(value === "ng", hasError)}
        >
          ×
        </button>
      </div>
    </div>
  );
};
