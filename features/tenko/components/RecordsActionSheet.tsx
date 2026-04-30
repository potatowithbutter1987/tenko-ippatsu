"use client";

import { ActionSheetCard } from "@/components/ui/ActionSheetCard";

type Props = {
  onCsvExport: () => void;
};

export const RecordsActionSheet = ({ onCsvExport }: Props) => (
  <div className="flex flex-col gap-3.5 w-full">
    <p className="text-[13px] text-[#868685]">点呼記録データ</p>
    <ActionSheetCard
      icon="⬆"
      title="CSV出力"
      description="絞り込み結果の点呼記録を CSV でダウンロード"
      onClick={onCsvExport}
    />
  </div>
);
