"use client";

type Props = {
  icon: string;
  title: string;
  description?: string;
  onClick: () => void;
};

export const ActionSheetCard = ({
  icon,
  title,
  description,
  onClick,
}: Props) => (
  <button
    type="button"
    onClick={onClick}
    className="bg-[#f7f7f5] rounded-xl flex gap-3.5 items-center p-3.5 w-full cursor-pointer hover:bg-[#e8ebe6] transition-colors"
  >
    <div className="bg-white border border-[#e8ebe6] rounded-full w-11 h-11 flex items-center justify-center shrink-0">
      <span
        className="text-[20px] text-[#0e0f0c] leading-none"
        style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
      >
        {icon}
      </span>
    </div>
    <div className="flex flex-1 flex-col gap-1 min-w-0 items-start text-left">
      <span className="text-[14px] font-semibold text-[#0e0f0c]">{title}</span>
      {description !== undefined ? (
        <span className="text-[12px] text-[#868685]">{description}</span>
      ) : null}
    </div>
    <span className="text-[18px] text-[#868685] leading-none">›</span>
  </button>
);
