"use client";

import { useState } from "react";

export type TenkoSegmentKey = "before" | "after";

export type DetailRow = {
  label: string;
  value: string;
  isOk?: boolean;
};

export type TenkoSegmentDetail = {
  rows: ReadonlyArray<DetailRow>;
  message: string;
};

type Props = {
  before: TenkoSegmentDetail | null;
  after: TenkoSegmentDetail | null;
  editLogs: ReadonlyArray<string>;
  initialSegment?: TenkoSegmentKey;
  onClose: () => void;
  onEdit: (segment: TenkoSegmentKey) => void;
};

type SegmentButtonProps = {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

const SegmentButton = ({ active, onClick, children }: SegmentButtonProps) => {
  const stateClass = active
    ? "bg-[#0e0f0c] text-white"
    : "text-[#868685] hover:text-[#0e0f0c]";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 px-4 py-2.5 rounded-full text-[13px] font-semibold cursor-pointer transition-colors ${stateClass}`}
    >
      {children}
    </button>
  );
};

const DetailRowItem = ({ row }: { row: DetailRow }) => {
  const valueClass = row.isOk === true ? "text-[#163300]" : "text-[#0e0f0c]";
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-[#e8ebe6] w-full">
      <span className="text-[13px] text-[#868685]">{row.label}</span>
      <span className={`text-[13px] font-semibold text-right ${valueClass}`}>
        {row.value}
      </span>
    </div>
  );
};

export const TenkoResultSheet = ({
  before,
  after,
  editLogs,
  initialSegment = "before",
  onClose,
  onEdit,
}: Props) => {
  const [segment, setSegment] = useState<TenkoSegmentKey>(initialSegment);
  const detail = segment === "before" ? before : after;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-[#f7f7f5] flex gap-1 p-1 rounded-full w-full">
        <SegmentButton
          active={segment === "before"}
          onClick={() => setSegment("before")}
        >
          乗務前
        </SegmentButton>
        <SegmentButton
          active={segment === "after"}
          onClick={() => setSegment("after")}
        >
          乗務後
        </SegmentButton>
      </div>

      {detail === null ? (
        <p className="text-[14px] text-[#868685] py-4">
          {segment === "before" ? "乗務前点呼" : "乗務後点呼"}は未実施です。
        </p>
      ) : (
        <div className="flex flex-col py-1 w-full">
          {detail.rows.map((row) => (
            <DetailRowItem key={row.label} row={row} />
          ))}
          <div className="flex flex-col gap-2 py-3.5 w-full">
            <span className="text-[14px] font-semibold text-[#0e0f0c]">
              伝達事項
            </span>
            <div className="bg-white border border-[#e8ebe6] rounded-[10px] px-4 py-3.5 min-h-[96px] w-full">
              <p className="text-[14px] text-[#0e0f0c] leading-relaxed">
                {detail.message === "" ? "—" : detail.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {editLogs.length > 0 ? (
        <div className="bg-[#f7f7f5] border border-[#e8ebe6] rounded-[10px] flex flex-col gap-1.5 px-3.5 py-3 w-full">
          <p className="text-[12px] font-semibold text-[#868685]">編集ログ</p>
          {editLogs.map((log) => (
            <p key={log} className="text-[12px] text-[#868685]">
              {log}
            </p>
          ))}
        </div>
      ) : null}

      <div className="flex gap-3 w-full">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-white border border-[#e8ebe6] rounded-full px-6 py-3.5 text-[14px] font-semibold text-[#868685] cursor-pointer hover:bg-[#f7f7f5] transition-colors"
        >
          閉じる
        </button>
        <button
          type="button"
          onClick={() => onEdit(segment)}
          className="flex-1 bg-[#9fe870] rounded-full px-6 py-3.5 text-[14px] font-semibold text-[#163300] cursor-pointer hover:bg-[#8edc5e] transition-colors"
        >
          編集
        </button>
      </div>
    </div>
  );
};
