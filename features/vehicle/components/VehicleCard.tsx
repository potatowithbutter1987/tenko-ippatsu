"use client";

export type VehicleStatus = "active" | "stopped";
export type OwnershipType = "personal" | "company";

type Props = {
  plateNumber: string;
  vehicleName: string;
  status: VehicleStatus;
  ownershipType: OwnershipType;
  companyName: string | null;
  userName: string;
  inspectionExpiry: string;
  onClick: () => void;
};

const STATUS_LABEL: Record<VehicleStatus, string> = {
  active: "稼働中",
  stopped: "停止",
};

const STATUS_BG: Record<VehicleStatus, string> = {
  active: "bg-[#9fe870]",
  stopped: "bg-[#ffebeb]",
};

const STATUS_TEXT: Record<VehicleStatus, string> = {
  active: "text-[#163300]",
  stopped: "text-[#e23b4a]",
};

const OWNERSHIP_LABEL: Record<OwnershipType, string> = {
  personal: "個人",
  company: "会社",
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-2 items-start w-full text-[12px]">
    <span className="w-[80px] shrink-0 text-[#868685] font-normal">
      {label}
    </span>
    <span className="flex-1 min-w-0 text-[#0e0f0c] font-normal whitespace-nowrap truncate">
      {value}
    </span>
  </div>
);

export const VehicleCard = ({
  plateNumber,
  vehicleName,
  status,
  ownershipType,
  companyName,
  userName,
  inspectionExpiry,
  onClick,
}: Props) => (
  <button
    type="button"
    onClick={onClick}
    className="bg-white rounded-[14px] flex flex-col gap-2.5 px-4 py-3.5 w-full text-left cursor-pointer hover:bg-[#fafafa] transition-colors leading-[normal]"
  >
    <div className="flex items-center justify-between w-full gap-2">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[14px] font-semibold text-[#0e0f0c] truncate">
          {plateNumber}
        </span>
        <span className="text-[12px] font-normal text-[#868685] truncate">
          {vehicleName}
        </span>
      </div>
      <span
        className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${STATUS_BG[status]} ${STATUS_TEXT[status]}`}
      >
        {STATUS_LABEL[status]}
      </span>
    </div>
    <div className="flex flex-col gap-1.5 w-full">
      <DetailRow label="所有形態" value={OWNERSHIP_LABEL[ownershipType]} />
      <DetailRow label="会社名" value={companyName ?? "—"} />
      <DetailRow label="ユーザー" value={userName} />
      <DetailRow label="車検満了" value={inspectionExpiry} />
    </div>
  </button>
);
