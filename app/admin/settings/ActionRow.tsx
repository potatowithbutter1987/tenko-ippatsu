"use client";

type Props = {
  primaryLabel: string;
  onPrimaryClick: () => void;
  onActionClick?: () => void;
};

export const ActionRow = ({
  primaryLabel,
  onPrimaryClick,
  onActionClick,
}: Props) => (
  <div className="bg-white w-full leading-[normal]">
    <div className="max-w-[765px] mx-auto flex gap-3 items-center px-4 py-2.5 w-full">
      <button
        type="button"
        onClick={onPrimaryClick}
        className="flex-1 bg-[#9fe870] rounded-full px-6 py-3 text-[14px] font-semibold text-[#163300] cursor-pointer hover:bg-[#8edc5e] transition-colors"
      >
        {primaryLabel}
      </button>
      {onActionClick !== undefined ? (
        <button
          type="button"
          onClick={onActionClick}
          className="bg-white border border-[#e8ebe6] rounded-full flex gap-1.5 items-center px-[18px] py-3 cursor-pointer hover:bg-[#f7f7f5] transition-colors"
        >
          <span className="text-[14px] font-semibold text-[#0e0f0c]">⋯</span>
          <span className="text-[14px] font-semibold text-[#0e0f0c]">操作</span>
        </button>
      ) : null}
    </div>
  </div>
);
