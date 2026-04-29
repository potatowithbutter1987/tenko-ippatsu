"use client";

import { useState } from "react";

import { FormField } from "@/components/ui/FormField";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { SelectInput } from "@/components/ui/SelectInput";
import { TextArea } from "@/components/ui/TextArea";
import { TextInput } from "@/components/ui/TextInput";

type InspectorType = "self" | "other";
type InspectionMethod = "facetoface" | "other";
type AlcoholUsed = "used" | "not_used";
type CheckResult = "normal" | "abnormal";
type ReportPresence = "none" | "other";

const INSPECTOR_OPTIONS = [
  { value: "self" as const, label: "自分" },
  { value: "other" as const, label: "その他" },
];

const METHOD_OPTIONS = [
  { value: "facetoface" as const, label: "対面" },
  { value: "other" as const, label: "その他" },
];

const ALCOHOL_USED_OPTIONS = [
  { value: "used" as const, label: "使用した" },
  { value: "not_used" as const, label: "使用していない" },
];

const CHECK_RESULT_OPTIONS = [
  { value: "normal" as const, label: "異常なし" },
  { value: "abnormal" as const, label: "異常あり" },
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

type FormState = {
  inspectorType: InspectorType | null;
  inspectorName: string;
  inspectionMethod: InspectionMethod | null;
  inspectionMethodNote: string;
  alcoholUsed: AlcoholUsed | null;
  alcoholStatus: CheckResult | null;
  alcoholValue: string;
  endOdometer: string;
  statusReport: ReportPresence | null;
  statusReportNote: string;
  handover: ReportPresence | null;
  handoverNote: string;
  restLocation: string;
  vehicleId: string;
};

type Errors = Partial<{
  inspector: string;
  method: string;
  alcoholUsed: string;
  alcoholStatus: string;
  alcoholValue: string;
  endOdometer: string;
  statusReport: string;
  handover: string;
  restLocation: string;
  vehicleId: string;
}>;

const SELECT_REQUIRED = "選択してください";
const ALCOHOL_VALUE_PATTERN = /^\d(\.\d{1,2})?$/;
const ODOMETER_PATTERN = /^\d+$/;

const validateInspector = (
  type: InspectorType | null,
  name: string,
): string | null => {
  if (type === null) return SELECT_REQUIRED;
  if (type === "other" && name.trim() === "") {
    return "実施者名を入力してください";
  }
  return null;
};

const validateMethod = (
  method: InspectionMethod | null,
  note: string,
): string | null => {
  if (method === null) return SELECT_REQUIRED;
  if (method === "other" && note.trim() === "") {
    return "点呼方法を入力してください";
  }
  return null;
};

const validateAlcoholUsed = (s: FormState): string | null =>
  s.alcoholUsed === null ? SELECT_REQUIRED : null;

const validateAlcoholStatus = (s: FormState): string | null =>
  s.alcoholStatus === null ? SELECT_REQUIRED : null;

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

const validateEndOdometer = (s: FormState): string | null =>
  validateOdometerValue(s.endOdometer);

const validateStatusReport = (
  presence: ReportPresence | null,
  note: string,
): string | null => {
  if (presence === null) return SELECT_REQUIRED;
  if (presence === "other" && note.trim() === "") {
    return "報告事項を入力してください";
  }
  return null;
};

const validateHandover = (
  presence: ReportPresence | null,
  note: string,
): string | null => {
  if (presence === null) return SELECT_REQUIRED;
  if (presence === "other" && note.trim() === "") {
    return "通告内容を入力してください";
  }
  return null;
};

const validateRestLocation = (s: FormState): string | null =>
  s.restLocation === "" ? "休憩場所を選択してください" : null;

const validateVehicleId = (s: FormState): string | null =>
  s.vehicleId === "" ? "車両を選択してください" : null;

const VALIDATORS: ReadonlyArray<{
  key: keyof Errors;
  validate: (s: FormState) => string | null;
}> = [
  {
    key: "inspector",
    validate: (s) => validateInspector(s.inspectorType, s.inspectorName),
  },
  {
    key: "method",
    validate: (s) => validateMethod(s.inspectionMethod, s.inspectionMethodNote),
  },
  { key: "alcoholUsed", validate: validateAlcoholUsed },
  { key: "alcoholStatus", validate: validateAlcoholStatus },
  {
    key: "alcoholValue",
    validate: (s) => validateAlcoholValue(s.alcoholValue),
  },
  { key: "endOdometer", validate: validateEndOdometer },
  {
    key: "statusReport",
    validate: (s) => validateStatusReport(s.statusReport, s.statusReportNote),
  },
  {
    key: "handover",
    validate: (s) => validateHandover(s.handover, s.handoverNote),
  },
  { key: "restLocation", validate: validateRestLocation },
  { key: "vehicleId", validate: validateVehicleId },
];

const validateForm = (s: FormState): Errors =>
  VALIDATORS.reduce<Errors>((acc, { key, validate }) => {
    const error = validate(s);
    return error === null ? acc : { ...acc, [key]: error };
  }, {});

const showError = (
  errorMessage: string | undefined,
  isApplicable: boolean,
): boolean => errorMessage !== undefined && isApplicable;

export const EndTenkoForm = () => {
  const [inspectorType, setInspectorType] = useState<InspectorType | null>(
    null,
  );
  const [inspectorName, setInspectorName] = useState("");

  const [inspectionMethod, setInspectionMethod] =
    useState<InspectionMethod | null>(null);
  const [inspectionMethodNote, setInspectionMethodNote] = useState("");

  const [alcoholUsed, setAlcoholUsed] = useState<AlcoholUsed | null>(null);

  const [alcoholStatus, setAlcoholStatus] = useState<CheckResult | null>(null);
  const [alcoholValue, setAlcoholValue] = useState("");

  const [endOdometer, setEndOdometer] = useState("");

  const [statusReport, setStatusReport] = useState<ReportPresence | null>(null);
  const [statusReportNote, setStatusReportNote] = useState("");

  const [handover, setHandover] = useState<ReportPresence | null>(null);
  const [handoverNote, setHandoverNote] = useState("");

  const [restLocation, setRestLocation] = useState("");

  const [vehicleId, setVehicleId] = useState("");

  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<Errors>({});

  const clearError = (key: keyof Errors) => {
    setErrors((prev) => {
      if (prev[key] === undefined) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const updateError = (key: keyof Errors, validator: () => string | null) => {
    setErrors((prev) => {
      const error = validator();
      const next = { ...prev };
      if (error === null) {
        delete next[key];
      } else {
        next[key] = error;
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formState: FormState = {
      inspectorType,
      inspectorName,
      inspectionMethod,
      inspectionMethodNote,
      alcoholUsed,
      alcoholStatus,
      alcoholValue,
      endOdometer,
      statusReport,
      statusReportNote,
      handover,
      handoverNote,
      restLocation,
      vehicleId,
    };

    const nextErrors = validateForm(formState);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    // TODO: API 送信
    console.log("submit end tenko", {
      ...formState,
      inspectorName: inspectorType === "other" ? inspectorName : null,
      inspectionMethodNote:
        inspectionMethod === "other" ? inspectionMethodNote : null,
      statusReportNote: statusReport === "other" ? statusReportNote : null,
      handoverNote: handover === "other" ? handoverNote : null,
      message,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-7 p-6 w-full"
      noValidate
    >
      <FormField label="点呼実施者" required error={errors.inspector}>
        <div className="flex flex-col gap-[10px] w-full">
          <SegmentedToggle
            value={inspectorType}
            onChange={(v) => {
              setInspectorType(v);
              setInspectorName("");
              clearError("inspector");
            }}
            options={INSPECTOR_OPTIONS}
            error={showError(errors.inspector, inspectorType === null)}
          />
          {inspectorType === "other" ? (
            <TextInput
              placeholder="実施者名を入力"
              value={inspectorName}
              onChange={(e) => setInspectorName(e.target.value)}
              onBlur={() =>
                updateError("inspector", () =>
                  validateInspector(inspectorType, inspectorName),
                )
              }
              error={showError(errors.inspector, inspectorType === "other")}
              maxLength={50}
            />
          ) : null}
        </div>
      </FormField>

      <FormField label="点呼方法" required error={errors.method}>
        <div className="flex flex-col gap-[10px] w-full">
          <SegmentedToggle
            value={inspectionMethod}
            onChange={(v) => {
              setInspectionMethod(v);
              setInspectionMethodNote("");
              clearError("method");
            }}
            options={METHOD_OPTIONS}
            error={showError(errors.method, inspectionMethod === null)}
          />
          <p className="text-[12px] text-[#888986]">
            電話・Web・スマホアプリなど
          </p>
          {inspectionMethod === "other" ? (
            <TextInput
              placeholder="点呼方法を入力（電話、Web 会議など）"
              value={inspectionMethodNote}
              onChange={(e) => setInspectionMethodNote(e.target.value)}
              onBlur={() =>
                updateError("method", () =>
                  validateMethod(inspectionMethod, inspectionMethodNote),
                )
              }
              error={showError(errors.method, inspectionMethod === "other")}
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
          value={alcoholUsed}
          onChange={(v) => {
            setAlcoholUsed(v);
            clearError("alcoholUsed");
          }}
          options={ALCOHOL_USED_OPTIONS}
          error={Boolean(errors.alcoholUsed)}
        />
      </FormField>

      <FormField label="酒気帯びの有無" required error={errors.alcoholStatus}>
        <SegmentedToggle
          value={alcoholStatus}
          onChange={(v) => {
            setAlcoholStatus(v);
            clearError("alcoholStatus");
          }}
          options={CHECK_RESULT_OPTIONS}
          error={Boolean(errors.alcoholStatus)}
        />
      </FormField>

      <FormField label="検知数値" required error={errors.alcoholValue}>
        <div className="flex flex-col gap-2 w-full">
          <p className="text-[12px] text-[#888986]">検知数値（mg/L）</p>
          <TextInput
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={alcoholValue}
            onChange={(e) => setAlcoholValue(e.target.value)}
            onBlur={() =>
              updateError("alcoholValue", () =>
                validateAlcoholValue(alcoholValue),
              )
            }
            error={Boolean(errors.alcoholValue)}
            maxLength={4}
          />
        </div>
      </FormField>

      <FormField label="終了時ODOメーター" required error={errors.endOdometer}>
        <TextInput
          type="text"
          inputMode="numeric"
          placeholder="数値を入力"
          value={endOdometer}
          onChange={(e) => setEndOdometer(e.target.value)}
          onBlur={() =>
            updateError("endOdometer", () => validateOdometerValue(endOdometer))
          }
          error={Boolean(errors.endOdometer)}
          maxLength={7}
        />
      </FormField>

      <FormField
        label="自動車・道路及び運行の状況について報告事項がありますか？"
        required
        error={errors.statusReport}
      >
        <div className="flex flex-col gap-[10px] w-full">
          <SegmentedToggle
            value={statusReport}
            onChange={(v) => {
              setStatusReport(v);
              setStatusReportNote("");
              clearError("statusReport");
            }}
            options={REPORT_PRESENCE_OPTIONS}
            error={showError(errors.statusReport, statusReport === null)}
          />
          {statusReport === "other" ? (
            <TextArea
              className="min-h-[100px]"
              placeholder="報告事項を入力してください"
              value={statusReportNote}
              onChange={(e) => setStatusReportNote(e.target.value)}
              onBlur={() =>
                updateError("statusReport", () =>
                  validateStatusReport(statusReport, statusReportNote),
                )
              }
              error={showError(errors.statusReport, statusReport === "other")}
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
        <div className="flex flex-col gap-[10px] w-full">
          <SegmentedToggle
            value={handover}
            onChange={(v) => {
              setHandover(v);
              setHandoverNote("");
              clearError("handover");
            }}
            options={REPORT_PRESENCE_OPTIONS}
            error={showError(errors.handover, handover === null)}
          />
          {handover === "other" ? (
            <TextArea
              className="min-h-[100px]"
              placeholder="通告内容を入力してください"
              value={handoverNote}
              onChange={(e) => setHandoverNote(e.target.value)}
              onBlur={() =>
                updateError("handover", () =>
                  validateHandover(handover, handoverNote),
                )
              }
              error={showError(errors.handover, handover === "other")}
              maxLength={500}
            />
          ) : null}
        </div>
      </FormField>

      <FormField label="休憩場所" required error={errors.restLocation}>
        <SelectInput
          placeholder="休憩場所を選択"
          value={restLocation}
          onChange={(v) => {
            setRestLocation(v);
            if (v !== "") clearError("restLocation");
          }}
          options={REST_LOCATION_OPTIONS}
          error={Boolean(errors.restLocation)}
        />
      </FormField>

      <FormField label="車両選択" required error={errors.vehicleId}>
        <SelectInput
          placeholder="車両を選択"
          value={vehicleId}
          onChange={(v) => {
            setVehicleId(v);
            if (v !== "") clearError("vehicleId");
          }}
          options={VEHICLE_OPTIONS}
          error={Boolean(errors.vehicleId)}
        />
      </FormField>

      <FormField label="伝達事項があれば入力してください。">
        <TextArea
          className="min-h-[120px]"
          placeholder="伝達事項を入力"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={500}
        />
      </FormField>

      <div className="flex flex-col items-center pt-4 pb-10 w-full">
        <PrimaryButton type="submit">点呼を送信する</PrimaryButton>
      </div>
    </form>
  );
};
