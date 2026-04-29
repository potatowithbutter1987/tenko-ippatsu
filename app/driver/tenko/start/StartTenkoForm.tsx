"use client";

import { useState } from "react";

import { CheckCard } from "@/components/ui/CheckCard";
import { FormField } from "@/components/ui/FormField";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { SelectInput } from "@/components/ui/SelectInput";
import { TextArea } from "@/components/ui/TextArea";
import { TextInput } from "@/components/ui/TextInput";
import type { InspectionResultValue } from "@/features/tenko/components/InspectionItem";
import {
  ALL_INSPECTION_KEYS,
  VehicleInspectionPanel,
  type InspectionKey,
  type InspectionResult,
} from "@/features/tenko/components/VehicleInspectionPanel";

type InspectorType = "self" | "other";
type InspectionMethod = "facetoface" | "other";
type YesNo = "yes" | "no";
type CheckResult = "normal" | "abnormal";
type AlcoholUsed = "used" | "not_used";

const INSPECTOR_OPTIONS = [
  { value: "self" as const, label: "自分" },
  { value: "other" as const, label: "その他" },
];

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

const VEHICLE_OPTIONS = [
  { value: "vehicle-1", label: "品川 500 あ 1234" },
  { value: "vehicle-2", label: "品川 500 い 5678" },
];

type FormState = {
  inspectorType: InspectorType | null;
  inspectorName: string;
  inspectionMethod: InspectionMethod | null;
  inspectionMethodNote: string;
  licenseConfirmed: boolean;
  healthOk: YesNo | null;
  vehicleCheck: CheckResult | null;
  inspectionResult: InspectionResult;
  alcoholUsed: AlcoholUsed | null;
  alcoholStatus: CheckResult | null;
  alcoholValue: string;
  odometer: string;
  vehicleId: string;
};

type Errors = Partial<{
  inspector: string;
  method: string;
  license: string;
  health: string;
  vehicleCheck: string;
  alcoholUsed: string;
  alcoholStatus: string;
  alcoholValue: string;
  odometer: string;
  vehicleId: string;
}>;

const SELECT_REQUIRED = "選択してください";

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

const validateLicense = (s: FormState): string | null =>
  s.licenseConfirmed ? null : "免許証の携帯を確認してください";

const validateHealth = (s: FormState): string | null =>
  s.healthOk === null ? SELECT_REQUIRED : null;

const validateVehicleCheck = (s: FormState): string | null => {
  if (s.vehicleCheck === null) return SELECT_REQUIRED;
  if (
    s.vehicleCheck === "abnormal" &&
    !ALL_INSPECTION_KEYS.every((k) => s.inspectionResult[k] !== undefined)
  ) {
    return "すべての点検項目を選択してください";
  }
  return null;
};

const validateAlcoholUsed = (s: FormState): string | null =>
  s.alcoholUsed === null ? SELECT_REQUIRED : null;

const validateAlcoholStatus = (s: FormState): string | null =>
  s.alcoholStatus === null ? SELECT_REQUIRED : null;

const ALCOHOL_VALUE_PATTERN = /^\d(\.\d{1,2})?$/;
const ODOMETER_PATTERN = /^\d+$/;

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

const validateOdometer = (s: FormState): string | null =>
  validateOdometerValue(s.odometer);

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
  { key: "license", validate: validateLicense },
  { key: "health", validate: validateHealth },
  { key: "vehicleCheck", validate: validateVehicleCheck },
  { key: "alcoholUsed", validate: validateAlcoholUsed },
  { key: "alcoholStatus", validate: validateAlcoholStatus },
  {
    key: "alcoholValue",
    validate: (s) => validateAlcoholValue(s.alcoholValue),
  },
  { key: "odometer", validate: validateOdometer },
  { key: "vehicleId", validate: validateVehicleId },
];

const validateForm = (s: FormState): Errors =>
  VALIDATORS.reduce<Errors>((acc, { key, validate }) => {
    const error = validate(s);
    return error === null ? acc : { ...acc, [key]: error };
  }, {});

export const StartTenkoForm = () => {
  const [inspectorType, setInspectorType] = useState<InspectorType | null>(
    null,
  );
  const [inspectorName, setInspectorName] = useState("");

  const [inspectionMethod, setInspectionMethod] =
    useState<InspectionMethod | null>(null);
  const [inspectionMethodNote, setInspectionMethodNote] = useState("");

  const [licenseConfirmed, setLicenseConfirmed] = useState(false);

  const [healthOk, setHealthOk] = useState<YesNo | null>(null);

  const [vehicleCheck, setVehicleCheck] = useState<CheckResult | null>(null);
  const [inspectionResult, setInspectionResult] = useState<InspectionResult>(
    {},
  );

  const [alcoholUsed, setAlcoholUsed] = useState<AlcoholUsed | null>(null);

  const [alcoholStatus, setAlcoholStatus] = useState<CheckResult | null>(null);
  const [alcoholValue, setAlcoholValue] = useState("");

  const [odometer, setOdometer] = useState("");

  const [vehicleId, setVehicleId] = useState("");

  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<Errors>({});

  const handleInspectionChange = (
    key: InspectionKey,
    result: InspectionResultValue,
  ) => {
    const next = { ...inspectionResult, [key]: result };
    setInspectionResult(next);
    if (ALL_INSPECTION_KEYS.every((k) => next[k] !== undefined)) {
      clearError("vehicleCheck");
    }
  };

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
      licenseConfirmed,
      healthOk,
      vehicleCheck,
      inspectionResult,
      alcoholUsed,
      alcoholStatus,
      alcoholValue,
      odometer,
      vehicleId,
    };

    const nextErrors = validateForm(formState);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    // TODO: API 送信
    console.log("submit start tenko", {
      ...formState,
      inspectorName: inspectorType === "other" ? inspectorName : null,
      inspectionMethodNote:
        inspectionMethod === "other" ? inspectionMethodNote : null,
      inspectionResult: vehicleCheck === "abnormal" ? inspectionResult : null,
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
            error={Boolean(errors.inspector) && inspectorType === null}
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
              error={Boolean(errors.inspector) && inspectorType === "other"}
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
            error={Boolean(errors.method) && inspectionMethod === null}
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
              error={Boolean(errors.method) && inspectionMethod === "other"}
              maxLength={200}
            />
          ) : null}
        </div>
      </FormField>

      <FormField label="免許証の携帯確認" required error={errors.license}>
        <div className="flex flex-col gap-[10px] w-full">
          <p className="text-[12px] leading-[18px] text-[#888986]">
            運転する際、法律において免許は携帯を義務付けられています。また、事故が発生した場合は、免許不携帯となります。今一度、業務開始前に免許証を携帯しているか確認して下さい。
          </p>
          <CheckCard
            checked={licenseConfirmed}
            onChange={(checked) => {
              setLicenseConfirmed(checked);
              if (checked) clearError("license");
            }}
            error={Boolean(errors.license)}
          >
            確かに携帯していることを確認した
          </CheckCard>
        </div>
      </FormField>

      <FormField label="体調・疲労状況" required error={errors.health}>
        <div className="flex flex-col gap-[10px] w-full">
          <p className="text-[12px] leading-[18px] text-[#888986]">
            業務に支障が無いか、正確に判断する必要があります。
          </p>
          <SegmentedToggle
            value={healthOk}
            onChange={(v) => {
              setHealthOk(v);
              clearError("health");
            }}
            options={YESNO_OPTIONS}
            error={Boolean(errors.health)}
          />
        </div>
      </FormField>

      <FormField
        label="車両点検の実施と状況報告"
        required
        error={errors.vehicleCheck}
      >
        <div className="flex flex-col gap-[10px] w-full">
          <SegmentedToggle
            value={vehicleCheck}
            onChange={(v) => {
              setVehicleCheck(v);
              setInspectionResult({});
              clearError("vehicleCheck");
            }}
            options={CHECK_RESULT_OPTIONS}
            error={Boolean(errors.vehicleCheck) && vehicleCheck === null}
          />
          {vehicleCheck === "abnormal" ? (
            <VehicleInspectionPanel
              value={inspectionResult}
              onChange={handleInspectionChange}
              errorOnUnselected={Boolean(errors.vehicleCheck)}
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
        <div className="flex flex-col gap-[10px] w-full">
          <p className="text-[12px] leading-[18px] text-[#888986]">
            酒気数値を入力してください
          </p>
          <SegmentedToggle
            value={alcoholStatus}
            onChange={(v) => {
              setAlcoholStatus(v);
              clearError("alcoholStatus");
            }}
            options={CHECK_RESULT_OPTIONS}
            error={Boolean(errors.alcoholStatus)}
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

      <FormField label="開始ODDメーター" required error={errors.odometer}>
        <TextInput
          type="text"
          inputMode="numeric"
          placeholder="数値を入力"
          value={odometer}
          onChange={(e) => setOdometer(e.target.value)}
          onBlur={() =>
            updateError("odometer", () => validateOdometerValue(odometer))
          }
          error={Boolean(errors.odometer)}
          maxLength={7}
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
