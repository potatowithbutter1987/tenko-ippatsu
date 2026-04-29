"use client";

import {
  InspectionItem,
  type InspectionResultValue,
} from "@/features/tenko/components/InspectionItem";

export const INSPECTION_GROUPS = [
  {
    title: "① エンジンルーム",
    items: [
      { key: "brakeOil", label: "ブレーキオイル量" },
      { key: "coolant", label: "冷却水の量" },
      { key: "engineOil", label: "エンジンオイルの量" },
      { key: "battery", label: "バッテリー液の量" },
      { key: "washer", label: "ウインドウォシャーの量" },
    ],
  },
  {
    title: "② 車両周り",
    items: [
      { key: "lights", label: "ランプの点灯/点滅" },
      { key: "tireDamage", label: "タイヤ亀裂破損" },
      { key: "tirePressure", label: "タイヤ空気圧" },
      { key: "tireDepth", label: "タイヤの溝の深さ" },
    ],
  },
  {
    title: "③ 運転席",
    items: [
      { key: "engineStart", label: "エンジンかかり具合/異音" },
      { key: "washerSpray", label: "ウインドウォシャー噴射状況" },
      { key: "wiperWipe", label: "ワイパーのふき取り能力" },
      { key: "brakePedal", label: "ブレーキの効きと踏みしろ" },
      { key: "parkingBrake", label: "駐車ブレーキの引きしろ、踏みしろ" },
      { key: "engineSpeed", label: "エンジンの低速と加速" },
    ],
  },
] as const;

export type InspectionKey =
  (typeof INSPECTION_GROUPS)[number]["items"][number]["key"];

export const ALL_INSPECTION_KEYS: ReadonlyArray<InspectionKey> =
  INSPECTION_GROUPS.flatMap((g) => g.items.map((i) => i.key));

export type InspectionResult = Partial<
  Record<InspectionKey, InspectionResultValue>
>;

type Props = {
  value: InspectionResult;
  onChange: (key: InspectionKey, result: InspectionResultValue) => void;
  errorOnUnselected?: boolean;
};

export const VehicleInspectionPanel = ({
  value,
  onChange,
  errorOnUnselected,
}: Props) => {
  return (
    <div className="bg-white border border-[#e8ebe6] rounded-[10px] px-[14px] py-[10px] flex flex-col gap-[10px] w-full">
      {INSPECTION_GROUPS.map((group) => (
        <div key={group.title} className="flex flex-col gap-[2px] w-full">
          <p className="text-[13px] font-semibold text-[#868685]">
            {group.title}
          </p>
          <div className="flex flex-col w-full">
            {group.items.map((item) => (
              <InspectionItem
                key={item.key}
                label={item.label}
                value={value[item.key] ?? null}
                onChange={(result) => onChange(item.key, result)}
                error={
                  Boolean(errorOnUnselected) && value[item.key] === undefined
                }
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
