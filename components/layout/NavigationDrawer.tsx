"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";

// M3 Motion tokens
const ENTER_DURATION_MS = 350;
const EXIT_DURATION_MS = 200;
const EMPHASIZED_DECELERATE = "cubic-bezier(0.05, 0.7, 0.1, 1.0)";
const EMPHASIZED_ACCELERATE = "cubic-bezier(0.3, 0.0, 0.8, 0.15)";

const TITLE = "点呼一発";

type DrawerMenuItem = {
  href: string;
  icon: string;
  label: string;
};

const ADMIN_MENU_ITEMS: ReadonlyArray<DrawerMenuItem> = [
  { href: "/admin/dashboard", icon: "🏠", label: "日常業務" },
  { href: "/admin/records", icon: "📋", label: "点呼記録簿" },
  { href: "/admin/operating-hours", icon: "📊", label: "月間運行時間" },
  { href: "/admin/drivers", icon: "👤", label: "ドライバー設定" },
  { href: "/admin/shifts", icon: "📅", label: "シフト管理" },
  { href: "/admin/settings", icon: "⚙", label: "システム設定" },
];

type AdminShellContextValue = {
  open: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const AdminShellContext = createContext<AdminShellContextValue | null>(null);

export const useAdminShell = (): AdminShellContextValue => {
  const ctx = useContext(AdminShellContext);
  if (ctx === null) {
    throw new Error("useAdminShell must be used within AdminShellProvider");
  }
  return ctx;
};

type ProviderProps = {
  children: React.ReactNode;
};

export const AdminShellProvider = ({ children }: ProviderProps) => {
  const [open, setOpen] = useState(false);
  const openDrawer = useCallback(() => setOpen(true), []);
  const closeDrawer = useCallback(() => setOpen(false), []);
  const value = useMemo<AdminShellContextValue>(
    () => ({ open, openDrawer, closeDrawer }),
    [open, openDrawer, closeDrawer],
  );

  return (
    <AdminShellContext.Provider value={value}>
      {children}
      <NavigationDrawer />
    </AdminShellContext.Provider>
  );
};

type MenuItemRowProps = {
  item: DrawerMenuItem;
  isActive: boolean;
  onNavigate: () => void;
};

const MenuItemRow = ({ item, isActive, onNavigate }: MenuItemRowProps) => {
  const containerClass = isActive
    ? "bg-[#1a1c18] border border-[rgba(159,232,112,0.3)]"
    : "border border-transparent hover:bg-[#1a1c18]";
  const iconClass = isActive ? "bg-[#9fe870]" : "bg-[#1a1c18]";
  const labelClass = isActive
    ? "font-bold text-[#9fe870]"
    : "font-medium text-white";

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex gap-3.5 items-center p-3.5 rounded-xl w-full transition-colors ${containerClass}`}
    >
      <span
        className={`flex items-center justify-center w-9 h-9 rounded-[10px] text-[16px] ${iconClass}`}
      >
        {item.icon}
      </span>
      <span className={`flex-1 text-[15px] ${labelClass}`}>{item.label}</span>
      <span className="text-[18px] text-[#868685] leading-none">›</span>
    </Link>
  );
};

const NavigationDrawer = () => {
  const { open, closeDrawer } = useAdminShell();
  const pathname = usePathname();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      const raf = requestAnimationFrame(() => {
        flushSync(() => setShouldRender(true));
        if (drawerRef.current !== null) {
          void drawerRef.current.offsetHeight;
        }
        requestAnimationFrame(() => setIsVisible(true));
      });
      return () => cancelAnimationFrame(raf);
    }
    const fadeOut = setTimeout(() => setIsVisible(false), 0);
    const unmount = setTimeout(() => setShouldRender(false), EXIT_DURATION_MS);
    return () => {
      clearTimeout(fadeOut);
      clearTimeout(unmount);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, closeDrawer]);

  if (!shouldRender) return null;

  const handleLogout = () => {
    closeDrawer();
    // TODO: ログアウト API 呼び出し（セッション破棄等）
    router.push("/admin/login");
  };

  const duration = isVisible ? ENTER_DURATION_MS : EXIT_DURATION_MS;
  const easing = isVisible ? EMPHASIZED_DECELERATE : EMPHASIZED_ACCELERATE;

  const scrimStyle: React.CSSProperties = {
    transition: `opacity ${duration}ms ${easing}`,
    opacity: isVisible ? 1 : 0,
  };
  const drawerStyle: React.CSSProperties = {
    transition: `transform ${duration}ms ${easing}`,
    transform: isVisible ? "translateX(0)" : "translateX(-100%)",
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <button
        type="button"
        onClick={closeDrawer}
        aria-label="閉じる"
        className="absolute inset-0 bg-[rgba(0,0,0,0.5)] cursor-default"
        style={scrimStyle}
      />
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        className="relative bg-[#0e0f0c] flex flex-col w-[300px] h-full rounded-tr-[24px] rounded-br-[24px] overflow-hidden"
        style={drawerStyle}
      >
        <div className="flex gap-3 items-center pt-7 pb-5 px-5 w-full shrink-0">
          <h2 className="flex-1 min-w-0 text-[16px] font-bold text-white">
            {TITLE}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="閉じる"
            className="w-8 h-8 flex items-center justify-center text-[16px] text-white cursor-pointer hover:bg-[rgba(255,255,255,0.08)] rounded-full transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="h-px bg-[rgba(255,255,255,0.08)] w-full shrink-0" />
        <nav className="flex-1 flex flex-col gap-1 px-3 py-5 overflow-y-auto">
          {ADMIN_MENU_ITEMS.map((item) => (
            <MenuItemRow
              key={item.href}
              item={item}
              isActive={item.href === pathname}
              onNavigate={closeDrawer}
            />
          ))}
        </nav>
        <div className="border-t border-[rgba(255,255,255,0.08)] pb-7 pt-4 px-4 w-full shrink-0">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full border border-[#868685] rounded-xl flex items-center justify-center px-4 py-3.5 text-[14px] font-semibold text-[#868685] cursor-pointer hover:bg-[#1a1c18] transition-colors"
          >
            ログアウト
          </button>
        </div>
      </div>
    </div>
  );
};
