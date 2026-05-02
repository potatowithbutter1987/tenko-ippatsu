"use client";

export type CompanyDetailData = {
  name: string;
  representative: string;
  parentName: string;
  tier: number;
  phone: string;
  email: string;
  driverCount: number;
  active: boolean;
  letterMail: boolean;
};

type Props = {
  company: CompanyDetailData;
  breadcrumb: string;
  onClick: () => void;
};

const StatusPill = ({ active, label }: { active: boolean; label: string }) => {
  const bg = active ? "bg-[#e2f6d5]" : "bg-[#f7f7f5]";
  const text = active ? "text-[#163300]" : "text-[#868685]";
  return (
    <span
      className={`inline-flex items-center px-2 py-[3px] rounded-full text-[11px] font-medium ${bg} ${text}`}
    >
      {label}
    </span>
  );
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex gap-2 items-start w-full text-[12px]">
    <span className="w-[80px] shrink-0 text-[#868685] font-normal">
      {label}
    </span>
    <div className="flex-1 min-w-0 text-[#0e0f0c] font-normal">{children}</div>
  </div>
);

export const CompanyDetail = ({ company, breadcrumb, onClick }: Props) => (
  <button
    type="button"
    onClick={onClick}
    className="bg-white rounded-[14px] flex flex-col gap-3 p-4 w-full text-left leading-[normal] cursor-pointer hover:bg-[#fafafa] transition-colors"
  >
    <div className="flex flex-col gap-1 w-full">
      <p className="text-[14px] font-semibold text-[#0e0f0c]">会社詳細</p>
      <p className="text-[11px] font-normal text-[#868685] break-all">
        {breadcrumb}
      </p>
    </div>
    <div className="h-px bg-[#e8ebe6] w-full" />
    <div className="flex flex-col gap-2 w-full">
      <Field label="会社名">{company.name}</Field>
      <Field label="代表者名">{company.representative}</Field>
      <Field label="親会社">{company.parentName}</Field>
      <Field label="階層">{company.tier}次</Field>
      <Field label="電話">{company.phone}</Field>
      <Field label="メール">{company.email}</Field>
      <Field label="ドライバー">{company.driverCount} 名</Field>
      <Field label="稼働状態">
        <StatusPill
          active={company.active}
          label={company.active ? "有効" : "無効"}
        />
      </Field>
      <Field label="信書便">
        <StatusPill
          active={company.letterMail}
          label={company.letterMail ? "有効" : "無効"}
        />
      </Field>
    </div>
  </button>
);
