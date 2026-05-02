"use client";

export type ProjectType = "regular" | "spot";

type Props = {
  type: ProjectType;
  name: string;
  startTime: string;
  endTime: string;
  pickupLocation: string;
  deliveryLocation: string;
  contact: string;
  onClick: () => void;
};

const TYPE_LABEL: Record<ProjectType, string> = {
  regular: "定期",
  spot: "スポット",
};

const TYPE_BG: Record<ProjectType, string> = {
  regular: "bg-[#e2f6d5]",
  spot: "bg-[#fff2de]",
};

const TYPE_TEXT: Record<ProjectType, string> = {
  regular: "text-[#163300]",
  spot: "text-[#ec7e00]",
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-2 items-start w-full text-[12px]">
    <span className="w-[72px] shrink-0 text-[#868685] font-normal">
      {label}
    </span>
    <span className="flex-1 min-w-0 text-[#0e0f0c] font-normal">{value}</span>
  </div>
);

export const ProjectCard = ({
  type,
  name,
  startTime,
  endTime,
  pickupLocation,
  deliveryLocation,
  contact,
  onClick,
}: Props) => (
  <button
    type="button"
    onClick={onClick}
    className="bg-white rounded-[14px] flex flex-col gap-2.5 px-4 py-3.5 w-full text-left cursor-pointer hover:bg-[#fafafa] transition-colors leading-[normal]"
  >
    <div className="flex gap-2 items-center w-full">
      <span
        className={`shrink-0 inline-flex items-center px-2 py-[3px] rounded-full text-[10px] font-medium ${TYPE_BG[type]} ${TYPE_TEXT[type]}`}
      >
        {TYPE_LABEL[type]}
      </span>
      <span className="flex-1 min-w-0 text-[14px] font-semibold text-[#0e0f0c] truncate">
        {name}
      </span>
    </div>
    <div className="flex flex-col gap-1.5 w-full">
      <DetailRow label="時間" value={`${startTime} - ${endTime}`} />
      <DetailRow
        label="積地→着地"
        value={`${pickupLocation} → ${deliveryLocation}`}
      />
      <DetailRow label="担当" value={contact} />
    </div>
  </button>
);
