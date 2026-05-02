"use client";

export type AdminRole = "super_admin" | "admin";
export type AdminStatus = "active" | "inactive";

type Props = {
  name: string;
  status: AdminStatus;
  role: AdminRole;
  email: string;
  affiliation: string;
  scope: string;
  onClick: () => void;
};

const STATUS_LABEL: Record<AdminStatus, string> = {
  active: "有効",
  inactive: "無効",
};

const STATUS_BG: Record<AdminStatus, string> = {
  active: "bg-[#e3f5d6]",
  inactive: "bg-[#ffebeb]",
};

const STATUS_TEXT: Record<AdminStatus, string> = {
  active: "text-[#163300]",
  inactive: "text-[#e23b4a]",
};

const ROLE_LABEL: Record<AdminRole, string> = {
  super_admin: "全体管理者",
  admin: "管理者",
};

const ROLE_BG: Record<AdminRole, string> = {
  super_admin: "bg-[#9fe870]",
  admin: "bg-white border border-[#e8ebe6]",
};

const ROLE_TEXT: Record<AdminRole, string> = {
  super_admin: "text-[#163300]",
  admin: "text-[#868685]",
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-2 items-start w-full text-[12px]">
    <span className="w-[72px] shrink-0 text-[#868685] font-normal">
      {label}
    </span>
    <span className="flex-1 min-w-0 text-[#0e0f0c] font-normal">{value}</span>
  </div>
);

export const AdminCard = ({
  name,
  status,
  role,
  email,
  affiliation,
  scope,
  onClick,
}: Props) => (
  <button
    type="button"
    onClick={onClick}
    className="bg-white rounded-[14px] flex flex-col gap-2.5 px-4 py-3.5 w-full text-left cursor-pointer hover:bg-[#fafafa] transition-colors leading-[normal]"
  >
    <div className="flex items-center justify-between w-full gap-2">
      <div className="flex gap-2 items-center min-w-0">
        <span className="text-[14px] font-semibold text-[#0e0f0c] truncate">
          {name}
        </span>
        <span
          className={`shrink-0 inline-flex items-center px-2 py-[3px] rounded-full text-[10px] font-medium ${STATUS_BG[status]} ${STATUS_TEXT[status]}`}
        >
          {STATUS_LABEL[status]}
        </span>
      </div>
      <span
        className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${ROLE_BG[role]} ${ROLE_TEXT[role]}`}
      >
        {ROLE_LABEL[role]}
      </span>
    </div>
    <div className="flex flex-col gap-1.5 w-full">
      <DetailRow label="メール" value={email} />
      <DetailRow label="所属会社" value={affiliation} />
      <DetailRow label="可視範囲" value={scope} />
    </div>
  </button>
);
