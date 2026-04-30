"use client";

export type TenkoOverallStatus = "missing" | "warning" | "completed";

export type CheckOutcome = "ok" | "ng";

export type DriverCheckSnapshot = {
  time: string | null;
  alcohol: CheckOutcome | null;
  health: CheckOutcome | null;
};

type Props = {
  status: TenkoOverallStatus;
  driverName: string;
  affiliation: string;
  vehicleAffiliation: string;
  beforeCheck: DriverCheckSnapshot;
  afterCheck: DriverCheckSnapshot;
  onClick?: () => void;
};

const STATUS_LABEL: Record<TenkoOverallStatus, string> = {
  missing: "未点呼",
  warning: "要確認",
  completed: "完了",
};

const STATUS_BG: Record<TenkoOverallStatus, string> = {
  missing: "bg-[#fde8ea]",
  warning: "bg-[#fef0dc]",
  completed: "bg-[#e2f6d5]",
};

const STATUS_TEXT: Record<TenkoOverallStatus, string> = {
  missing: "text-[#e23b4a]",
  warning: "text-[#ec7e00]",
  completed: "text-[#163300]",
};

const STATUS_ICON: Record<TenkoOverallStatus, string> = {
  missing: "🟥",
  warning: "🟡",
  completed: "🟢",
};

const RESULT_COLOR: Record<CheckOutcome, string> = {
  ok: "text-[#163300]",
  ng: "text-[#e23b4a]",
};

const renderOutcome = (outcome: CheckOutcome | null): React.ReactNode => {
  if (outcome === null) {
    return <span className="text-[10px] font-bold text-[#868685]">—</span>;
  }
  return (
    <span className={`text-[10px] font-bold ${RESULT_COLOR[outcome]}`}>
      {outcome.toUpperCase()}
    </span>
  );
};

const CheckSegment = ({
  label,
  check,
}: {
  label: string;
  check: DriverCheckSnapshot;
}) => (
  <div className="flex flex-1 gap-1.5 items-center min-w-0 whitespace-nowrap">
    <span className="text-[10px] font-medium text-[#868685]">{label}</span>
    <span className="text-[12px] font-bold text-[#0e0f0c]">
      {check.time ?? "—"}
    </span>
    <div className="flex gap-0.5 items-center">
      <span className="text-[9px] font-medium text-[#868685]">ア</span>
      {renderOutcome(check.alcohol)}
    </div>
    <div className="flex gap-0.5 items-center">
      <span className="text-[9px] font-medium text-[#868685]">体</span>
      {renderOutcome(check.health)}
    </div>
  </div>
);

export const DriverStatusCard = ({
  status,
  driverName,
  affiliation,
  vehicleAffiliation,
  beforeCheck,
  afterCheck,
  onClick,
}: Props) => (
  <button
    type="button"
    onClick={onClick}
    className="bg-white rounded-2xl flex flex-col gap-1.5 px-3.5 py-3 w-full text-left cursor-pointer hover:bg-[#fafafa] transition-colors"
  >
    <div className="flex gap-2 items-center w-full">
      <div
        className={`flex gap-0.5 items-center pl-1.5 pr-2 py-0.5 rounded-full ${STATUS_BG[status]}`}
      >
        <span className="text-[10px] leading-none">{STATUS_ICON[status]}</span>
        <span className={`text-[11px] font-bold ${STATUS_TEXT[status]}`}>
          {STATUS_LABEL[status]}
        </span>
      </div>
      <span className="flex-1 min-w-0 text-[15px] font-bold text-[#0e0f0c] truncate">
        {driverName}
      </span>
      <span className="text-[20px] text-[#868685] leading-none">›</span>
    </div>
    <div className="flex gap-1.5 items-center text-[11px]">
      <span className="font-semibold text-[#868685]">{affiliation}</span>
      <span className="text-[#868685]">·</span>
      <span className="font-medium text-[#0e0f0c]">{vehicleAffiliation}</span>
    </div>
    <div className="bg-[#f7f7f5] rounded-[10px] flex gap-2 items-center px-2.5 py-2 w-full">
      <CheckSegment label="乗務前" check={beforeCheck} />
      <div className="bg-[#e8ebe6] h-[18px] w-px" />
      <CheckSegment label="乗務後" check={afterCheck} />
    </div>
  </button>
);
