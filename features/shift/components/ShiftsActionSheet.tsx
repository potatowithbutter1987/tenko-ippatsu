"use client";

type ActionCardProps = {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
};

const ActionCard = ({ icon, title, description, onClick }: ActionCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className="bg-white border border-[#e8ebe6] rounded-[14px] flex gap-3.5 items-center p-3.5 w-full cursor-pointer hover:bg-[#f7f7f5] transition-colors leading-[normal]"
  >
    <div className="bg-[#e2f6d5] rounded-[12px] w-11 h-11 flex items-center justify-center shrink-0">
      <span
        className="text-[20px] text-[#163300] leading-none"
        style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
      >
        {icon}
      </span>
    </div>
    <div className="flex flex-1 flex-col gap-[3px] min-w-0 items-start text-left">
      <span className="text-[14px] font-semibold text-[#0e0f0c] whitespace-nowrap truncate">
        {title}
      </span>
      <span className="text-[12px] font-normal text-[#868685] whitespace-nowrap truncate">
        {description}
      </span>
    </div>
    <span className="text-[20px] text-[#868685] leading-none shrink-0">›</span>
  </button>
);

type Props = {
  monthLabel: string;
  onCsvImport: () => void;
  onCsvExport: () => void;
  onCopyShift: () => void;
};

export const ShiftsActionSheet = ({
  monthLabel,
  onCsvImport,
  onCsvExport,
  onCopyShift,
}: Props) => (
  <div className="flex flex-col gap-3.5 w-full">
    <p className="text-[12px] font-normal text-[#868685] leading-[normal]">
      {monthLabel}のシフトに対する一括操作
    </p>
    <ActionCard
      icon="⬇"
      title="CSV取込"
      description="他システムから作成したシフトを取り込み"
      onClick={onCsvImport}
    />
    <ActionCard
      icon="⬆"
      title="CSV出力"
      description="表示中の月のシフトを CSV でダウンロード"
      onClick={onCsvExport}
    />
    <ActionCard
      icon="⎘"
      title="シフトコピー"
      description="コピー元シフトをベースに一括上書き"
      onClick={onCopyShift}
    />
  </div>
);
