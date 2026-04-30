"use client";

import {
  calcRemainingHours,
  resolveOperatingHoursStatus,
  type OperatingHoursStatus,
} from "@/features/operating-hours/types";

type Props = {
  driverName: string;
  affiliation: string;
  totalHours: number;
  onExportReport: () => void;
};

const STATUS_LABEL: Record<OperatingHoursStatus, string> = {
  exceeded: "法定超過",
  warning: "警告ライン",
  normal: "正常",
};

const STATUS_BADGE_BG: Record<OperatingHoursStatus, string> = {
  exceeded: "bg-[#fce4e6]",
  warning: "bg-[#fff3e0]",
  normal: "bg-[#e2f6d5]",
};

const STATUS_BADGE_TEXT: Record<OperatingHoursStatus, string> = {
  exceeded: "text-[#e23b4a]",
  warning: "text-[#ec7e00]",
  normal: "text-[#163300]",
};

const formatHours = (h: number): string => `${Math.round(h)}h`;

const formatRemaining = (h: number): string => {
  if (h < 0) return `-${Math.round(Math.abs(h))}h`;
  return `${Math.round(h)}h`;
};

export const DriverHoursCard = ({
  driverName,
  affiliation,
  totalHours,
  onExportReport,
}: Props) => {
  const status = resolveOperatingHoursStatus(totalHours);
  const remaining = calcRemainingHours(totalHours);
  const remainingColor = remaining < 0 ? "text-[#e23b4a]" : "text-[#0e0f0c]";

  return (
    <div className="bg-white border border-[#e8ebe6] rounded-[12px] flex items-stretch overflow-hidden w-full leading-[normal]">
      <div className="flex flex-1 min-w-0 items-center gap-3 px-3.5 py-3">
        <div className="flex flex-1 flex-col gap-1.5 min-w-0 items-start">
          <div className="flex gap-2 items-center w-full min-w-0">
            <div
              className={`shrink-0 inline-flex items-center justify-center rounded-full px-2 py-[3px] ${STATUS_BADGE_BG[status]}`}
            >
              <span
                className={`text-[10px] font-semibold whitespace-nowrap ${STATUS_BADGE_TEXT[status]}`}
              >
                {STATUS_LABEL[status]}
              </span>
            </div>
            <span className="flex-1 min-w-0 text-[14px] font-semibold text-[#0e0f0c] truncate">
              {driverName}
            </span>
          </div>
          <span className="text-[11px] font-normal text-[#868685] truncate max-w-full">
            {affiliation}
          </span>
          <div className="flex gap-3.5 items-center whitespace-nowrap">
            <div className="flex gap-1 items-center">
              <span className="text-[10px] font-medium text-[#868685]">
                拘束
              </span>
              <span className="text-[13px] font-bold text-[#0e0f0c]">
                {formatHours(totalHours)}
              </span>
            </div>
            <div className="flex gap-1 items-center">
              <span className="text-[10px] font-medium text-[#868685]">残</span>
              <span className={`text-[13px] font-bold ${remainingColor}`}>
                {formatRemaining(remaining)}
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onExportReport}
          className="shrink-0 bg-[#9fe870] rounded-full flex items-center justify-center px-3 py-2.5 text-[11px] font-semibold text-[#163300] cursor-pointer hover:bg-[#8edc5e] transition-colors"
        >
          帳票
        </button>
      </div>
    </div>
  );
};
