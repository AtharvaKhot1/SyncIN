"use client";
import React, { useState, useRef, useEffect } from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconStrikethrough,
  IconHighlight,
  IconList,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconColorSwatch,
  IconTypography,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export function FormattingToolbar() {
  const [fontSize, setFontSize] = useState("16");
  const [fontColor, setFontColor] = useState("#000000");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [highlightColor, setHighlightColor] = useState("#FFFF00");
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("left");
  
  // Popup states
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);
  const [showFontColorPicker, setShowFontColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  
  const fontSizeRef = useRef<HTMLDivElement>(null);
  const fontColorRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fontSizeRef.current && !fontSizeRef.current.contains(event.target as Node)) {
        setShowFontSizePicker(false);
      }
      if (fontColorRef.current && !fontColorRef.current.contains(event.target as Node)) {
        setShowFontColorPicker(false);
      }
      if (highlightRef.current && !highlightRef.current.contains(event.target as Node)) {
        setShowHighlightPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fontSizes = ["8", "10", "12", "14", "16", "18", "20", "24", "28", "32", "36", "48", "72"];
  
  const colorPalette = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
    "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080",
    "#008000", "#FFC0CB", "#A52A2A", "#808080", "#C0C0C0"
  ];

  // Helper function to ensure contentEditable is focused
  const ensureFocus = () => {
    const activeElement = document.activeElement;
    if (!activeElement || activeElement.getAttribute('contenteditable') !== 'true') {
      const contentEditable = document.querySelector('[contenteditable="true"]') as HTMLElement;
      if (contentEditable) {
        contentEditable.focus();
      }
    }
  };

  const formatItems = [
    {
      title: "Font Size",
      icon: (
        <span className="text-xs text-neutral-500 dark:text-neutral-300">{fontSize}px</span>
      ),
      href: "#",
      onClick: () => {
        setShowFontSizePicker(!showFontSizePicker);
        setShowFontColorPicker(false);
        setShowHighlightPicker(false);
      },
    },
    {
      title: "Font Color",
      icon: (
        <div className="relative">
          <IconColorSwatch className="h-4 w-4 text-neutral-500 dark:text-neutral-300" />
          <div 
            className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white"
            style={{ backgroundColor: fontColor }}
          />
        </div>
      ),
      href: "#",
      onClick: () => {
        setShowFontColorPicker(!showFontColorPicker);
        setShowFontSizePicker(false);
        setShowHighlightPicker(false);
      },
    },
    {
      title: "Bold",
      icon: (
        <IconBold className={cn(
          "h-4 w-4",
          isBold ? "text-black dark:text-white" : "text-neutral-500 dark:text-neutral-300"
        )} />
      ),
      href: "#",
      onClick: () => {
        ensureFocus();
        document.execCommand("bold", false);
        setIsBold(!isBold);
      },
    },
    {
      title: "Italic",
      icon: (
        <IconItalic className={cn(
          "h-4 w-4",
          isItalic ? "text-black dark:text-white" : "text-neutral-500 dark:text-neutral-300"
        )} />
      ),
      href: "#",
      onClick: () => {
        ensureFocus();
        document.execCommand("italic", false);
        setIsItalic(!isItalic);
      },
    },
    {
      title: "Underline",
      icon: (
        <IconUnderline className={cn(
          "h-4 w-4",
          isUnderline ? "text-black dark:text-white" : "text-neutral-500 dark:text-neutral-300"
        )} />
      ),
      href: "#",
      onClick: () => {
        ensureFocus();
        document.execCommand("underline", false);
        setIsUnderline(!isUnderline);
      },
    },
    {
      title: "Strikethrough",
      icon: (
        <IconStrikethrough className={cn(
          "h-4 w-4",
          isStrikethrough ? "text-black dark:text-white" : "text-neutral-500 dark:text-neutral-300"
        )} />
      ),
      href: "#",
      onClick: () => {
        ensureFocus();
        document.execCommand("strikeThrough", false);
        setIsStrikethrough(!isStrikethrough);
      },
    },
    {
      title: "Highlight",
      icon: (
        <div className="relative">
          <IconHighlight className="h-4 w-4 text-neutral-500 dark:text-neutral-300" />
          <div 
            className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white"
            style={{ backgroundColor: highlightColor }}
          />
        </div>
      ),
      href: "#",
      onClick: () => {
        setShowHighlightPicker(!showHighlightPicker);
        setShowFontSizePicker(false);
        setShowFontColorPicker(false);
      },
    },
    {
      title: "Bullets",
      icon: (
        <IconList className="h-4 w-4 text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
      onClick: () => {
        const contentEditable = document.querySelector('[contenteditable="true"]') as HTMLElement;
        if (!contentEditable) return;
        
        contentEditable.focus();
        
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
          // No selection, just insert a bullet at cursor
          const ul = document.createElement('ul');
          const li = document.createElement('li');
          li.innerHTML = '<br>';
          ul.appendChild(li);
          
          const range = selection?.getRangeAt(0);
          if (range) {
            range.deleteContents();
            range.insertNode(ul);
            
            // Place cursor inside the li
            const newRange = document.createRange();
            newRange.setStart(li, 0);
            newRange.collapse(true);
            selection?.removeAllRanges();
            selection?.addRange(newRange);
          }
        } else {
          // Try execCommand first
          try {
            document.execCommand('insertUnorderedList', false);
          } catch (e) {
            console.error('Bullet list error:', e);
          }
        }
      },
    },
    {
      title: "Align Left",
      icon: (
        <IconAlignLeft className={cn(
          "h-4 w-4",
          alignment === "left" ? "text-black dark:text-white" : "text-neutral-500 dark:text-neutral-300"
        )} />
      ),
      href: "#",
      onClick: () => {
        ensureFocus();
        document.execCommand("justifyLeft", false);
        setAlignment("left");
      },
    },
    {
      title: "Align Center",
      icon: (
        <IconAlignCenter className={cn(
          "h-4 w-4",
          alignment === "center" ? "text-black dark:text-white" : "text-neutral-500 dark:text-neutral-300"
        )} />
      ),
      href: "#",
      onClick: () => {
        ensureFocus();
        document.execCommand("justifyCenter", false);
        setAlignment("center");
      },
    },
    {
      title: "Align Right",
      icon: (
        <IconAlignRight className={cn(
          "h-4 w-4",
          alignment === "right" ? "text-black dark:text-white" : "text-neutral-500 dark:text-neutral-300"
        )} />
      ),
      href: "#",
      onClick: () => {
        ensureFocus();
        document.execCommand("justifyRight", false);
        setAlignment("right");
      },
    },
  ];

  // Modify items to handle onClick
  const items = formatItems.map(item => ({
    title: item.title,
    icon: item.icon,
    href: item.href,
    onClick: item.onClick,
  }));

  return (
    <div className="flex items-center justify-center w-full mb-4 mt-8 relative">
      <FloatingDock
        items={items}
        desktopClassName="bg-white dark:bg-neutral-800 shadow-lg border border-neutral-200 dark:border-neutral-700"
      />
      
      {/* Font Size Picker */}
      {showFontSizePicker && (
        <div 
          ref={fontSizeRef}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg p-3 z-50"
        >
          <div className="grid grid-cols-5 gap-2">
            {fontSizes.map((size) => (
              <button
                key={size}
                onClick={() => {
                  ensureFocus();
                  setFontSize(size);
                  document.execCommand("fontSize", false, "7");
                  const fontElements = document.getElementsByTagName("font");
                  for (let i = 0; i < fontElements.length; i++) {
                    if (fontElements[i].size === "7") {
                      fontElements[i].removeAttribute("size");
                      fontElements[i].style.fontSize = size + "px";
                    }
                  }
                  setShowFontSizePicker(false);
                }}
                className={cn(
                  "px-3 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors",
                  fontSize === size && "bg-neutral-200 dark:bg-neutral-600"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Font Color Picker */}
      {showFontColorPicker && (
        <div 
          ref={fontColorRef}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg p-3 z-50"
        >
          <div className="grid grid-cols-5 gap-2 mb-3">
            {colorPalette.map((color) => (
              <button
                key={color}
                onClick={() => {
                  ensureFocus();
                  setFontColor(color);
                  document.execCommand("foreColor", false, color);
                  setShowFontColorPicker(false);
                }}
                className="w-8 h-8 rounded border-2 border-neutral-300 dark:border-neutral-600 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <input
            type="color"
            value={fontColor}
            onChange={(e) => {
              ensureFocus();
              setFontColor(e.target.value);
              document.execCommand("foreColor", false, e.target.value);
            }}
            className="w-full h-8 rounded cursor-pointer"
          />
        </div>
      )}
      
      {/* Highlight Color Picker */}
      {showHighlightPicker && (
        <div 
          ref={highlightRef}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg p-3 z-50"
        >
          <div className="grid grid-cols-5 gap-2 mb-3">
            {colorPalette.map((color) => (
              <button
                key={color}
                onClick={() => {
                  ensureFocus();
                  setHighlightColor(color);
                  document.execCommand("backColor", false, color);
                  setShowHighlightPicker(false);
                }}
                className="w-8 h-8 rounded border-2 border-neutral-300 dark:border-neutral-600 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <input
            type="color"
            value={highlightColor}
            onChange={(e) => {
              ensureFocus();
              setHighlightColor(e.target.value);
              document.execCommand("backColor", false, e.target.value);
            }}
            className="w-full h-8 rounded cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}