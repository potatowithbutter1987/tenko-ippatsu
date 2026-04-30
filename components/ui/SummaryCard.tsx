type Props = {
  icon: string;
  label: string;
  value: number | string;
  valueColor?: string;
};

export const SummaryCard = ({
  icon,
  label,
  value,
  valueColor = "text-[#0e0f0c]",
}: Props) => (
  <div className="bg-white rounded-xl flex flex-col gap-1.5 px-3.5 py-3 flex-1 min-w-0">
    <div className="flex gap-1.5 items-center">
      <span className="text-[11px] leading-none">{icon}</span>
      <span className="text-[11px] font-medium text-[#868685]">{label}</span>
    </div>
    <span className={`text-[22px] font-bold ${valueColor}`}>{value}</span>
  </div>
);
