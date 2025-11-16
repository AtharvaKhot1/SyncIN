// export default function Home( ) {
// return(
// <main className="">
// <h1 className="text-2xl text-center">Chai aur code</h1>
// </main>
// );
// }


"use client";
import { useRef, useEffect, useState } from "react";
import SidebarDemo from "@/components/Sidebaar";
import SidebarDemo2, { usePageContext } from "@/components/Sidebar2";
import { FormattingToolbar } from "@/components/ui/floating-duck";
import { cn } from "@/lib/utils";

function ContentArea() {
  const { pageName, setPageName, date, time } = usePageContext();
  const isUntitled = pageName === "Untitled" || pageName.trim() === "";
  const measureRef = useRef<HTMLSpanElement>(null);
  const dateTimeRef = useRef<HTMLSpanElement>(null);
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const [dateTimeWidth, setDateTimeWidth] = useState(0);
  const displayText = pageName || "Untitled";
  const dateTimeText = date && time ? `${date} ${time}` : "";

  useEffect(() => {
    if (measureRef.current) {
      setUnderlineWidth(measureRef.current.offsetWidth);
    }
    if (dateTimeRef.current) {
      setDateTimeWidth(dateTimeRef.current.offsetWidth);
    }
  }, [pageName, date, time]);

  const finalUnderlineWidth = Math.max(underlineWidth, dateTimeWidth || 0);

  return (
    <div className="flex flex-1 flex-col bg-white w-full h-full p-8">
      <FormattingToolbar />
      <div className="mb-6 mt-4">
        <div className="mb-2 relative inline-block">
          {/* Hidden span to measure text width */}
          <span
            ref={measureRef}
            className="text-4xl font-normal invisible absolute whitespace-pre"
            aria-hidden="true"
          >
            {displayText}
          </span>
          {/* Hidden span to measure date/time width */}
          {dateTimeText && (
            <span
              ref={dateTimeRef}
              className="text-sm text-neutral-500 invisible absolute whitespace-pre"
              aria-hidden="true"
            >
              {dateTimeText}
            </span>
          )}
          {/* Input field */}
          <input
            type="text"
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
            className={cn(
              "text-4xl font-normal bg-transparent border-none outline-none relative z-10",
              isUntitled ? "text-neutral-400" : "text-neutral-900"
            )}
            placeholder="Untitled"
            style={{ width: `${Math.max(finalUnderlineWidth || 200, 200)}px` }}
          />
          {/* Underline that matches text width */}
          <div
            className="border-b border-neutral-300 absolute bottom-0"
            style={{ width: `${Math.max(finalUnderlineWidth || 200, 200)}px` }}
          />
        </div>
        {date && time && (
          <div className="text-sm text-neutral-500 mt-2">
            {date} <span className="ml-2">{time}</span>
          </div>
        )}
      </div>
      <div className="flex-1">
        <div
          contentEditable="true"
          suppressContentEditableWarning
          className="w-full h-full outline-none p-4 text-neutral-900 dark:text-neutral-100"
          style={{ minHeight: "200px" }}
        >
          {/* Writing space */}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
return (
<div
  className={cn(
    "mx-auto flex w-full max-w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
    "h-dvh"
  )}
>
  <SidebarDemo>
    <SidebarDemo2>
      <ContentArea />
    </SidebarDemo2>
  </SidebarDemo>
</div>
);
}
