"use client";

import { useState } from "react";

import { CheckCard } from "@/components/ui/CheckCard";
import { FormField } from "@/components/ui/FormField";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { SelectInput } from "@/components/ui/SelectInput";
import { TextArea } from "@/components/ui/TextArea";
import { TextInput } from "@/components/ui/TextInput";
import { TimePicker } from "@/components/ui/TimePicker";
import {
  ALL_INSPECTION_KEYS,
  VehicleInspectionPanel,
  type InspectionKey,
  type InspectionResult,
} from "@/features/tenko/components/VehicleInspectionPanel";
import type { TenkoSegmentKey } from "@/features/tenko/components/TenkoResultSheet";

export type MethodChoice = "facetoface" | "other" | "";
export type YesNoChoice = "yes" | "no" | "";
export type CheckResultChoice = "normal" | "abnormal" | "";
export type AlcoholUsedChoice = "used" | "not_used" | "";
export type ReportPresenceChoice = "none" | "other" | "";

export type TenkoBeforeEditValue = {
  time: string;
  inspector: string;
  method: MethodChoice;
  methodNote: string;
  licenseConfirmed: boolean;
  health: YesNoChoice;
  vehicleCheck: CheckResultChoice;
  inspectionResult: InspectionResult;
  alcoholUsed: AlcoholUsedChoice;
  alcoholStatus: CheckResultChoice;
  alcoholValue: string;
  startOdo: string;
  vehicleId: string;
  message: string;
};

export type TenkoAfterEditValue = {
  time: string;
  inspector: string;
  method: MethodChoice;
  methodNote: string;
  alcoholUsed: AlcoholUsedChoice;
  alcoholStatus: CheckResultChoice;
  alcoholValue: string;
  endOdo: string;
  statusReport: ReportPresenceChoice;
  statusReportNote: string;
  handover: ReportPresenceChoice;
  handoverNote: string;
  restLocation: string;
  vehicleId: string;
  message: string;
};

export type TenkoEditPayload = {
  segment: TenkoSegmentKey;
  before: TenkoBeforeEditValue;
  after: TenkoAfterEditValue;
  reason: string;
};

const METHOD_OPTIONS = [
  { value: "facetoface" as const, label: "対面" },
  { value: "other" as const, label: "その他" },
];

const YESNO_OPTIONS = [
  { value: "yes" as const, label: "はい" },
  { value: "no" as const, label: "いいえ" },
];

const CHECK_RESULT_OPTIONS = [
  { value: "normal" as const, label: "異常なし" },
  { value: "abnormal" as const, label: "異常あり" },
];

const ALCOHOL_USED_OPTIONS = [
  { value: "used" as const, label: "使用した" },
  { value: "not_used" as const, label: "使用していない" },
];

const REPORT_PRESENCE_OPTIONS = [
  { value: "none" as const, label: "特になし" },
  { value: "other" as const, label: "その他" },
];

const REST_LOCATION_OPTIONS = [
  { value: "rest-1", label: "○○PA" },
  { value: "rest-2", label: "○○SA" },
  { value: "rest-other", label: "その他" },
];

const VEHICLE_OPTIONS = [
  { value: "vehicle-1", label: "品川 500 あ 1234" },
  { value: "vehicle-2", label: "品川 500 い 5678" },
];

const TIME_PATTERN = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;
const ALCOHOL_VALUE_PATTERN = /^\d(\.\d{1,2})?$/;
const ODOMETER_PATTERN = /^\d+$/;

const SELECT_REQUIRED = "選択してください";

const validateTime = (value: string): string | null => {
  const trimmed = value.trim();
  if (trimmed === "") return "実施時刻を入力してください";
  if (!TIME_PATTERN.test(trimmed)) return "HH:mm 形式で入力してください";
  return null;
};

const validateMethodChoice = (
  method: MethodChoice,
  note: string,
): string | null => {
  if (method === "") return SELECT_REQUIRED;
  if (method === "other" && note.trim() === "") {
    return "点呼方法を入力してください";
  }
  return null;
};

const validateAlcoholValue = (value: string): string | null => {
  const trimmed = value.trim();
  if (trimmed === "") return "検知数値を入力してください";
  if (!ALCOHOL_VALUE_PATTERN.test(trimmed)) {
    return "0.00〜9.99 の形式で入力してください";
  }
  return null;
};

const validateOdometerValue = (value: string): string | null => {
  const trimmed = value.trim();
  if (trimmed === "") return "数値を入力してください";
  if (!ODOMETER_PATTERN.test(trimmed)) return "整数のみ入力してください";
  return null;
};

const validateReportPresence = (
  presence: ReportPresenceChoice,
  note: string,
  noteLabel: string,
): string | null => {
  if (presence === "") return SELECT_REQUIRED;
  if (presence === "other" && note.trim() === "") {
    return `${noteLabel}を入力してください`;
  }
  return null;
};

type BeforeErrors = Partial<{
  time: string;
  method: string;
  license: string;
  health: string;
  vehicleCheck: string;
  alcoholUsed: string;
  alcoholStatus: string;
  alcoholValue: string;
  startOdo: string;
  vehicleId: string;
}>;

type AfterErrors = Partial<{
  time: string;
  method: string;
  alcoholUsed: string;
  alcoholStatus: string;
  alcoholValue: string;
  endOdo: string;
  statusReport: string;
  handover: string;
  restLocation: string;
  vehicleId: string;
}>;

const VALIDATORS_BEFORE: ReadonlyArray<{
  key: keyof BeforeErrors;
  validate: (v: TenkoBeforeEditValue) => string | null;
}> = [
  { key: "time", validate: (v) => validateTime(v.time) },
  {
    key: "method",
    validate: (v) => validateMethodChoice(v.method, v.methodNote),
  },
  {
    key: "license",
    validate: (v) =>
      v.licenseConfirmed ? null : "免許証の携帯を確認してください",
  },
  {
    key: "health",
    validate: (v) => (v.health === "" ? SELECT_REQUIRED : null),
  },
  {
    key: "vehicleCheck",
    validate: (v) => {
      if (v.vehicleCheck === "") return SELECT_REQUIRED;
      if (
        v.vehicleCheck === "abnormal" &&
        !ALL_INSPECTION_KEYS.every((k) => v.inspectionResult[k] !== undefined)
      ) {
        return "すべての点検項目を選択してください";
      }
      return null;
    },
  },
  {
    key: "alcoholUsed",
    validate: (v) => (v.alcoholUsed === "" ? SELECT_REQUIRED : null),
  },
  {
    key: "alcoholStatus",
    validate: (v) => (v.alcoholStatus === "" ? SELECT_REQUIRED : null),
  },
  {
    key: "alcoholValue",
    validate: (v) => validateAlcoholValue(v.alcoholValue),
  },
  { key: "startOdo", validate: (v) => validateOdometerValue(v.startOdo) },
  {
    key: "vehicleId",
    validate: (v) => (v.vehicleId === "" ? "車両を選択してください" : null),
  },
];

const VALIDATORS_AFTER: ReadonlyArray<{
  key: keyof AfterErrors;
  validate: (v: TenkoAfterEditValue) => string | null;
}> = [
  { key: "time", validate: (v) => validateTime(v.time) },
  {
    key: "method",
    validate: (v) => validateMethodChoice(v.method, v.methodNote),
  },
  {
    key: "alcoholUsed",
    validate: (v) => (v.alcoholUsed === "" ? SELECT_REQUIRED : null),
  },
  {
    key: "alcoholStatus",
    validate: (v) => (v.alcoholStatus === "" ? SELECT_REQUIRED : null),
  },
  {
    key: "alcoholValue",
    validate: (v) => validateAlcoholValue(v.alcoholValue),
  },
  { key: "endOdo", validate: (v) => validateOdometerValue(v.endOdo) },
  {
    key: "statusReport",
    validate: (v) =>
      validateReportPresence(v.statusReport, v.statusReportNote, "報告事項"),
  },
  {
    key: "handover",
    validate: (v) =>
      validateReportPresence(v.handover, v.handoverNote, "通告内容"),
  },
  {
    key: "restLocation",
    validate: (v) =>
      v.restLocation === "" ? "休憩場所を選択してください" : null,
  },
  {
    key: "vehicleId",
    validate: (v) => (v.vehicleId === "" ? "車両を選択してください" : null),
  },
];

const validateBefore = (v: TenkoBeforeEditValue): BeforeErrors =>
  VALIDATORS_BEFORE.reduce<BeforeErrors>((acc, { key, validate }) => {
    const error = validate(v);
    return error === null ? acc : { ...acc, [key]: error };
  }, {});

const validateAfter = (v: TenkoAfterEditValue): AfterErrors =>
  VALIDATORS_AFTER.reduce<AfterErrors>((acc, { key, validate }) => {
    const error = validate(v);
    return error === null ? acc : { ...acc, [key]: error };
  }, {});

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

type DisabledFieldProps = {
  label: string;
  required?: boolean;
  value: string;
};

const DisabledField = ({ label, required, value }: DisabledFieldProps) => (
  <div className="flex flex-col gap-2 w-full">
    <span className="text-[14px] font-semibold text-[#868685] leading-none">
      {label}
      {required ? <span className="ml-0.5">*</span> : null}
    </span>
    <div className="bg-[#f7f7f5] border border-[#e8ebe6] rounded-[10px] px-4 py-[14px] flex items-center w-full">
      <span className="text-[14px] text-[#868685]">
        {value === "" ? "—" : value}
      </span>
    </div>
  </div>
);

type BeforeFormProps = {
  value: TenkoBeforeEditValue;
  errors: BeforeErrors;
  onUpdate: <K extends keyof TenkoBeforeEditValue>(
    key: K,
    next: TenkoBeforeEditValue[K],
  ) => void;
  onClearError: (key: keyof BeforeErrors) => void;
  onInspectionChange: (key: InspectionKey, next: TenkoBeforeEditValue) => void;
};

const BeforeForm = ({
  value,
  errors,
  onUpdate,
  onClearError,
  onInspectionChange,
}: BeforeFormProps) => (
  <div className="flex flex-col gap-6 w-full">
    <FormField label="実施時刻" required error={errors.time}>
      <TimePicker
        placeholder="08:00"
        value={value.time}
        onChange={(v) => {
          onUpdate("time", v);
          if (validateTime(v) === null) onClearError("time");
        }}
        error={errors.time !== undefined}
      />
    </FormField>

    <DisabledField label="点呼実施者" required value={value.inspector} />

    <FormField label="点呼方法" required error={errors.method}>
      <div className="flex flex-col gap-2.5 w-full">
        <SegmentedToggle
          value={value.method === "" ? null : value.method}
          onChange={(v) => {
            onUpdate("method", v);
            onUpdate("methodNote", "");
            onClearError("method");
          }}
          options={METHOD_OPTIONS}
          error={errors.method !== undefined && value.method === ""}
        />
        <p className="text-[12px] text-[#888986]">
          電話・Web・スマホアプリなど
        </p>
        {value.method === "other" ? (
          <TextInput
            placeholder="点呼方法を入力（電話、Web 会議など）"
            value={value.methodNote}
            onChange={(e) => onUpdate("methodNote", e.target.value)}
            error={errors.method !== undefined && value.method === "other"}
            maxLength={200}
          />
        ) : null}
      </div>
    </FormField>

    <FormField label="免許証の携帯確認" required error={errors.license}>
      <div className="flex flex-col gap-2.5 w-full">
        <p className="text-[12px] leading-[18px] text-[#888986]">
          運転する際、法律において免許は携帯を義務付けられています。今一度、業務開始前に免許証を携帯しているか確認して下さい。
        </p>
        <CheckCard
          checked={value.licenseConfirmed}
          onChange={(checked) => {
            onUpdate("licenseConfirmed", checked);
            if (checked) onClearError("license");
          }}
          error={errors.license !== undefined}
        >
          確かに携帯していることを確認した
        </CheckCard>
      </div>
    </FormField>

    <FormField label="体調・疲労状況" required error={errors.health}>
      <div className="flex flex-col gap-2.5 w-full">
        <p className="text-[12px] leading-[18px] text-[#888986]">
          業務に支障が無いか、正確に判断する必要があります。
        </p>
        <SegmentedToggle
          value={value.health === "" ? null : value.health}
          onChange={(v) => {
            onUpdate("health", v);
            onClearError("health");
          }}
          options={YESNO_OPTIONS}
          error={errors.health !== undefined}
        />
      </div>
    </FormField>

    <FormField
      label="車両点検の実施と状況報告"
      required
      error={errors.vehicleCheck}
    >
      <div className="flex flex-col gap-2.5 w-full">
        <SegmentedToggle
          value={value.vehicleCheck === "" ? null : value.vehicleCheck}
          onChange={(v) => {
            onUpdate("vehicleCheck", v);
            onUpdate("inspectionResult", {});
            onClearError("vehicleCheck");
          }}
          options={CHECK_RESULT_OPTIONS}
          error={errors.vehicleCheck !== undefined && value.vehicleCheck === ""}
        />
        {value.vehicleCheck === "abnormal" ? (
          <VehicleInspectionPanel
            value={value.inspectionResult}
            onChange={(key, result) => {
              const next: TenkoBeforeEditValue = {
                ...value,
                inspectionResult: { ...value.inspectionResult, [key]: result },
              };
              onInspectionChange(key, next);
            }}
            errorOnUnselected={errors.vehicleCheck !== undefined}
          />
        ) : null}
      </div>
    </FormField>

    <FormField
      label="アルコール検知器の使用有無"
      required
      error={errors.alcoholUsed}
    >
      <SegmentedToggle
        value={value.alcoholUsed === "" ? null : value.alcoholUsed}
        onChange={(v) => {
          onUpdate("alcoholUsed", v);
          onClearError("alcoholUsed");
        }}
        options={ALCOHOL_USED_OPTIONS}
        error={errors.alcoholUsed !== undefined}
      />
    </FormField>

    <FormField label="酒気帯びの有無" required error={errors.alcoholStatus}>
      <div className="flex flex-col gap-2.5 w-full">
        <p className="text-[12px] leading-[18px] text-[#888986]">
          酒気数値を入力してください
        </p>
        <SegmentedToggle
          value={value.alcoholStatus === "" ? null : value.alcoholStatus}
          onChange={(v) => {
            onUpdate("alcoholStatus", v);
            onClearError("alcoholStatus");
          }}
          options={CHECK_RESULT_OPTIONS}
          error={errors.alcoholStatus !== undefined}
        />
      </div>
    </FormField>

    <FormField label="検知数値" required error={errors.alcoholValue}>
      <div className="flex flex-col gap-2 w-full">
        <p className="text-[12px] text-[#888986]">検知数値（mg/L）</p>
        <TextInput
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={value.alcoholValue}
          onChange={(e) => onUpdate("alcoholValue", e.target.value)}
          onBlur={() => {
            if (validateAlcoholValue(value.alcoholValue) === null) {
              onClearError("alcoholValue");
            }
          }}
          error={errors.alcoholValue !== undefined}
          maxLength={4}
        />
      </div>
    </FormField>

    <FormField label="開始ODOメーター" required error={errors.startOdo}>
      <TextInput
        type="text"
        inputMode="numeric"
        placeholder="数値を入力"
        value={value.startOdo}
        onChange={(e) => onUpdate("startOdo", e.target.value)}
        onBlur={() => {
          if (validateOdometerValue(value.startOdo) === null) {
            onClearError("startOdo");
          }
        }}
        error={errors.startOdo !== undefined}
        maxLength={7}
      />
    </FormField>

    <FormField label="車両選択" required error={errors.vehicleId}>
      <SelectInput
        placeholder="車両を選択"
        value={value.vehicleId}
        onChange={(v) => {
          onUpdate("vehicleId", v);
          if (v !== "") onClearError("vehicleId");
        }}
        options={VEHICLE_OPTIONS}
        error={errors.vehicleId !== undefined}
      />
    </FormField>

    <FormField label="伝達事項">
      <TextArea
        className="min-h-[100px]"
        placeholder="伝達事項を入力"
        value={value.message}
        onChange={(e) => onUpdate("message", e.target.value)}
        maxLength={500}
      />
    </FormField>
  </div>
);

type AfterFormProps = {
  value: TenkoAfterEditValue;
  errors: AfterErrors;
  onUpdate: <K extends keyof TenkoAfterEditValue>(
    key: K,
    next: TenkoAfterEditValue[K],
  ) => void;
  onClearError: (key: keyof AfterErrors) => void;
};

const AfterForm = ({
  value,
  errors,
  onUpdate,
  onClearError,
}: AfterFormProps) => (
  <div className="flex flex-col gap-6 w-full">
    <FormField label="実施時刻" required error={errors.time}>
      <TimePicker
        placeholder="18:00"
        value={value.time}
        onChange={(v) => {
          onUpdate("time", v);
          if (validateTime(v) === null) onClearError("time");
        }}
        error={errors.time !== undefined}
      />
    </FormField>

    <DisabledField label="点呼実施者" required value={value.inspector} />

    <FormField label="点呼方法" required error={errors.method}>
      <div className="flex flex-col gap-2.5 w-full">
        <SegmentedToggle
          value={value.method === "" ? null : value.method}
          onChange={(v) => {
            onUpdate("method", v);
            onUpdate("methodNote", "");
            onClearError("method");
          }}
          options={METHOD_OPTIONS}
          error={errors.method !== undefined && value.method === ""}
        />
        <p className="text-[12px] text-[#888986]">
          電話・Web・スマホアプリなど
        </p>
        {value.method === "other" ? (
          <TextInput
            placeholder="点呼方法を入力（電話、Web 会議など）"
            value={value.methodNote}
            onChange={(e) => onUpdate("methodNote", e.target.value)}
            error={errors.method !== undefined && value.method === "other"}
            maxLength={200}
          />
        ) : null}
      </div>
    </FormField>

    <FormField
      label="アルコール検知器の使用有無"
      required
      error={errors.alcoholUsed}
    >
      <SegmentedToggle
        value={value.alcoholUsed === "" ? null : value.alcoholUsed}
        onChange={(v) => {
          onUpdate("alcoholUsed", v);
          onClearError("alcoholUsed");
        }}
        options={ALCOHOL_USED_OPTIONS}
        error={errors.alcoholUsed !== undefined}
      />
    </FormField>

    <FormField label="酒気帯びの有無" required error={errors.alcoholStatus}>
      <SegmentedToggle
        value={value.alcoholStatus === "" ? null : value.alcoholStatus}
        onChange={(v) => {
          onUpdate("alcoholStatus", v);
          onClearError("alcoholStatus");
        }}
        options={CHECK_RESULT_OPTIONS}
        error={errors.alcoholStatus !== undefined}
      />
    </FormField>

    <FormField label="検知数値" required error={errors.alcoholValue}>
      <div className="flex flex-col gap-2 w-full">
        <p className="text-[12px] text-[#888986]">検知数値（mg/L）</p>
        <TextInput
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={value.alcoholValue}
          onChange={(e) => onUpdate("alcoholValue", e.target.value)}
          onBlur={() => {
            if (validateAlcoholValue(value.alcoholValue) === null) {
              onClearError("alcoholValue");
            }
          }}
          error={errors.alcoholValue !== undefined}
          maxLength={4}
        />
      </div>
    </FormField>

    <FormField label="終了時ODOメーター" required error={errors.endOdo}>
      <TextInput
        type="text"
        inputMode="numeric"
        placeholder="数値を入力"
        value={value.endOdo}
        onChange={(e) => onUpdate("endOdo", e.target.value)}
        onBlur={() => {
          if (validateOdometerValue(value.endOdo) === null) {
            onClearError("endOdo");
          }
        }}
        error={errors.endOdo !== undefined}
        maxLength={7}
      />
    </FormField>

    <FormField
      label="自動車・道路及び運行の状況について報告事項がありますか？"
      required
      error={errors.statusReport}
    >
      <div className="flex flex-col gap-2.5 w-full">
        <SegmentedToggle
          value={value.statusReport === "" ? null : value.statusReport}
          onChange={(v) => {
            onUpdate("statusReport", v);
            onUpdate("statusReportNote", "");
            onClearError("statusReport");
          }}
          options={REPORT_PRESENCE_OPTIONS}
          error={errors.statusReport !== undefined && value.statusReport === ""}
        />
        {value.statusReport === "other" ? (
          <TextArea
            className="min-h-[100px]"
            placeholder="報告事項を入力してください"
            value={value.statusReportNote}
            onChange={(e) => onUpdate("statusReportNote", e.target.value)}
            error={
              errors.statusReport !== undefined &&
              value.statusReport === "other"
            }
            maxLength={500}
          />
        ) : null}
      </div>
    </FormField>

    <FormField
      label="交替運転者に対する通告はありますか？"
      required
      error={errors.handover}
    >
      <div className="flex flex-col gap-2.5 w-full">
        <SegmentedToggle
          value={value.handover === "" ? null : value.handover}
          onChange={(v) => {
            onUpdate("handover", v);
            onUpdate("handoverNote", "");
            onClearError("handover");
          }}
          options={REPORT_PRESENCE_OPTIONS}
          error={errors.handover !== undefined && value.handover === ""}
        />
        {value.handover === "other" ? (
          <TextArea
            className="min-h-[100px]"
            placeholder="通告内容を入力してください"
            value={value.handoverNote}
            onChange={(e) => onUpdate("handoverNote", e.target.value)}
            error={errors.handover !== undefined && value.handover === "other"}
            maxLength={500}
          />
        ) : null}
      </div>
    </FormField>

    <FormField label="休憩場所" required error={errors.restLocation}>
      <SelectInput
        placeholder="休憩場所を選択"
        value={value.restLocation}
        onChange={(v) => {
          onUpdate("restLocation", v);
          if (v !== "") onClearError("restLocation");
        }}
        options={REST_LOCATION_OPTIONS}
        error={errors.restLocation !== undefined}
      />
    </FormField>

    <FormField label="車両選択" required error={errors.vehicleId}>
      <SelectInput
        placeholder="車両を選択"
        value={value.vehicleId}
        onChange={(v) => {
          onUpdate("vehicleId", v);
          if (v !== "") onClearError("vehicleId");
        }}
        options={VEHICLE_OPTIONS}
        error={errors.vehicleId !== undefined}
      />
    </FormField>

    <FormField label="伝達事項">
      <TextArea
        className="min-h-[100px]"
        placeholder="伝達事項を入力"
        value={value.message}
        onChange={(e) => onUpdate("message", e.target.value)}
        maxLength={500}
      />
    </FormField>
  </div>
);

type Props = {
  before: TenkoBeforeEditValue;
  after: TenkoAfterEditValue;
  initialSegment?: TenkoSegmentKey;
  onCancel: () => void;
  onSave: (payload: TenkoEditPayload) => void;
};

export const TenkoEditSheet = ({
  before: initialBefore,
  after: initialAfter,
  initialSegment = "before",
  onCancel,
  onSave,
}: Props) => {
  const [segment, setSegment] = useState<TenkoSegmentKey>(initialSegment);
  const [before, setBefore] = useState<TenkoBeforeEditValue>(initialBefore);
  const [after, setAfter] = useState<TenkoAfterEditValue>(initialAfter);
  const [reason, setReason] = useState("");
  const [beforeErrors, setBeforeErrors] = useState<BeforeErrors>({});
  const [afterErrors, setAfterErrors] = useState<AfterErrors>({});
  const [reasonError, setReasonError] = useState<string | null>(null);

  const updateBefore = <K extends keyof TenkoBeforeEditValue>(
    key: K,
    next: TenkoBeforeEditValue[K],
  ) => {
    setBefore((prev) => ({ ...prev, [key]: next }));
  };

  const updateAfter = <K extends keyof TenkoAfterEditValue>(
    key: K,
    next: TenkoAfterEditValue[K],
  ) => {
    setAfter((prev) => ({ ...prev, [key]: next }));
  };

  const clearBeforeError = (key: keyof BeforeErrors) => {
    setBeforeErrors((prev) => {
      if (prev[key] === undefined) return prev;
      const cleared = { ...prev };
      delete cleared[key];
      return cleared;
    });
  };

  const clearAfterError = (key: keyof AfterErrors) => {
    setAfterErrors((prev) => {
      if (prev[key] === undefined) return prev;
      const cleared = { ...prev };
      delete cleared[key];
      return cleared;
    });
  };

  const handleInspectionChange = (
    _key: InspectionKey,
    next: TenkoBeforeEditValue,
  ) => {
    setBefore(next);
    if (
      next.vehicleCheck === "abnormal" &&
      ALL_INSPECTION_KEYS.every((k) => next.inspectionResult[k] !== undefined)
    ) {
      clearBeforeError("vehicleCheck");
    }
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
    if (reasonError !== null) setReasonError(null);
  };

  const handleSave = () => {
    const beforeErr = validateBefore(before);
    const afterErr = validateAfter(after);
    const reasonErr =
      reason.trim() === "" ? "編集理由を入力してください" : null;

    const hasBeforeError = Object.keys(beforeErr).length > 0;
    const hasAfterError = Object.keys(afterErr).length > 0;

    if (hasBeforeError || hasAfterError || reasonErr !== null) {
      setBeforeErrors(beforeErr);
      setAfterErrors(afterErr);
      setReasonError(reasonErr);
      if (hasBeforeError && segment !== "before") setSegment("before");
      else if (hasAfterError && segment !== "after") setSegment("after");
      return;
    }

    onSave({ segment, before, after, reason });
  };

  return (
    <div className="flex flex-col gap-5 w-full">
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

      {segment === "before" ? (
        <BeforeForm
          value={before}
          errors={beforeErrors}
          onUpdate={updateBefore}
          onClearError={clearBeforeError}
          onInspectionChange={handleInspectionChange}
        />
      ) : (
        <AfterForm
          value={after}
          errors={afterErrors}
          onUpdate={updateAfter}
          onClearError={clearAfterError}
        />
      )}

      <FormField label="編集理由" required error={reasonError ?? undefined}>
        <TextArea
          value={reason}
          onChange={handleReasonChange}
          placeholder="編集理由を入力してください"
          error={reasonError !== null}
          maxLength={500}
        />
      </FormField>

      <div className="flex gap-3 pt-2 w-full">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-white border border-[#e8ebe6] rounded-full px-6 py-3.5 text-[14px] font-semibold text-[#868685] cursor-pointer hover:bg-[#f7f7f5] transition-colors"
        >
          キャンセル
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 bg-[#9fe870] rounded-full px-6 py-3.5 text-[14px] font-semibold text-[#163300] cursor-pointer hover:bg-[#8edc5e] transition-colors"
        >
          保存
        </button>
      </div>
    </div>
  );
};
