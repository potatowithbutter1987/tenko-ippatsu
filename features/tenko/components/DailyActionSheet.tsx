"use client";

import { ActionSheetCard } from "@/components/ui/ActionSheetCard";

type Props = {
  onCsvExport: () => void;
};

export const DailyActionSheet = ({ onCsvExport }: Props) => (
  <div className="flex flex-col gap-3.5 w-full">
    <p className="text-[13px] text-[#868685]">点呼状況データ</p>
    <ActionSheetCard
      icon="⬆"
      title="CSV出力"
      description="表示中の点呼状況を CSV でダウンロード"
      onClick={onCsvExport}
    />
  </div>
);
