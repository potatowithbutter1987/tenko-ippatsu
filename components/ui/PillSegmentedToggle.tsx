"use client";

export type PillSegmentVariant = "primary" | "danger" | "neutral";

type Option<T extends string> = {
  value: T;
  label: string;
  variant?: PillSegmentVariant;
};

type Props<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: ReadonlyArray<Option<T>>;
};

const SELECTED_CLASS: Record<PillSegmentVariant, string> = {
  primary: "bg-[#9fe870] text-[#163300]",
  danger: "bg-[#e23b4a] text-white",
  neutral: "bg-[#0e0f0c] text-white",
};

export const PillSegmentedToggle = <T extends string>({
  value,
  onChange,
  options,
}: Props<T>) => (
  <div className="bg-[#f7f7f5] flex gap-1 p-1 rounded-full w-full">
    {options.map((opt) => {
      const isSelected = opt.value === value;
      const variant: PillSegmentVariant = opt.variant ?? "neutral";
      const stateClass = isSelected
        ? SELECTED_CLASS[variant]
        : "text-[#868685] hover:text-[#0e0f0c]";
      return (
        <button
          key={opt.value}
          type="button"
          onClick={() => {
            if (opt.value !== value) onChange(opt.value);
          }}
          aria-pressed={isSelected}
          className={`flex-1 px-4 py-2.5 rounded-full text-[13px] font-semibold cursor-pointer transition-colors ${stateClass}`}
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);
