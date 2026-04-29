"use client";

import { useRouter } from "next/navigation";

type Props = {
  title?: string;
  showBack?: boolean;
};

export const AppHeader = ({ title = "点呼一発", showBack }: Props) => {
  const router = useRouter();

  return (
    <header className="w-full h-[52px] bg-white border-y border-[#e8ebe5]">
      <div
        className={`relative w-full max-w-[765px] h-full mx-auto px-5 flex items-center ${
          showBack ? "justify-center" : ""
        }`}
      >
        {showBack ? (
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="戻る"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-[16px] text-[#0e0f0c] cursor-pointer hover:bg-[#f7f7f5] rounded-full transition-colors"
          >
            ←
          </button>
        ) : null}
        <p className="font-semibold text-[16px] text-[#0e0f0c]">{title}</p>
      </div>
    </header>
  );
};
