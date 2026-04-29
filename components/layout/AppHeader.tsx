type Props = {
  title?: string;
};

export const AppHeader = ({ title = "点呼一発" }: Props) => {
  return (
    <header className="w-full h-[52px] bg-white border-y border-[#e8ebe5]">
      <div className="w-full max-w-[765px] h-full mx-auto px-5 flex items-center">
        <p className="font-semibold text-[16px] text-[#0e0f0c]">{title}</p>
      </div>
    </header>
  );
};
