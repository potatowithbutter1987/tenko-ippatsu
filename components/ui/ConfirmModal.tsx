"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

const TRANSITION_DURATION_MS = 200;
const TRANSITION_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

type ConfirmVariant = "primary" | "danger";

type Props = {
  open: boolean;
  title?: string;
  message: string;
  cancelLabel?: string;
  confirmLabel?: string;
  variant?: ConfirmVariant;
  onCancel: () => void;
  onConfirm: () => void;
};

const CONFIRM_BUTTON_CLASS: Record<ConfirmVariant, string> = {
  primary: "bg-[#9fe870] text-[#163300] hover:bg-[#8edc5e]",
  danger: "bg-[#e23b4a] text-white hover:bg-[#c93242]",
};

export const ConfirmModal = ({
  open,
  title = "確認",
  message,
  cancelLabel = "キャンセル",
  confirmLabel = "OK",
  variant = "primary",
  onCancel,
  onConfirm,
}: Props) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      const raf = requestAnimationFrame(() => {
        flushSync(() => setShouldRender(true));
        if (cardRef.current !== null) {
          void cardRef.current.offsetHeight;
        }
        requestAnimationFrame(() => setIsVisible(true));
      });
      return () => cancelAnimationFrame(raf);
    }
    const fadeOut = setTimeout(() => setIsVisible(false), 0);
    const unmount = setTimeout(
      () => setShouldRender(false),
      TRANSITION_DURATION_MS,
    );
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
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, onCancel]);

  if (!shouldRender) return null;

  const overlayStyle: React.CSSProperties = {
    transition: `opacity ${TRANSITION_DURATION_MS}ms ${TRANSITION_EASING}`,
    opacity: isVisible ? 1 : 0,
  };
  const cardStyle: React.CSSProperties = {
    transition: `opacity ${TRANSITION_DURATION_MS}ms ${TRANSITION_EASING}, transform ${TRANSITION_DURATION_MS}ms ${TRANSITION_EASING}`,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "scale(1)" : "scale(0.85)",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <button
        type="button"
        onClick={onCancel}
        aria-label="閉じる"
        className="absolute inset-0 bg-[rgba(0,0,0,0.5)] cursor-default"
        style={overlayStyle}
      />
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        className="relative bg-white rounded-2xl flex flex-col gap-6 p-6 w-full max-w-[342px]"
        style={cardStyle}
      >
        <div className="flex items-center justify-between w-full">
          <h2 className="text-[18px] font-bold text-[#0e0f0c] leading-[22px]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="閉じる"
            className="w-6 h-6 flex items-center justify-center text-[16px] text-[#0e0f0c] cursor-pointer hover:bg-[#f7f7f5] rounded-full transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="h-px bg-[#e8ebe6] w-full" />
        <p className="text-[14px] leading-[22px] text-[#0e0f0c]">{message}</p>
        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-white border border-[#e8ebe6] rounded-full px-6 py-3.5 text-[14px] font-semibold text-[#868685] cursor-pointer hover:bg-[#f7f7f5] transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 rounded-full px-6 py-3.5 text-[14px] font-semibold cursor-pointer transition-colors ${CONFIRM_BUTTON_CLASS[variant]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
