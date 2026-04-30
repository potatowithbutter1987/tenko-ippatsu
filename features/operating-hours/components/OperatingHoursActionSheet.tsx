"use client";

import { ActionSheetCard } from "@/components/ui/ActionSheetCard";

type Props = {
  onCsvExport: () => void;
};

export const OperatingHoursActionSheet = ({ onCsvExport }: Props) => (
  <div className="flex flex-col gap-3.5 w-full">
    <p className="text-[13px] text-[#868685]">月間運行時間データ</p>
    <ActionSheetCard
      icon="⬆"
      title="CSV出力（一括帳票）"
      description="絞り込み結果の全ドライバー分を CSV でダウンロード"
      onClick={onCsvExport}
    />
  </div>
);
