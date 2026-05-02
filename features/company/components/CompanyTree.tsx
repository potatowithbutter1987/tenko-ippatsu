"use client";

export type CompanyNode = {
  id: string;
  name: string;
  tier: number;
  children: ReadonlyArray<CompanyNode>;
};

type Props = {
  nodes: ReadonlyArray<CompanyNode>;
  selectedId: string | null;
  expandedIds: ReadonlySet<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
};

type FlatRow = {
  id: string;
  name: string;
  tier: number;
  hasChildren: boolean;
  expanded: boolean;
};

const PADDING_BY_TIER: Record<number, string> = {
  1: "pl-2 pr-2",
  2: "pl-6 pr-2",
  3: "pl-10 pr-2",
};

const flatten = (
  nodes: ReadonlyArray<CompanyNode>,
  expanded: ReadonlySet<string>,
): ReadonlyArray<FlatRow> => {
  const out: FlatRow[] = [];
  const visit = (n: CompanyNode) => {
    const hasChildren = n.children.length > 0;
    const isExpanded = expanded.has(n.id);
    out.push({
      id: n.id,
      name: n.name,
      tier: n.tier,
      hasChildren,
      expanded: isExpanded,
    });
    if (isExpanded) n.children.forEach(visit);
  };
  nodes.forEach(visit);
  return out;
};

const TreeRowContent = ({
  row,
  selected,
  onToggle,
}: {
  row: FlatRow;
  selected: boolean;
  onToggle: () => void;
}) => {
  const caret = row.expanded ? "▼" : "▶";
  if (row.hasChildren) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        aria-label={row.expanded ? "閉じる" : "開く"}
        className="text-[11px] text-[#868685] cursor-pointer hover:text-[#0e0f0c] transition-colors w-4 text-center shrink-0"
      >
        {caret}
      </button>
    );
  }
  return (
    <span className="text-[11px] text-[#868685] w-4 text-center shrink-0">
      {selected ? "・" : "・"}
    </span>
  );
};

const TreeRow = ({
  row,
  selected,
  onSelect,
  onToggle,
}: {
  row: FlatRow;
  selected: boolean;
  onSelect: () => void;
  onToggle: () => void;
}) => {
  const padding = PADDING_BY_TIER[row.tier] ?? "pl-2 pr-2";
  const bg = selected ? "bg-[#e2f6d5]" : "hover:bg-[#f7f7f5] transition-colors";
  const fontWeight = selected ? "font-semibold" : "font-normal";
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`flex gap-2 items-center w-full py-2.5 rounded-[8px] cursor-pointer ${padding} ${bg}`}
    >
      <TreeRowContent row={row} selected={selected} onToggle={onToggle} />
      <span className={`text-[13px] text-[#0e0f0c] ${fontWeight}`}>
        {row.name} ({row.tier}次)
      </span>
    </div>
  );
};

export const CompanyTree = ({
  nodes,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
}: Props) => {
  const rows = flatten(nodes, expandedIds);
  return (
    <div className="bg-white rounded-[14px] flex flex-col px-3 py-2 w-full leading-[normal]">
      {rows.map((row) => (
        <TreeRow
          key={row.id}
          row={row}
          selected={row.id === selectedId}
          onSelect={() => onSelect(row.id)}
          onToggle={() => onToggle(row.id)}
        />
      ))}
    </div>
  );
};
