type Props = {
  count: number;
};

export const SearchResultCount = ({ count }: Props) => (
  <p className="text-[12px] font-normal text-[#868685] leading-[normal] whitespace-nowrap">
    検索結果: {count} 件
  </p>
);
