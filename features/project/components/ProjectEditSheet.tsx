"use client";

import { useRef, useState } from "react";

import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { PillSegmentedToggle } from "@/components/ui/PillSegmentedToggle";
import { SelectInput } from "@/components/ui/SelectInput";
import { TextInput } from "@/components/ui/TextInput";
import { TimePicker } from "@/components/ui/TimePicker";

export type ProjectEditValue = {
  name: string;
  type: "regular" | "spot";
  contractCompanyId: string;
  startTime: string;
  endTime: string;
  pickupLocation: string;
  deliveryLocation: string;
  restLocations: ReadonlyArray<string>;
  active: boolean;
};

type Errors = Partial<{
  name: string;
  startTime: string;
  endTime: string;
  pickupLocation: string;
  deliveryLocation: string;
  restLocation: string;
}>;

type Mode = "edit" | "create";

type CompanyOption = { id: string; name: string };

type Props = {
  mode?: Mode;
  initialValue: ProjectEditValue;
  companies: ReadonlyArray<CompanyOption>;
  onCancel: () => void;
  onSave: (value: ProjectEditValue) => void;
};

const TIME_PATTERN = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;
const MAX_REST_LOCATIONS = 5;
const TYPE_LABEL: Record<"regular" | "spot", string> = {
  regular: "定期",
  spot: "スポット",
};
const TYPE_OPTIONS = [
  { value: "regular", label: "定期" },
  { value: "spot", label: "スポット" },
];

const ACTIVE_TOGGLE_OPTIONS = [
  { value: "active", label: "有効化", variant: "primary" },
  { value: "inactive", label: "無効化", variant: "danger" },
] as const;

const requiredMessage = (label: string): string => `${label}を入力してください`;

const validateText = (value: string, label: string): string | null => {
  if (value.trim() === "") return requiredMessage(label);
  return null;
};

const validateTime = (value: string, label: string): string | null => {
  const trimmed = value.trim();
  if (trimmed === "") return requiredMessage(label);
  if (!TIME_PATTERN.test(trimmed)) return "HH:mm 形式で入力してください";
  return null;
};

const toMinutes = (value: string): number => {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
};

const VALIDATORS: ReadonlyArray<{
  key: keyof Errors;
  run: (v: ProjectEditValue) => string | null;
}> = [
  { key: "name", run: (v) => validateText(v.name, "案件名") },
  { key: "startTime", run: (v) => validateTime(v.startTime, "開始時刻") },
  { key: "endTime", run: (v) => validateTime(v.endTime, "終了時刻") },
  {
    key: "pickupLocation",
    run: (v) => validateText(v.pickupLocation, "積地"),
  },
  {
    key: "deliveryLocation",
    run: (v) => validateText(v.deliveryLocation, "着地"),
  },
  {
    key: "restLocation",
    run: (v) => validateText(v.restLocations[0] ?? "", "休憩場所"),
  },
];

const validateForm = (v: ProjectEditValue): Errors => {
  const errors = VALIDATORS.reduce<Errors>((acc, { key, run }) => {
    const error = run(v);
    return error === null ? acc : { ...acc, [key]: error };
  }, {});
  if (errors.startTime === undefined && errors.endTime === undefined) {
    if (toMinutes(v.endTime) <= toMinutes(v.startTime)) {
      return { ...errors, endTime: "終了時刻は開始時刻より後にしてください" };
    }
  }
  return errors;
};

const FieldLabel = ({
  children,
  required,
  muted,
}: {
  children: React.ReactNode;
  required?: boolean;
  muted?: boolean;
}) => (
  <span
    className={`text-[13px] font-semibold ${
      muted === true ? "text-[#868685]" : "text-[#0e0f0c]"
    }`}
  >
    {children}
    {required === true ? (
      <span
        className={`ml-1 ${muted === true ? "text-[#868685]" : "text-[#e23b4a]"}`}
      >
        *
      </span>
    ) : null}
  </span>
);

const TypeField = ({
  isCreate,
  value,
  onChange,
}: {
  isCreate: boolean;
  value: "regular" | "spot";
  onChange: (next: "regular" | "spot") => void;
}) => (
  <div className="flex flex-col gap-2 w-full">
    <FieldLabel required muted={!isCreate}>
      種別
    </FieldLabel>
    {isCreate ? (
      <SelectInput
        placeholder="種別を選択"
        value={value}
        onChange={(v) => onChange(v === "spot" ? "spot" : "regular")}
        options={TYPE_OPTIONS}
      />
    ) : (
      <DisabledSelect value={TYPE_LABEL[value]} />
    )}
  </div>
);

const ContractCompanyField = ({
  isCreate,
  value,
  options,
  displayName,
  onChange,
}: {
  isCreate: boolean;
  value: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  displayName: string;
  onChange: (next: string) => void;
}) => (
  <div className="flex flex-col gap-2 w-full">
    <FieldLabel required={isCreate} muted={!isCreate}>
      担当会社
    </FieldLabel>
    {isCreate ? (
      <SelectInput
        placeholder="担当会社を選択"
        value={value}
        onChange={onChange}
        options={[...options]}
      />
    ) : (
      <DisabledSelect value={displayName} />
    )}
  </div>
);

const DisabledSelect = ({ value }: { value: string }) => (
  <div className="bg-[#f7f7f5] border border-[#e8ebe6] rounded-[10px] flex items-center justify-between px-4 py-3.5 w-full">
    <span className="flex-1 min-w-0 text-[14px] font-normal text-[#868685] truncate">
      {value}
    </span>
    <span className="text-[10px] text-[#868685] shrink-0">▼</span>
  </div>
);

const LogoDropzone = ({
  fileName,
  onSelect,
}: {
  fileName: string | null;
  onSelect: (file: File) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handlePick = () => inputRef.current?.click();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file !== undefined) onSelect(file);
    e.target.value = "";
  };
  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file !== undefined) onSelect(file);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/heic,image/webp,image/svg+xml"
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={handlePick}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`bg-[#f7f7f5] border-[1.5px] border-dashed rounded-[10px] flex flex-col gap-2 h-[120px] items-center justify-center px-4 py-6 w-full cursor-pointer transition-colors leading-[normal] ${
          dragOver ? "border-[#9fe870] bg-[#e2f6d5]" : "border-[#e8ebe6]"
        }`}
      >
        <div className="bg-[#e2f6d5] rounded-[20px] w-10 h-10 flex items-center justify-center">
          <span className="text-[18px] text-[#163300] leading-none">⬆</span>
        </div>
        <p className="text-[13px] font-medium text-[#0e0f0c] text-center">
          {fileName ?? "ここにファイルをドラッグ＆ドロップ"}
        </p>
        <p className="flex gap-1 text-[12px]">
          <span className="font-normal text-[#868685]">または</span>
          <span className="font-medium text-[#163300] underline">
            クリックして選択
          </span>
        </p>
      </button>
    </>
  );
};

type RestLocationsFieldProps = {
  values: ReadonlyArray<string>;
  onChange: (next: ReadonlyArray<string>) => void;
  firstError?: string;
  onFirstChange?: () => void;
  onFirstBlur?: () => void;
};

const RestLocationsField = ({
  values,
  onChange,
  firstError,
  onFirstChange,
  onFirstBlur,
}: RestLocationsFieldProps) => {
  const handleEdit = (i: number, v: string) => {
    onChange(values.map((cur, idx) => (idx === i ? v : cur)));
    if (i === 0) onFirstChange?.();
  };
  const handleRemove = (i: number) => {
    if (i === 0) return;
    onChange(values.filter((_, idx) => idx !== i));
  };
  const handleAdd = () => {
    if (values.length >= MAX_REST_LOCATIONS) return;
    onChange([...values, ""]);
  };
  const canAdd = values.length < MAX_REST_LOCATIONS;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between w-full">
        <FieldLabel required>休憩場所</FieldLabel>
        <span className="text-[11px] font-normal text-[#868685]">
          {values.length} / {MAX_REST_LOCATIONS}
        </span>
      </div>
      {values.map((v, i) => (
        <div key={i} className="flex gap-2 items-center w-full">
          <div className="flex-1 min-w-0">
            <TextInput
              placeholder="例：海老名SA"
              value={v}
              onChange={(e) => handleEdit(i, e.target.value)}
              onBlur={i === 0 ? onFirstBlur : undefined}
              maxLength={100}
              error={i === 0 && firstError !== undefined}
            />
          </div>
          {i === 0 ? null : (
            <button
              type="button"
              onClick={() => handleRemove(i)}
              aria-label="休憩場所を削除"
              className="border border-[#e8ebe6] rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-[#f7f7f5] transition-colors text-[12px] text-[#868685] shrink-0"
            >
              ✕
            </button>
          )}
        </div>
      ))}
      {firstError !== undefined ? (
        <span className="text-[12px] text-[#e23b4a]">{firstError}</span>
      ) : null}
      {canAdd ? (
        <div className="flex justify-end w-full">
          <button
            type="button"
            onClick={handleAdd}
            className="bg-white border border-[#e8ebe6] rounded-full flex gap-1 items-center px-4 py-2.5 text-[13px] font-medium text-[#868685] cursor-pointer hover:bg-[#f7f7f5] transition-colors"
          >
            <span>＋</span>
            <span>休憩場所を追加</span>
          </button>
        </div>
      ) : null}
    </div>
  );
};

export const ProjectEditSheet = ({
  mode = "edit",
  initialValue,
  companies,
  onCancel,
  onSave,
}: Props) => {
  const [value, setValue] = useState<ProjectEditValue>(initialValue);
  const [errors, setErrors] = useState<Errors>({});
  const [logoFileName, setLogoFileName] = useState<string | null>(null);
  const [disableConfirmOpen, setDisableConfirmOpen] = useState(false);
  const isCreate = mode === "create";
  const contractCompanyName =
    companies.find((c) => c.id === value.contractCompanyId)?.name ?? "";
  const companyOptions = companies.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const updateError = (key: keyof Errors, message: string | null) => {
    setErrors((prev) => {
      const next = { ...prev };
      if (message === null) delete next[key];
      else next[key] = message;
      return next;
    });
  };
  const clearError = (key: keyof Errors) => {
    setErrors((prev) => {
      if (prev[key] === undefined) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validateForm(value);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    if (initialValue.active && !value.active) {
      setDisableConfirmOpen(true);
      return;
    }
    onSave(value);
  };

  const handleDisableConfirmCancel = () => setDisableConfirmOpen(false);
  const handleDisableConfirmExecute = () => {
    setDisableConfirmOpen(false);
    onSave(value);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full leading-[normal]"
        noValidate
      >
        <div className="flex flex-col gap-2 w-full">
          <FieldLabel required>案件名</FieldLabel>
          <TextInput
            placeholder="例：日通-品川"
            value={value.name}
            onChange={(e) => {
              setValue((prev) => ({ ...prev, name: e.target.value }));
              if (e.target.value.trim() !== "") clearError("name");
            }}
            onBlur={() =>
              updateError("name", validateText(value.name, "案件名"))
            }
            maxLength={100}
            error={errors.name !== undefined}
          />
          {errors.name !== undefined ? (
            <span className="text-[12px] text-[#e23b4a]">{errors.name}</span>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <FieldLabel>受託先のロゴ</FieldLabel>
          <LogoDropzone
            fileName={logoFileName}
            onSelect={(f) => setLogoFileName(f.name)}
          />
          <p className="text-[11px] font-normal text-[#868685]">
            PNG, JPG, HEIC, WebP, SVG 対応
          </p>
        </div>

        <TypeField
          isCreate={isCreate}
          value={value.type}
          onChange={(next) => setValue((prev) => ({ ...prev, type: next }))}
        />

        <div className="flex gap-4 items-start w-full">
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <FieldLabel required>開始時刻</FieldLabel>
            <TimePicker
              placeholder="08:00"
              value={value.startTime}
              onChange={(v) => {
                setValue((prev) => ({ ...prev, startTime: v }));
                updateError("startTime", validateTime(v, "開始時刻"));
              }}
              onBlur={() =>
                updateError(
                  "startTime",
                  validateTime(value.startTime, "開始時刻"),
                )
              }
              error={errors.startTime !== undefined}
            />
            {errors.startTime !== undefined ? (
              <span className="text-[12px] text-[#e23b4a]">
                {errors.startTime}
              </span>
            ) : null}
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <FieldLabel required>終了時刻</FieldLabel>
            <TimePicker
              placeholder="11:00"
              value={value.endTime}
              onChange={(v) => {
                setValue((prev) => ({ ...prev, endTime: v }));
                updateError("endTime", validateTime(v, "終了時刻"));
              }}
              onBlur={() =>
                updateError("endTime", validateTime(value.endTime, "終了時刻"))
              }
              error={errors.endTime !== undefined}
            />
            {errors.endTime !== undefined ? (
              <span className="text-[12px] text-[#e23b4a]">
                {errors.endTime}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex gap-4 items-start w-full">
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <FieldLabel required>積地</FieldLabel>
            <TextInput
              placeholder="例：品川"
              value={value.pickupLocation}
              onChange={(e) => {
                setValue((prev) => ({
                  ...prev,
                  pickupLocation: e.target.value,
                }));
                if (e.target.value.trim() !== "") clearError("pickupLocation");
              }}
              onBlur={() =>
                updateError(
                  "pickupLocation",
                  validateText(value.pickupLocation, "積地"),
                )
              }
              maxLength={100}
              error={errors.pickupLocation !== undefined}
            />
            {errors.pickupLocation !== undefined ? (
              <span className="text-[12px] text-[#e23b4a]">
                {errors.pickupLocation}
              </span>
            ) : null}
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <FieldLabel required>着地</FieldLabel>
            <TextInput
              placeholder="例：品川"
              value={value.deliveryLocation}
              onChange={(e) => {
                setValue((prev) => ({
                  ...prev,
                  deliveryLocation: e.target.value,
                }));
                if (e.target.value.trim() !== "")
                  clearError("deliveryLocation");
              }}
              onBlur={() =>
                updateError(
                  "deliveryLocation",
                  validateText(value.deliveryLocation, "着地"),
                )
              }
              maxLength={100}
              error={errors.deliveryLocation !== undefined}
            />
            {errors.deliveryLocation !== undefined ? (
              <span className="text-[12px] text-[#e23b4a]">
                {errors.deliveryLocation}
              </span>
            ) : null}
          </div>
        </div>

        <RestLocationsField
          values={value.restLocations}
          onChange={(next) =>
            setValue((prev) => ({ ...prev, restLocations: next }))
          }
          firstError={errors.restLocation}
          onFirstChange={() => {
            if (errors.restLocation !== undefined) clearError("restLocation");
          }}
          onFirstBlur={() => {
            const first = value.restLocations[0] ?? "";
            updateError(
              "restLocation",
              first.trim() === "" ? requiredMessage("休憩場所") : null,
            );
          }}
        />

        <ContractCompanyField
          isCreate={isCreate}
          value={value.contractCompanyId}
          options={companyOptions}
          displayName={contractCompanyName}
          onChange={(next) =>
            setValue((prev) => ({ ...prev, contractCompanyId: next }))
          }
        />

        <div className="flex flex-col gap-2 w-full">
          <FieldLabel>有効/無効</FieldLabel>
          <PillSegmentedToggle
            value={value.active ? "active" : "inactive"}
            onChange={(next) =>
              setValue((prev) => ({ ...prev, active: next === "active" }))
            }
            options={ACTIVE_TOGGLE_OPTIONS}
          />
        </div>

        <div className="flex gap-3 justify-center pt-2 w-full">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-white border border-[#e8ebe6] rounded-full py-3.5 text-[14px] font-semibold text-[#868685] cursor-pointer hover:bg-[#f7f7f5] transition-colors"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="flex-1 bg-[#9fe870] rounded-full py-3.5 text-[14px] font-semibold text-[#163300] cursor-pointer hover:bg-[#8edc5e] transition-colors"
          >
            保存する
          </button>
        </div>
      </form>

      <ConfirmModal
        open={disableConfirmOpen}
        title="確認"
        message={`「${value.name}」を無効化します。無効化後は新規シフトに割り当てできなくなります。よろしいですか？`}
        cancelLabel="キャンセル"
        confirmLabel="無効化する"
        variant="danger"
        onCancel={handleDisableConfirmCancel}
        onConfirm={handleDisableConfirmExecute}
      />
    </>
  );
};
