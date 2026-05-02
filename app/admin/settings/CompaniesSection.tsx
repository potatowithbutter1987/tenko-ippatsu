"use client";

import { useState } from "react";

import { ActionRow } from "@/app/admin/settings/ActionRow";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { CompanyActionSheet } from "@/features/company/components/CompanyActionSheet";
import {
  CompanyDetail,
  type CompanyDetailData,
} from "@/features/company/components/CompanyDetail";
import {
  CompanyEditSheet,
  type CompanyEditValue,
} from "@/features/company/components/CompanyEditSheet";
import {
  CompanyTree,
  type CompanyNode,
} from "@/features/company/components/CompanyTree";

type CompanyEntry = CompanyDetailData & {
  id: string;
  parentId: string | null;
  children: ReadonlyArray<CompanyEntry>;
};

const MOCK_COMPANY_TREE: ReadonlyArray<CompanyEntry> = [
  {
    id: "homy",
    name: "HOMY EXPRESS",
    tier: 1,
    parentId: null,
    representative: "—",
    parentName: "—",
    phone: "03-0000-xxxx",
    email: "info@homy.example.com",
    driverCount: 5,
    active: true,
    letterMail: true,
    children: [
      {
        id: "a-kyubin",
        name: "A急便",
        tier: 2,
        parentId: "homy",
        representative: "鈴木 一郎",
        parentName: "HOMY EXPRESS (1次)",
        phone: "03-0001-xxxx",
        email: "a-kyubin@example.com",
        driverCount: 3,
        active: true,
        letterMail: false,
        children: [
          {
            id: "sato",
            name: "個人事業主 佐藤",
            tier: 3,
            parentId: "a-kyubin",
            representative: "佐藤 太郎",
            parentName: "A急便 (2次)",
            phone: "03-1111-xxxx",
            email: "sato@example.com",
            driverCount: 1,
            active: true,
            letterMail: false,
            children: [],
          },
          {
            id: "b-unsou",
            name: "B運送",
            tier: 3,
            parentId: "a-kyubin",
            representative: "B 太郎",
            parentName: "A急便 (2次)",
            phone: "03-2222-xxxx",
            email: "b@example.com",
            driverCount: 2,
            active: true,
            letterMail: false,
            children: [],
          },
        ],
      },
      {
        id: "c-unyu",
        name: "C運輸",
        tier: 2,
        parentId: "homy",
        representative: "高橋 次郎",
        parentName: "HOMY EXPRESS (1次)",
        phone: "03-0002-xxxx",
        email: "c-unyu@example.com",
        driverCount: 1,
        active: true,
        letterMail: true,
        children: [
          {
            id: "yamada",
            name: "個人事業主 山田",
            tier: 3,
            parentId: "c-unyu",
            representative: "山田 三郎",
            parentName: "C運輸 (2次)",
            phone: "03-3333-xxxx",
            email: "yamada@example.com",
            driverCount: 1,
            active: true,
            letterMail: false,
            children: [],
          },
        ],
      },
    ],
  },
];

const flattenCompanies = (
  nodes: ReadonlyArray<CompanyEntry>,
): ReadonlyArray<CompanyEntry> => {
  const out: CompanyEntry[] = [];
  const visit = (n: CompanyEntry) => {
    out.push(n);
    n.children.forEach(visit);
  };
  nodes.forEach(visit);
  return out;
};

const FLAT_COMPANIES = flattenCompanies(MOCK_COMPANY_TREE);
const FLAT_COMPANIES_BY_ID = new Map(FLAT_COMPANIES.map((c) => [c.id, c]));

const buildBreadcrumb = (id: string): string => {
  const parts: string[] = [];
  let current: CompanyEntry | undefined = FLAT_COMPANIES_BY_ID.get(id);
  while (current !== undefined) {
    parts.unshift(current.name);
    current =
      current.parentId === null
        ? undefined
        : FLAT_COMPANIES_BY_ID.get(current.parentId);
  }
  return parts.join(" > ");
};

const toCompanyNode = (entry: CompanyEntry): CompanyNode => ({
  id: entry.id,
  name: entry.name,
  tier: entry.tier,
  children: entry.children.map(toCompanyNode),
});

const COMPANY_TREE_NODES: ReadonlyArray<CompanyNode> =
  MOCK_COMPANY_TREE.map(toCompanyNode);

const collectExpandableIds = (
  nodes: ReadonlyArray<CompanyEntry>,
): ReadonlyArray<string> => {
  const out: string[] = [];
  const visit = (n: CompanyEntry) => {
    if (n.children.length > 0) {
      out.push(n.id);
      n.children.forEach(visit);
    }
  };
  nodes.forEach(visit);
  return out;
};

const INITIAL_EXPANDED_COMPANY_IDS = new Set(
  collectExpandableIds(MOCK_COMPANY_TREE),
);
const INITIAL_SELECTED_COMPANY_ID = "sato";

export const CompaniesSection = () => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    INITIAL_SELECTED_COMPANY_ID,
  );
  const [expandedCompanyIds, setExpandedCompanyIds] = useState<
    ReadonlySet<string>
  >(INITIAL_EXPANDED_COMPANY_IDS);
  const [editSheetOpen, setEditSheetOpen] = useState(false);

  const selectedCompany = FLAT_COMPANIES_BY_ID.get(selectedCompanyId) ?? null;
  const breadcrumb = buildBreadcrumb(selectedCompanyId);

  const handleCompanySelect = (id: string) => setSelectedCompanyId(id);
  const handleCompanyToggle = (id: string) => {
    setExpandedCompanyIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const handleCompanyDetailClick = () => setEditSheetOpen(true);
  const handleEditSheetClose = () => setEditSheetOpen(false);
  const handleEditSheetSave = (next: CompanyEditValue) => {
    // TODO: 協力会社更新 API
    console.log("save company", selectedCompanyId, next);
    setEditSheetOpen(false);
  };
  const handleAddCompany = () => {
    // TODO: 会社追加シート
    console.log("add company");
  };

  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const handleActionClick = () => setActionSheetOpen(true);
  const handleActionClose = () => setActionSheetOpen(false);
  const handleCsvImport = () => {
    // TODO: CSV登録 API
    console.log("csv import");
    setActionSheetOpen(false);
  };
  const handleCsvExport = () => {
    // TODO: CSV出力 API
    console.log("csv export");
    setActionSheetOpen(false);
  };

  return (
    <>
      <ActionRow
        primaryLabel="＋ 会社追加"
        onPrimaryClick={handleAddCompany}
        onActionClick={handleActionClick}
      />

      <div className="w-full max-w-[765px] mx-auto flex flex-col gap-4 px-4 py-4">
        <div className="flex items-center justify-between w-full leading-[normal]">
          <p className="text-[14px] font-semibold text-[#0e0f0c]">会社ツリー</p>
          <p className="text-[12px] font-normal text-[#868685]">
            全{FLAT_COMPANIES.length}社
          </p>
        </div>
        <CompanyTree
          nodes={COMPANY_TREE_NODES}
          selectedId={selectedCompanyId}
          expandedIds={expandedCompanyIds}
          onSelect={handleCompanySelect}
          onToggle={handleCompanyToggle}
        />
        {selectedCompany !== null ? (
          <CompanyDetail
            company={selectedCompany}
            breadcrumb={breadcrumb}
            onClick={handleCompanyDetailClick}
          />
        ) : null}
      </div>

      <BottomSheet
        open={editSheetOpen}
        onClose={handleEditSheetClose}
        title="協力会社編集"
      >
        {selectedCompany !== null ? (
          <CompanyEditSheet
            key={selectedCompany.id}
            initialValue={{
              name: selectedCompany.name,
              representative: selectedCompany.representative,
              phone: selectedCompany.phone,
              email: selectedCompany.email,
              active: selectedCompany.active,
            }}
            parentName={selectedCompany.parentName}
            tier={selectedCompany.tier}
            onCancel={handleEditSheetClose}
            onSave={handleEditSheetSave}
          />
        ) : null}
      </BottomSheet>

      <BottomSheet
        open={actionSheetOpen}
        onClose={handleActionClose}
        title="協力会社操作"
      >
        <CompanyActionSheet
          onCsvImport={handleCsvImport}
          onCsvExport={handleCsvExport}
        />
      </BottomSheet>
    </>
  );
};
