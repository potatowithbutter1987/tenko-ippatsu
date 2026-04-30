"use client";

type Props = {
  title: string;
  notificationCount?: number;
  userInitial: string;
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
  onAvatarClick?: () => void;
};

export const AdminAppBar = ({
  title,
  notificationCount,
  userInitial,
  onMenuClick,
  onNotificationClick,
  onAvatarClick,
}: Props) => {
  return (
    <header className="w-full bg-white border-b border-[#e8ebe6] flex gap-3 items-center pl-4 pr-3 py-2.5">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="メニュー"
        className="w-10 h-10 flex items-center justify-center text-[24px] font-bold text-[#0e0f0c] cursor-pointer hover:bg-[#f7f7f5] rounded-full transition-colors"
      >
        ☰
      </button>
      <h1 className="flex-1 min-w-0 text-[18px] font-bold text-[#0e0f0c] truncate">
        {title}
      </h1>
      <div className="flex gap-2 items-center">
        <button
          type="button"
          onClick={onNotificationClick}
          aria-label="通知"
          className="relative w-9 h-9 flex items-center justify-center cursor-pointer hover:bg-[#f7f7f5] rounded-full transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0e0f0c"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          {notificationCount !== undefined && notificationCount > 0 ? (
            <span className="absolute top-0 right-0 bg-[#e23b4a] text-white text-[10px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center leading-none">
              {notificationCount}
            </span>
          ) : null}
        </button>
        <button
          type="button"
          onClick={onAvatarClick}
          aria-label="ユーザーメニュー"
          className="bg-[#9fe870] rounded-full w-9 h-9 flex items-center justify-center cursor-pointer hover:bg-[#8edc5e] transition-colors"
        >
          <span className="text-[14px] font-bold text-[#163300]">
            {userInitial}
          </span>
        </button>
      </div>
    </header>
  );
};
