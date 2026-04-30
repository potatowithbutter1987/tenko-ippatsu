"use client";

export type RecordType = "pre" | "post";

type Props = {
  type: RecordType;
  driverName: string;
  date: string;
  affiliation: string;
  carrier: string;
  method: string;
  alcoholValue: string;
  drinking: string;
  onClick?: () => void;
};

const TYPE_PILL_BG: Record<RecordType, string> = {
  pre: "bg-[#e2f6d5]",
  post: "bg-[#e7edf5]",
};

const TYPE_PILL_TEXT: Record<RecordType, string> = {
  pre: "text-[#163300]",
  post: "text-[#5576a3]",
};

const TYPE_LABEL: Record<RecordType, string> = {
  pre: "乗務前",
  post: "乗務後",
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-1 gap-1 items-center min-w-0 whitespace-nowrap">
    <span className="text-[10px] font-normal text-[#868685]">{label}</span>
    <span className="text-[12px] font-bold text-[#0e0f0c]">{value}</span>
  </div>
);

export const RecordCard = ({
  type,
  driverName,
  date,
  affiliation,
  carrier,
  method,
  alcoholValue,
  drinking,
  onClick,
}: Props) => (
  <button
    type="button"
    onClick={onClick}
    className="bg-white rounded-[14px] flex flex-col gap-2 px-3.5 py-3 w-full text-left cursor-pointer hover:bg-[#fafafa] transition-colors leading-[normal]"
  >
    <div className="flex gap-2 items-center w-full">
      <div
        className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full ${TYPE_PILL_BG[type]}`}
      >
        <span className={`text-[11px] font-bold ${TYPE_PILL_TEXT[type]}`}>
          {TYPE_LABEL[type]}
        </span>
      </div>
      <span className="flex-1 min-w-0 text-[15px] font-bold text-[#0e0f0c] truncate">
        {driverName}
      </span>
      <span className="text-[20px] font-normal text-[#0e0f0c]">›</span>
    </div>

    <div className="flex gap-1.5 items-center w-full text-[11px] whitespace-nowrap">
      <span className="font-semibold text-[#868685]">{date}</span>
      <span className="font-normal text-[#868685]">·</span>
      <span className="font-normal text-[#0e0f0c]">{affiliation}</span>
      <span className="font-normal text-[#868685]">·</span>
      <span className="font-normal text-[#0e0f0c]">{carrier}</span>
    </div>

    <div className="bg-[#f7f7f5] rounded-[10px] flex gap-2.5 items-center px-2.5 py-2 w-full">
      <Detail label="方法" value={method} />
      <div className="bg-[#e8ebe6] h-[18px] w-px shrink-0" />
      <Detail label="ア" value={alcoholValue} />
      <div className="bg-[#e8ebe6] h-[18px] w-px shrink-0" />
      <Detail label="酒気" value={drinking} />
    </div>
  </button>
);
