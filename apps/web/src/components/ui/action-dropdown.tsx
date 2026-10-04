"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";

type ActionItem = {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
};

export function ActionDropdown({ actions }: { actions: ActionItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    
    function updatePosition() {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        // Position below and align right edge
        setPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.right + window.scrollX - 160 // 160 is w-40 (10rem)
        });
      }
    }
    
    if (isOpen) {
      updatePosition();
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  const dropdownMenu = isOpen ? (
    <div 
      ref={dropdownRef}
      className="fixed w-40 bg-white dark:bg-zinc-900 border border-border rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[9999] py-1 animate-in fade-in zoom-in-95 duration-100"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
            action.onClick();
          }}
          className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 cursor-pointer transition-colors ${
            action.danger 
              ? "text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10" 
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
          }`}
        >
          {action.icon}
          {action.label}
        </button>
      ))}
    </div>
  ) : null;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-gray-100 dark:hover:bg-white/10 rounded-md transition-colors cursor-pointer inline-flex"
        aria-label="Options"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && typeof document !== "undefined" 
        ? createPortal(dropdownMenu, document.body) 
        : null}
    </>
  );
}
