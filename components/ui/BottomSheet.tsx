"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

// M3 Motion tokens
const ENTER_DURATION_MS = 350;
const EXIT_DURATION_MS = 200;
const EMPHASIZED_DECELERATE = "cubic-bezier(0.05, 0.7, 0.1, 1.0)";
const EMPHASIZED_ACCELERATE = "cubic-bezier(0.3, 0.0, 0.8, 0.15)";

// Drag dismissal thresholds
const SWIPE_DOWN_THRESHOLD_PX = 100;
const SWIPE_DOWN_VELOCITY_PX_PER_MS = 0.5;

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export const BottomSheet = ({ open, onClose, title, children }: Props) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const startTimeRef = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      const raf = requestAnimationFrame(() => {
        flushSync(() => {
          setShouldRender(true);
          setDragY(0);
        });
        if (sheetRef.current !== null) {
          void sheetRef.current.offsetHeight;
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
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  if (!shouldRender) return null;

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    startYRef.current = e.clientY;
    startTimeRef.current = performance.now();
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dy = e.clientY - startYRef.current;
    setDragY(Math.max(0, dy));
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    const dy = dragY;
    const dt = performance.now() - startTimeRef.current;
    const velocity = dt > 0 ? dy / dt : 0;
    if (
      dy > SWIPE_DOWN_THRESHOLD_PX ||
      velocity > SWIPE_DOWN_VELOCITY_PX_PER_MS
    ) {
      onClose();
      return;
    }
    setDragY(0);
  };

  const duration = isVisible ? ENTER_DURATION_MS : EXIT_DURATION_MS;
  const easing = isVisible ? EMPHASIZED_DECELERATE : EMPHASIZED_ACCELERATE;

  const resolveSheetTransform = (): string => {
    if (!isVisible) return "translateY(100%)";
    if (dragY > 0) return `translateY(${dragY}px)`;
    return "translateY(0)";
  };

  const scrimStyle: React.CSSProperties = {
    transition: `opacity ${duration}ms ${easing}`,
    opacity: isVisible ? 1 : 0,
  };

  const sheetStyle: React.CSSProperties = {
    transition: isDragging ? "none" : `transform ${duration}ms ${easing}`,
    transform: resolveSheetTransform(),
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        onClick={onClose}
        aria-label="閉じる"
        className="absolute inset-0 bg-[rgba(0,0,0,0.5)] cursor-default"
        style={scrimStyle}
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        className="relative bg-white rounded-t-[16px] flex flex-col gap-4 pb-6 px-5 w-full max-w-[765px] mx-auto max-h-[90vh] overflow-hidden"
        style={sheetStyle}
      >
        <div
          className="flex justify-center items-center cursor-grab active:cursor-grabbing select-none touch-none h-7 -mb-1"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="bg-[#e8ebe6] h-1 w-8 rounded-full" />
        </div>
        {title !== undefined ? (
          <div className="flex items-center justify-between w-full">
            <h2 className="text-[18px] font-bold text-[#0e0f0c]">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="閉じる"
              className="w-8 h-8 flex items-center justify-center text-[16px] text-[#0e0f0c] cursor-pointer hover:bg-[#f7f7f5] rounded-full transition-colors"
            >
              ✕
            </button>
          </div>
        ) : null}
        <div className="flex flex-col w-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
