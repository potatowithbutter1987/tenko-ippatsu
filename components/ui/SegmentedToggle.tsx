"use client";

type Option<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  value: T | null;
  onChange: (value: T) => void;
  options: ReadonlyArray<Option<T>>;
  error?: boolean;
};

export const SegmentedToggle = <T extends string>({
  value,
  onChange,
  options,
  error,
}: Props<T>) => {
  return (
    <div className="flex gap-3 w-full">
      {options.map((opt) => {
        const isActive = opt.value === value;
        const stateClass = isActive
          ? "bg-[#9fe870] text-[#163300] border border-transparent hover:bg-[#8edc5e]"
          : `bg-white text-[#888986] border hover:bg-[#f7f7f5] ${error ? "border-[#e23b4a]" : "border-[#e8ebe5]"}`;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              if (opt.value !== value) onChange(opt.value);
            }}
            aria-pressed={isActive}
            className={`flex-1 min-w-px py-3 rounded-full text-[14px] font-semibold cursor-pointer transition-colors ${stateClass}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
