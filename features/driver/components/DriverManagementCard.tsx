"use client";

export type DriverManagementStatus = "active" | "pending" | "retired";

type Props = {
  status: DriverManagementStatus;
  driverName: string;
  age: number | null;
  affiliation: string;
  affiliationTier: string;
  role: string;
  vehicle: string;
  project: string;
  phone: string;
  onClick: () => void;
};

const STATUS_LABEL: Record<DriverManagementStatus, string> = {
  active: "稼働中",
  pending: "新規登録",
  retired: "停止",
};

const STATUS_BG: Record<DriverManagementStatus, string> = {
  active: "bg-[#e2f6d5]",
  pending: "bg-[#fef0dc]",
  retired: "bg-[#fde8ea]",
};

const STATUS_TEXT: Record<DriverManagementStatus, string> = {
  active: "text-[#163300]",
  pending: "text-[#ec7e00]",
  retired: "text-[#e23b4a]",
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-2 items-center w-full">
    <span className="w-[60px] shrink-0 text-[10px] font-normal text-[#868685]">
      {label}
    </span>
    <span className="flex-1 min-w-0 text-[12px] font-medium text-[#0e0f0c]">
      {value}
    </span>
  </div>
);

export const DriverManagementCard = ({
  status,
  driverName,
  age,
  affiliation,
  affiliationTier,
  role,
  vehicle,
  project,
  phone,
  onClick,
}: Props) => (
  <button
    type="button"
    onClick={onClick}
    className="bg-white rounded-[14px] flex flex-col gap-2 px-3.5 py-3 w-full text-left leading-[normal] cursor-pointer hover:bg-[#fafafa] transition-colors"
  >
    <div className="flex gap-2 items-center w-full">
      <div
        className={`shrink-0 inline-flex items-center gap-[3px] pl-[7px] pr-2 py-0.5 rounded-full ${STATUS_BG[status]}`}
      >
        <span className={`text-[11px] font-bold ${STATUS_TEXT[status]}`}>
          {STATUS_LABEL[status]}
        </span>
      </div>
      <div className="flex flex-1 gap-2 items-baseline min-w-0">
        <span className="shrink-0 text-[15px] font-bold text-[#0e0f0c] truncate">
          {driverName}
        </span>
        {age !== null ? (
          <span className="shrink-0 text-[13px] font-normal text-[#868685]">
            ({age})
          </span>
        ) : null}
      </div>
      <span className="shrink-0 text-[20px] font-normal text-[#868685]">›</span>
    </div>

    <div className="flex gap-1.5 items-center w-full text-[11px] whitespace-nowrap">
      <span className="font-bold text-[#868685]">
        {affiliation} ({affiliationTier})
      </span>
      <span className="font-normal text-[#868685]">·</span>
      <span className="font-normal text-[#0e0f0c]">{role}</span>
    </div>

    <div className="bg-[#f7f7f5] rounded-[10px] flex flex-col gap-1.5 px-2.5 py-2 w-full">
      <DetailRow label="車両" value={vehicle} />
      <DetailRow label="案件" value={project} />
      <DetailRow label="電話" value={phone} />
    </div>
  </button>
);
