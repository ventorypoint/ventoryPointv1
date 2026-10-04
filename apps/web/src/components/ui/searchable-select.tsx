"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  name: string;
  options: Option[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function SearchableSelect({
  name,
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Select Category",
  required = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const currentValue = value !== undefined ? value : internalValue;

  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setMenuStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999
      });
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // If click is inside the trigger OR inside the menu, do nothing
      if (dropdownRef.current?.contains(event.target as Node)) return;
      if (menuRef.current?.contains(event.target as Node)) return;
      
      setIsOpen(false);
    }
    
    function handleScroll(event: Event) {
      if (menuRef.current?.contains(event.target as Node)) return;
      setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isOpen]);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === currentValue);

  const handleSelect = (val: string) => {
    setInternalValue(val);
    if (onChange) onChange(val);
    setIsOpen(false);
    setSearch("");
  };

  const menu = isOpen && typeof document !== "undefined" ? createPortal(
    <div 
      ref={menuRef}
      style={menuStyle}
      className="bg-white dark:bg-zinc-900 border border-border rounded-md shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col"
    >
      <div className="p-2 border-b border-border flex items-center gap-2">
        <Search className="w-4 h-4 text-gray-400" />
        <input 
          type="text"
          placeholder="Search..."
          className="w-full text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 dark:text-gray-100"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />
      </div>
      <div className="max-h-60 overflow-y-auto p-1">
        {filteredOptions.length === 0 ? (
          <div className="px-3 py-3 text-sm text-gray-500 text-center">No results found</div>
        ) : (
          filteredOptions.map((opt) => (
            <div
              key={opt.value}
              className={`px-3 py-2 text-sm rounded-sm cursor-pointer transition-colors ${
                currentValue === opt.value
                  ? "bg-brand/10 text-brand font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
              }`}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </div>
          ))
        )}
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <input type="hidden" name={name} value={currentValue} required={required} />
      
      <div 
        className="flex items-center justify-between w-full px-3 py-2 bg-white dark:bg-black/20 border border-border rounded-md cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? "text-gray-900 dark:text-gray-100 text-sm" : "text-gray-500 dark:text-gray-400 text-sm"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </div>
      {menu}
    </div>
  );
}
