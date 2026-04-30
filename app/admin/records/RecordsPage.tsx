"use client";

import {
  addMonths,
  endOfMonth,
  format,
  startOfMonth,
  subMonths,
} from "date-fns";
import { ja } from "date-fns/locale";
import { useMemo, useState } from "react";

import { AdminAppBar } from "@/components/layout/AdminAppBar";
import { useAdminShell } from "@/components/layout/NavigationDrawer";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { SearchResultCount } from "@/components/ui/SearchResultCount";
import {
  RecordCard,
  type RecordType,
} from "@/features/tenko/components/RecordCard";
import { RecordsActionSheet } from "@/features/tenko/components/RecordsActionSheet";
import {
  countActiveRecordsFilters,
  DEFAULT_RECORDS_FILTER,
  RecordsFilterSheet,
  type RecordsFilterValue,
} from "@/features/tenko/components/RecordsFilterSheet";
import {
  TenkoEditSheet,
  type TenkoAfterEditValue,
  type TenkoBeforeEditValue,
  type TenkoEditPayload,
} from "@/features/tenko/components/TenkoEditSheet";
import {
  TenkoResultSheet,
  type TenkoSegmentDetail,
  type TenkoSegmentKey,
} from "@/features/tenko/components/TenkoResultSheet";

const INITIAL_MONTH = startOfMonth(new Date(2026, 3, 1));

type RecordEntry = {
  id: string;
  type: RecordType;
  driverName: string;
  date: string;
  affiliation: string;
  affiliationId: string;
  carrier: string;
  projectId: string;
  method: string;
  alcoholValue: string;
  drinking: string;
};

const MOCK_RECORDS: ReadonlyArray<RecordEntry> = [
  {
    id: "1",
    type: "pre",
    driverName: "佐藤 次郎",
    date: "2026/4/8",
    affiliation: "個人",
    affiliationId: "personal",
    carrier: "近鉄",
    projectId: "amazon",
    method: "対面",
    alcoholValue: "0.00",
    drinking: "無",
  },
  {
    id: "2",
    type: "post",
    driverName: "佐藤 次郎",
    date: "2026/4/8",
    affiliation: "個人",
    affiliationId: "personal",
    carrier: "近鉄",
    projectId: "amazon",
    method: "対面",
    alcoholValue: "0.00",
    drinking: "無",
  },
  {
    id: "3",
    type: "pre",
    driverName: "田中 一郎",
    date: "2026/4/8",
    affiliation: "個人",
    affiliationId: "personal",
    carrier: "日通",
    projectId: "nissan",
    method: "その他",
    alcoholValue: "0.00",
    drinking: "無",
  },
  {
    id: "4",
    type: "post",
    driverName: "田中 一郎",
    date: "2026/4/8",
    affiliation: "個人",
    affiliationId: "personal",
    carrier: "日通",
    projectId: "nissan",
    method: "その他",
    alcoholValue: "0.00",
    drinking: "無",
  },
];

const MOCK_SUMMARY = {
  exceeded: 1,
  warning: 3,
  averageHours: 185.5,
};

type RecordDetail = {
  before: TenkoSegmentDetail | null;
  after: TenkoSegmentDetail | null;
  editLogs: ReadonlyArray<string>;
  beforeEdit: TenkoBeforeEditValue;
  afterEdit: TenkoAfterEditValue;
};

const buildDetailKey = (driverName: string, date: string): string =>
  `${driverName}_${date}`;

const SATO_DETAIL: RecordDetail = {
  before: {
    rows: [
      { label: "実施時刻", value: "08:20" },
      { label: "点呼実施者", value: "山田 管理者" },
      { label: "点呼方法", value: "対面" },
      { label: "免許証確認", value: "OK", isOk: true },
      { label: "体調", value: "OK", isOk: true },
      { label: "車両点検", value: "OK", isOk: true },
      { label: "アルコール検知器使用", value: "使用" },
      { label: "酒気帯び", value: "なし" },
      { label: "検知数値", value: "0.00 mg/L" },
      { label: "開始ODO", value: "123,456 km" },
      { label: "車両", value: "品川 500 あ 12-34" },
    ],
    message: "本日は首都高 C1 内回りで工事あり。迂回を推奨。",
  },
  after: {
    rows: [
      { label: "実施時刻", value: "17:45" },
      { label: "点呼実施者", value: "山田 管理者" },
      { label: "点呼方法", value: "対面" },
      { label: "アルコール検知器使用", value: "使用" },
      { label: "酒気帯び", value: "なし" },
      { label: "検知数値", value: "0.00 mg/L" },
      { label: "終了ODO", value: "123,712 km" },
      { label: "運行状況報告", value: "特になし" },
      { label: "交替運転者通告", value: "特になし" },
      { label: "休憩場所", value: "海老名 SA" },
      { label: "車両", value: "品川 500 あ 12-34" },
    ],
    message: "",
  },
  editLogs: [],
  beforeEdit: {
    time: "08:20",
    inspector: "山田 管理者",
    method: "facetoface",
    methodNote: "",
    licenseConfirmed: true,
    health: "yes",
    vehicleCheck: "normal",
    inspectionResult: {},
    alcoholUsed: "used",
    alcoholStatus: "normal",
    alcoholValue: "0.00",
    startOdo: "123456",
    vehicleId: "vehicle-1",
    message: "本日は首都高 C1 内回りで工事あり。迂回を推奨。",
  },
  afterEdit: {
    time: "17:45",
    inspector: "山田 管理者",
    method: "facetoface",
    methodNote: "",
    alcoholUsed: "used",
    alcoholStatus: "normal",
    alcoholValue: "0.00",
    endOdo: "123712",
    statusReport: "none",
    statusReportNote: "",
    handover: "none",
    handoverNote: "",
    restLocation: "rest-2",
    vehicleId: "vehicle-1",
    message: "",
  },
};

const TANAKA_DETAIL: RecordDetail = {
  before: {
    rows: [
      { label: "実施時刻", value: "08:00" },
      { label: "点呼実施者", value: "山田 管理者" },
      { label: "点呼方法", value: "その他" },
      { label: "免許証確認", value: "OK", isOk: true },
      { label: "体調", value: "OK", isOk: true },
      { label: "車両点検", value: "OK", isOk: true },
      { label: "アルコール検知器使用", value: "使用" },
      { label: "酒気帯び", value: "なし" },
      { label: "検知数値", value: "0.00 mg/L" },
      { label: "開始ODO", value: "98,210 km" },
      { label: "車両", value: "品川 500 い 56-78" },
    ],
    message: "",
  },
  after: {
    rows: [
      { label: "実施時刻", value: "18:30" },
      { label: "点呼実施者", value: "山田 管理者" },
      { label: "点呼方法", value: "その他" },
      { label: "アルコール検知器使用", value: "使用" },
      { label: "酒気帯び", value: "なし" },
      { label: "検知数値", value: "0.00 mg/L" },
      { label: "終了ODO", value: "98,418 km" },
      { label: "運行状況報告", value: "特になし" },
      { label: "交替運転者通告", value: "特になし" },
      { label: "休憩場所", value: "○○ PA" },
      { label: "車両", value: "品川 500 い 56-78" },
    ],
    message: "",
  },
  editLogs: [],
  beforeEdit: {
    time: "08:00",
    inspector: "山田 管理者",
    method: "other",
    methodNote: "電話",
    licenseConfirmed: true,
    health: "yes",
    vehicleCheck: "normal",
    inspectionResult: {},
    alcoholUsed: "used",
    alcoholStatus: "normal",
    alcoholValue: "0.00",
    startOdo: "98210",
    vehicleId: "vehicle-2",
    message: "",
  },
  afterEdit: {
    time: "18:30",
    inspector: "山田 管理者",
    method: "other",
    methodNote: "電話",
    alcoholUsed: "used",
    alcoholStatus: "normal",
    alcoholValue: "0.00",
    endOdo: "98418",
    statusReport: "none",
    statusReportNote: "",
    handover: "none",
    handoverNote: "",
    restLocation: "rest-1",
    vehicleId: "vehicle-2",
    message: "",
  },
};

const RECORD_DETAILS_BY_KEY: Record<string, RecordDetail> = {
  [buildDetailKey("佐藤 次郎", "2026/4/8")]: SATO_DETAIL,
  [buildDetailKey("田中 一郎", "2026/4/8")]: TANAKA_DETAIL,
};

const findRecordDetail = (record: RecordEntry | null): RecordDetail | null => {
  if (record === null) return null;
  return (
    RECORD_DETAILS_BY_KEY[buildDetailKey(record.driverName, record.date)] ??
    null
  );
};

const buildRecordSubtitle = (record: RecordEntry | null): string | undefined =>
  record === null ? undefined : `${record.driverName} ・ ${record.affiliation}`;

type RecordPredicate = (
  record: RecordEntry,
  filter: RecordsFilterValue,
) => boolean;

const passesDriverName: RecordPredicate = (r, f) => {
  const q = f.driverName.trim();
  return q === "" || r.driverName.includes(q);
};

const passesAffiliation: RecordPredicate = (r, f) =>
  f.affiliationId === "" || r.affiliationId === f.affiliationId;

const passesProject: RecordPredicate = (r, f) =>
  f.projectId === "" || r.projectId === f.projectId;

const passesDateRange: RecordPredicate = (r, f) => {
  if (f.dateFrom === "" && f.dateTo === "") return true;
  const recordDate = r.date.replace(/\//g, "-");
  if (f.dateFrom !== "" && recordDate < f.dateFrom) return false;
  if (f.dateTo !== "" && recordDate > f.dateTo) return false;
  return true;
};

const RECORD_PREDICATES: ReadonlyArray<RecordPredicate> = [
  passesDriverName,
  passesAffiliation,
  passesProject,
  passesDateRange,
];

const matchesFilter = (
  record: RecordEntry,
  filter: RecordsFilterValue,
): boolean => RECORD_PREDICATES.every((p) => p(record, filter));

type SummaryCardProps = {
  icon: string;
  label: string;
  value: string;
  valueColor: string;
};

const RecordSummaryCard = ({
  icon,
  label,
  value,
  valueColor,
}: SummaryCardProps) => (
  <div className="bg-white rounded-[16px] flex flex-col gap-1.5 p-3.5 flex-1 min-w-0 leading-[normal]">
    <div className="flex gap-1 items-center w-full">
      <span className="text-[12px] text-black">{icon}</span>
      <span className="text-[10px] font-normal text-[#868685]">{label}</span>
    </div>
    <span className={`text-[22px] font-bold ${valueColor}`}>{value}</span>
  </div>
);

const MonthNav = ({
  month,
  onChange,
}: {
  month: Date;
  onChange: (next: Date) => void;
}) => (
  <div className="bg-white border-y border-[#e8ebe6] w-full leading-[normal]">
    <div className="max-w-[765px] mx-auto flex items-center justify-between px-4 py-2.5">
      <button
        type="button"
        onClick={() => onChange(subMonths(month, 1))}
        aria-label="前月"
        className="bg-[#f7f7f5] w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold text-[#0e0f0c] cursor-pointer hover:bg-[#e8ebe6] transition-colors"
      >
        ◀
      </button>
      <div className="flex-1 flex flex-col items-center gap-0.5 whitespace-nowrap">
        <p className="text-[16px] font-bold text-[#0e0f0c]">
          {format(month, "yyyy年 M月", { locale: ja })}度
        </p>
        <p className="text-[11px] font-normal text-[#868685]">
          {format(startOfMonth(month), "M/d")} -{" "}
          {format(endOfMonth(month), "M/d")}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onChange(addMonths(month, 1))}
        aria-label="翌月"
        className="bg-[#f7f7f5] w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold text-[#0e0f0c] cursor-pointer hover:bg-[#e8ebe6] transition-colors"
      >
        ▶
      </button>
    </div>
  </div>
);

const Toolbar = ({
  filterCount,
  onFilterClick,
  onActionClick,
}: {
  filterCount: number;
  onFilterClick: () => void;
  onActionClick: () => void;
}) => (
  <div className="bg-white border-b border-[#e8ebe6] w-full leading-[normal]">
    <div className="max-w-[765px] mx-auto flex gap-2 items-center px-4 py-2.5">
      <button
        type="button"
        onClick={onFilterClick}
        className="flex-1 bg-white border border-[#e8ebe6] rounded-full flex gap-2 items-center px-4 py-3.5 cursor-pointer hover:bg-[#f7f7f5] transition-colors"
      >
        <span className="text-[14px] text-black">🔍</span>
        <span className="flex-1 text-left text-[14px] font-normal text-[#868685]">
          絞り込み
        </span>
        {filterCount > 0 ? (
          <span className="bg-[#9fe870] rounded-full px-2 py-0.5 text-[11px] font-bold text-[#163300]">
            {filterCount}
          </span>
        ) : null}
      </button>
      <button
        type="button"
        onClick={onActionClick}
        className="bg-white border border-[#e8ebe6] rounded-full flex items-center px-3.5 py-3.5 cursor-pointer hover:bg-[#f7f7f5] transition-colors"
      >
        <span className="text-[13px] font-semibold text-[#0e0f0c] whitespace-pre">{`⋯  操作`}</span>
      </button>
    </div>
  </div>
);

export const RecordsPage = () => {
  const { openDrawer } = useAdminShell();
  const [month, setMonth] = useState(INITIAL_MONTH);
  const [filter, setFilter] = useState<RecordsFilterValue>(
    DEFAULT_RECORDS_FILTER,
  );
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [resultOpen, setResultOpen] = useState(false);
  const [resultSegment, setResultSegment] = useState<TenkoSegmentKey>("before");
  const [editing, setEditing] = useState<{
    recordId: string;
    segment: TenkoSegmentKey;
  } | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const filterCount = countActiveRecordsFilters(filter);

  const filteredRecords = useMemo(
    () => MOCK_RECORDS.filter((r) => matchesFilter(r, filter)),
    [filter],
  );

  const findRecord = (id: string | null): RecordEntry | null =>
    id === null ? null : (MOCK_RECORDS.find((r) => r.id === id) ?? null);

  const selectedRecord = findRecord(selectedRecordId);
  const selectedDetail = findRecordDetail(selectedRecord);
  const editingRecord = findRecord(editing === null ? null : editing.recordId);
  const editingDetail = findRecordDetail(editingRecord);

  const handleRecordClick = (id: string) => {
    const record = MOCK_RECORDS.find((r) => r.id === id);
    if (record === undefined) return;
    setSelectedRecordId(id);
    setResultSegment(record.type === "pre" ? "before" : "after");
    setResultOpen(true);
  };

  const handleEdit = (segment: TenkoSegmentKey) => {
    if (selectedRecordId === null) return;
    const recordId = selectedRecordId;
    setResultOpen(false);
    window.setTimeout(() => {
      setEditing({ recordId, segment });
      setEditOpen(true);
    }, 220);
  };

  const handleSaveEdit = (payload: TenkoEditPayload) => {
    if (editing === null) return;
    // TODO: 編集内容のサーバ送信
    console.log("save edit", editing.recordId, payload);
    setEditOpen(false);
    window.setTimeout(() => {
      setResultSegment(payload.segment);
      setResultOpen(true);
    }, 220);
  };

  return (
    <div className="bg-[#f7f7f5] flex flex-col min-h-screen w-full">
      <AdminAppBar
        title="点呼記録簿"
        notificationCount={3}
        userInitial="佐"
        onMenuClick={openDrawer}
      />

      <div className="flex flex-col gap-4 py-4 w-full">
        <div className="w-full max-w-[765px] mx-auto px-4">
          <div className="flex gap-2.5 items-start w-full">
            <RecordSummaryCard
              icon="🚨"
              label="法定超過"
              value={`${MOCK_SUMMARY.exceeded}名`}
              valueColor="text-[#e23b4a]"
            />
            <RecordSummaryCard
              icon="⚠"
              label="警告"
              value={`${MOCK_SUMMARY.warning}名`}
              valueColor="text-[#ec7e00]"
            />
            <RecordSummaryCard
              icon="📉"
              label="平均拘束"
              value={`${MOCK_SUMMARY.averageHours.toFixed(1)}h`}
              valueColor="text-[#0e0f0c]"
            />
          </div>
        </div>

        <div className="flex flex-col w-full">
          <MonthNav month={month} onChange={setMonth} />
          <Toolbar
            filterCount={filterCount}
            onFilterClick={() => setFilterSheetOpen(true)}
            onActionClick={() => setActionSheetOpen(true)}
          />
        </div>

        <div className="w-full max-w-[765px] mx-auto px-4 flex flex-col gap-3">
          <SearchResultCount count={filteredRecords.length} />
          <div className="flex flex-col gap-3 w-full">
            {filteredRecords.length === 0 ? (
              <div className="bg-white rounded-[14px] flex items-center justify-center px-4 py-10 w-full">
                <p className="text-[14px] text-[#868685]">
                  該当する記録がありません
                </p>
              </div>
            ) : (
              filteredRecords.map((record) => (
                <RecordCard
                  key={record.id}
                  type={record.type}
                  driverName={record.driverName}
                  date={record.date}
                  affiliation={record.affiliation}
                  carrier={record.carrier}
                  method={record.method}
                  alcoholValue={record.alcoholValue}
                  drinking={record.drinking}
                  onClick={() => handleRecordClick(record.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <BottomSheet
        open={resultOpen}
        onClose={() => setResultOpen(false)}
        title={`点呼結果：${resultSegment === "before" ? "乗務前" : "乗務後"}`}
        subtitle={buildRecordSubtitle(selectedRecord)}
      >
        {selectedRecord !== null && selectedDetail !== null ? (
          <TenkoResultSheet
            key={`${selectedRecord.id}-${resultSegment}`}
            before={selectedDetail.before}
            after={selectedDetail.after}
            editLogs={selectedDetail.editLogs}
            initialSegment={resultSegment}
            onClose={() => setResultOpen(false)}
            onEdit={handleEdit}
          />
        ) : null}
      </BottomSheet>

      <BottomSheet
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="点呼結果を編集"
        subtitle={buildRecordSubtitle(editingRecord)}
      >
        {editing !== null && editingDetail !== null ? (
          <TenkoEditSheet
            before={editingDetail.beforeEdit}
            after={editingDetail.afterEdit}
            initialSegment={editing.segment}
            onCancel={() => setEditOpen(false)}
            onSave={handleSaveEdit}
          />
        ) : null}
      </BottomSheet>

      <BottomSheet
        open={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        title="絞り込み"
      >
        <RecordsFilterSheet
          initialValue={filter}
          onApply={(next) => {
            setFilter(next);
            setFilterSheetOpen(false);
          }}
        />
      </BottomSheet>

      <BottomSheet
        open={actionSheetOpen}
        onClose={() => setActionSheetOpen(false)}
        title="点呼記録操作"
      >
        <RecordsActionSheet
          onCsvExport={() => {
            // TODO: CSV 出力（spec §5.5 M-013b 準拠）
            console.log("export csv");
            setActionSheetOpen(false);
          }}
        />
      </BottomSheet>
    </div>
  );
};
