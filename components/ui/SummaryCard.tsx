type Props = {
  icon: string;
  label: string;
  value: number | string;
  valueColor?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

export const SummaryCard = ({
  icon,
  label,
  value,
  valueColor = "text-[#0e0f0c]",
  onClick,
  ariaLabel,
}: Props) => {
  const content = (
    <>
      <div className="flex gap-1.5 items-center">
        <span className="text-[11px] leading-none">{icon}</span>
        <span className="text-[11px] font-medium text-[#868685]">{label}</span>
      </div>
      <span className={`text-[22px] font-bold text-left ${valueColor}`}>
        {value}
      </span>
    </>
  );

  if (onClick === undefined) {
    return (
      <div className="bg-white rounded-xl flex flex-col gap-1.5 px-3.5 py-3 flex-1 min-w-0">
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="bg-white rounded-xl flex flex-col gap-1.5 px-3.5 py-3 flex-1 min-w-0 text-left cursor-pointer hover:bg-[#fafafa] transition-colors"
    >
      {content}
    </button>
  );
};
