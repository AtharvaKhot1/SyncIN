"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import { Sidebar, SidebarBody } from "./ui/sidebar";
import {
  IconPlus,
  IconFileText,
  IconArrowsSort,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface PageContextType {
  pageName: string;
  setPageName: (name: string) => void;
  date: string;
  time: string;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export const usePageContext = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePageContext must be used within SidebarDemo2");
  }
  return context;
};

export function SidebarDemo2({children}:Readonly<{children:React.ReactNode}>) {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [currentPageName, setCurrentPageName] = useState("Untitled");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [pages, setPages] = useState<Array<{ id: number; name: string; date: string; time: string }>>([]);
  const [nextPageId, setNextPageId] = useState(1);

  const addNewPage = () => {
    const now = new Date();
    const dateOptions: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const timeOptions: Intl.DateTimeFormatOptions = { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    };
    
    const newPage = {
      id: nextPageId,
      name: `Page ${nextPageId}`,
      date: now.toLocaleDateString('en-US', dateOptions),
      time: now.toLocaleTimeString('en-US', timeOptions)
    };
    
    setPages([...pages, newPage]);
    setNextPageId(nextPageId + 1);
  };

  const selectPage = (page: { id: number; name: string; date: string; time: string }) => {
    setSelectedPage(page.name);
    setCurrentPageName(page.name);
    setCurrentDate(page.date);
    setCurrentTime(page.time);
  };

  useEffect(() => {
    const now = new Date();
    const dateOptions: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const timeOptions: Intl.DateTimeFormatOptions = { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    };
    
    setCurrentDate(now.toLocaleDateString('en-US', dateOptions));
    setCurrentTime(now.toLocaleTimeString('en-US', timeOptions));
  }, []);

  return (
    <PageContext.Provider value={{ pageName: currentPageName, setPageName: setCurrentPageName, date: currentDate, time: currentTime }}>
      <Sidebar open={true} setOpen={() => {}} animate={false} width="200px">
        <SidebarBody className="justify-between gap-10" style={{ backgroundColor: '#BDBDBD' }}>
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <div className="flex items-center gap-2 mb-4 justify-between" >
              <button
                onClick={addNewPage}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors w-auto bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200" style={{ backgroundColor: '#525252' }}
              >
                <IconPlus className="h-5 w-5 shrink-0"  />
                <span>Add Page</span>
              </button>
              <button className="p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700" >
                <IconArrowsSort className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-2">
              <div className="px-3 py-2 rounded-md bg-neutral-200 dark:bg-neutral-700">
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  {currentPageName}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => selectPage(page)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left",
                    selectedPage === page.name
                      ? "bg-neutral-200 dark:bg-neutral-700 font-medium"
                      : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  )}
                >
                  <IconFileText className="h-4 w-4 shrink-0" />
                  <span>{page.name}</span>
                </button>
              ))}
            </div>
          </div>
        </SidebarBody>
        {children}
      </Sidebar>
    </PageContext.Provider>
  );
}

export default SidebarDemo2;

