"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Sidebar, SidebarBody } from "./ui/sidebar";
import {
  IconPlus,
  IconTrash,
  IconChevronDown,
  IconChevronRight,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
 
export function SidebarDemo({children}:Readonly<{children:React.ReactNode}>) {
  const [open, setOpen] = useState(false);
  const [notebooks, setNotebooks] = useState<Array<{
    id: number;
    name: string;
    color: string;
    expanded: boolean;
    sections: Array<{ id: number; name: string; active?: boolean }>;
  }>>([]);
  const [expandedNotebooks, setExpandedNotebooks] = useState<number[]>([]);
  const [nextNotebookId, setNextNotebookId] = useState(1);
  const [nextSectionId, setNextSectionId] = useState(1);
  const [editingNotebook, setEditingNotebook] = useState<number | null>(null);
  const [editingSection, setEditingSection] = useState<number | null>(null);
  const [showColorPicker, setShowColorPicker] = useState<number | null>(null);

  const colors = ["purple", "yellow", "orange", "blue", "green", "red", "pink"];

  const addNotebook = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newNotebook = {
      id: nextNotebookId,
      name: `Notebook ${nextNotebookId}`,
      color: randomColor,
      expanded: false,
      sections: []
    };
    setNotebooks([...notebooks, newNotebook]);
    setNextNotebookId(nextNotebookId + 1);
  };

  const addSection = (notebookId: number) => {
    setNotebooks(notebooks.map(notebook => {
      if (notebook.id === notebookId) {
        return {
          ...notebook,
          sections: [...notebook.sections, {
            id: nextSectionId,
            name: `Section ${nextSectionId}`
          }]
        };
      }
      return notebook;
    }));
    setNextSectionId(nextSectionId + 1);
  };

  const renameNotebook = (id: number, newName: string) => {
    setNotebooks(notebooks.map(notebook => 
      notebook.id === id ? { ...notebook, name: newName } : notebook
    ));
    setEditingNotebook(null);
  };

  const changeNotebookColor = (id: number, newColor: string) => {
    setNotebooks(notebooks.map(notebook => 
      notebook.id === id ? { ...notebook, color: newColor } : notebook
    ));
    setShowColorPicker(null);
  };

  const renameSection = (notebookId: number, sectionId: number, newName: string) => {
    setNotebooks(notebooks.map(notebook => {
      if (notebook.id === notebookId) {
        return {
          ...notebook,
          sections: notebook.sections.map(section =>
            section.id === sectionId ? { ...section, name: newName } : section
          )
        };
      }
      return notebook;
    }));
    setEditingSection(null);
  };

  const toggleNotebook = (id: number) => {
    setExpandedNotebooks(prev => 
      prev.includes(id) 
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      purple: "bg-purple-500",
      yellow: "bg-yellow-500",
      orange: "bg-orange-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      red: "bg-red-500",
      pink: "bg-pink-500",
    };
    return colors[color] || "bg-neutral-500";
  };

  return (
    <>
      <Sidebar open={open} setOpen={setOpen} width="200px">
        <SidebarBody className="justify-between gap-10" style={{ backgroundColor: '#535555' }}>
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            
            {/* Create Notebook Button */}
            <button
              onClick={addNotebook}
              className={cn(
                "mt-4 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                "text-neutral-700 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-700",
                open ? "w-full justify-start" : "w-10"
              )}
            >
              <IconPlus className="h-5 w-5 shrink-0" />
              {open && <span>New Notebook</span>}
            </button>

            {/* Notebooks List */}
            <div className="mt-4 flex flex-col gap-1">
              {notebooks.map((notebook) => (
                <div key={notebook.id} className="relative">
                  <div className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-neutral-700 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-700",
                    !open && "justify-center"
                  )}>
                    <button
                      onClick={() => toggleNotebook(notebook.id)}
                      className="flex items-center justify-center shrink-0"
                    >
                      {expandedNotebooks.includes(notebook.id) ? (
                        <IconChevronDown className="h-4 w-4 shrink-0" />
                      ) : (
                        <IconChevronRight className="h-4 w-4 shrink-0" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowColorPicker(showColorPicker === notebook.id ? null : notebook.id);
                      }}
                      className="flex items-center justify-center shrink-0"
                    >
                      <div className={cn("h-4 w-4 shrink-0 rounded cursor-pointer hover:scale-110 transition-transform", getColorClass(notebook.color))} />
                    </button>
                    {open && (
                      editingNotebook === notebook.id ? (
                        <input
                          type="text"
                          defaultValue={notebook.name}
                          onBlur={(e) => renameNotebook(notebook.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              renameNotebook(notebook.id, e.currentTarget.value);
                            }
                          }}
                          autoFocus
                          className="flex-1 bg-transparent border-b border-neutral-400 outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span 
                          className="flex-1 text-left cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingNotebook(notebook.id);
                          }}
                        >
                          {notebook.name}
                        </span>
                      )
                    )}
                  </div>
                  
                  {/* Color Picker */}
                  {showColorPicker === notebook.id && open && (
                    <div className="ml-6 mt-1 mb-2 p-2 bg-neutral-100 dark:bg-neutral-700 rounded-md">
                      <div className="flex gap-2 flex-wrap">
                        {colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => changeNotebookColor(notebook.id, color)}
                            className={cn(
                              "h-6 w-6 rounded border-2 hover:scale-110 transition-transform",
                              getColorClass(color),
                              notebook.color === color ? "border-white" : "border-transparent"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Sections */}
                  {expandedNotebooks.includes(notebook.id) && open && notebook.sections && (
                    <div className="ml-6 mt-1 flex flex-col gap-1">
                      {notebook.sections.map((section) => (
                        <div
                          key={section.id}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                            section.active 
                              ? "bg-neutral-200 dark:bg-neutral-700" 
                              : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                          )}
                        >
                          <div className="h-4 w-1 bg-blue-500 rounded" />
                          {editingSection === section.id ? (
                            <input
                              type="text"
                              defaultValue={section.name}
                              onBlur={(e) => renameSection(notebook.id, section.id, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  renameSection(notebook.id, section.id, e.currentTarget.value);
                                }
                              }}
                              autoFocus
                              className="flex-1 bg-transparent border-b border-neutral-400 outline-none"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span 
                              className="flex-1 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingSection(section.id);
                              }}
                            >
                              {section.name}
                            </span>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addSection(notebook.id)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                          "text-neutral-500 hover:bg-neutral-100 dark:text-neutral-500 dark:hover:bg-neutral-800"
                        )}
                      >
                        <IconPlus className="h-4 w-4 shrink-0" />
                        <span>New Section</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Trash Bin */}
          <div className="flex flex-col gap-2">
            <Link
              href="/trash"
              className={cn(
                "group flex items-center justify-start gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                "text-neutral-700 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-700",
                "w-10 hover:w-24 transition-all duration-300 overflow-hidden"
              )}
            >
              <IconTrash className="h-5 w-5 shrink-0" />
              <span className="whitespace-pre opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Trash
              </span>
            </Link>
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </>
  );
}
export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-white dark:text-white"
      >
        SyncIN
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};

export default SidebarDemo;

// Dummy dashboard component with content
const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex gap-2">
          {[...new Array(4)].map((i, idx) => (
            <div
              key={"first-array-demo-1" + idx}
              className="h-20 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
            ></div>
          ))}
        </div>
        <div className="flex flex-1 gap-2">
          {[...new Array(2)].map((i, idx) => (
            <div
              key={"second-array-demo-1" + idx}
              className="h-full w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};