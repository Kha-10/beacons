"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import type { Column, Task, User } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import KanbanTask from "./KanBanTask";
import { Plus, X, MoreHorizontal, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  allUsers: User[];
  updateColumn: (id: string, title: string) => void;
  deleteColumn: (id: string) => void;
  addTask: (columnId: string, content: string) => void;
  updateTask: (id: string, content: string) => void;
  updateTaskDetails: (task: Task) => void;
  deleteTask: (id: string) => void;
  onTaskClick: (task: Task) => void;
}

const columnColors: { [key: string]: string } = {
  todo: "bg-blue-100 dark:bg-blue-900/50",
  inprogress: "bg-yellow-100 dark:bg-yellow-900/50",
  done: "bg-green-100 dark:bg-green-900/50",
};


export default function KanbanColumn({
  column,
  tasks,
  allUsers,
  updateColumn,
  deleteColumn,
  addTask,
  updateTask,
  updateTaskDetails,
  deleteTask,
  onTaskClick,
}: KanbanColumnProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [columnTitle, setColumnTitle] = useState(column.title);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: isEditingTitle,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  useEffect(() => {
    if (isAddingTask && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isAddingTask]);

  const handleTitleBlur = () => {
    if (columnTitle.trim() && columnTitle.trim() !== column.title) {
      updateColumn(column.id, columnTitle.trim());
    } else {
      setColumnTitle(column.title);
    }
    setIsEditingTitle(false);
  };

  const handleAddTask = () => {
    if (!newTaskContent.trim()) return;
    addTask(column.id, newTaskContent.trim());
    setNewTaskContent("");
    setIsAddingTask(false);
  };

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className="w-72 flex-shrink-0">
         <Card className="flex flex-1 flex-col bg-muted/50 border-2 border-primary opacity-50 h-full">
         </Card>
      </div>
    );
  }


  return (
    <div ref={setNodeRef} style={style} className="flex h-full w-72 flex-shrink-0 flex-col">
      <div className="flex h-full flex-col rounded-lg bg-muted/50">
        <CardHeader {...attributes} {...listeners} className="flex flex-row items-center justify-between space-y-0 p-3 cursor-grab rounded-t-lg bg-background">
          <div className="flex items-center gap-2 flex-grow">
            {isEditingTitle ? (
              <Input
                value={columnTitle}
                onChange={(e) => setColumnTitle(e.target.value)}
                onBlur={handleTitleBlur}
                onKeyDown={(e) => e.key === "Enter" && handleTitleBlur()}
                className="h-8"
                autoFocus
              />
            ) : (
              <h2
                onClick={() => setIsEditingTitle(true)}
                className={cn(
                  "cursor-pointer text-base font-semibold px-2 py-1 rounded-md w-full",
                   columnColors[column.id.toLowerCase().replace(" ", "")] || "bg-gray-200 dark:bg-gray-800"
                )}
              >
                {column.title}
              </h2>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => deleteColumn(column.id)} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete list
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3 overflow-y-auto p-3 min-h-0">
           <SortableContext items={tasksIds}>
            {tasks.map((task) => (
              <KanbanTask
                key={task.id}
                task={task}
                allUsers={allUsers}
                updateTask={updateTask}
                updateTaskDetails={updateTaskDetails}
                deleteTask={deleteTask}
                onClick={() => onTaskClick(task)}
              />
            ))}
          </SortableContext>
          <div className="pt-2">
            {isAddingTask ? (
              <div className="w-full space-y-2">
                <Textarea
                  ref={textareaRef}
                  placeholder="Enter a title for this card..."
                  value={newTaskContent}
                  onChange={(e) => setNewTaskContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddTask();
                    }
                  }}
                />
                <div className="flex items-center gap-2">
                  <Button onClick={handleAddTask} size="sm">Add card</Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsAddingTask(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setIsAddingTask(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add a card
              </Button>
            )}
          </div>
        </CardContent>
      </div>
    </div>
  );
}
