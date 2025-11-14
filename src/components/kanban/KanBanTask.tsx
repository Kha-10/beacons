
"use client";

import { useState, useRef, useEffect } from "react";
import type { Task, Priority, User } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  ExternalLink,
  MessageSquare,
  Clock,
  CalendarDays,
  ChevronsUp,
  ChevronUp,
  ChevronDown,
  Plus,
  Check,
} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface KanbanTaskProps {
  task: Task;
  allUsers: User[];
  updateTask: (id: string, content: string) => void;
  updateTaskDetails: (task: Task) => void;
  deleteTask: (id: string) => void;
  onClick: () => void;
}

const priorityMap: { [key in Priority]: { label: string; icon: React.ReactNode; className: string } } = {
  high: { label: "High", icon: <ChevronsUp className="h-4 w-4" />, className: "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30" },
  medium: { label: "Medium", icon: <ChevronUp className="h-4 w-4" />, className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30" },
  low: { label: "Low", icon: <ChevronDown className="h-4 w-4" />, className: "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30" },
};

const MAX_DISPLAY_ASSIGNEES = 3;

export default function KanbanTask({
  task,
  allUsers,
  updateTask,
  updateTaskDetails,
  deleteTask,
  onClick,
}: KanbanTaskProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [taskContent, setTaskContent] = useState(task.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: isEditing,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);
  
  useEffect(() => {
    if (!isEditing) {
        setTaskContent(task.content);
    }
  }, [task.content, isEditing]);


  const handleUpdate = () => {
    if (taskContent.trim() && taskContent.trim() !== task.content) {
      updateTask(task.id, taskContent);
    } else {
      setTaskContent(task.content);
    }
    setIsEditing(false);
  };
  
  const handleDetailUpdate = <K extends keyof Task>(field: K, value: Task[K]) => {
    const updatedTask = { ...task, [field]: value };
    updateTaskDetails(updatedTask);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUpdate();
    }
    if (e.key === "Escape") {
      setTaskContent(task.content);
      setIsEditing(false);
    }
  };
  
  const handleAssigneeToggle = (userId: string) => {
    const currentAssignees = task.assignees || [];
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;

    let newAssignees;
    if (currentAssignees.some(a => a.id === userId)) {
      newAssignees = currentAssignees.filter(a => a.id !== userId);
    } else {
      newAssignees = [...currentAssignees, user];
    }
    handleDetailUpdate("assignees", newAssignees);
  };


  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="group relative bg-card hover:bg-muted/80 p-3 opacity-50 border-2 border-primary h-20 w-full"
      />
    );
  }
  
  const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => e.stopPropagation();
  
  const displayedAssignees = task.assignees?.slice(0, MAX_DISPLAY_ASSIGNEES) || [];
  const hiddenAssigneesCount = (task.assignees?.length || 0) - displayedAssignees.length;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative bg-card hover:bg-muted/80 touch-none"
    >
      <CardContent
        className="p-3"
        onDoubleClick={(e) => {
            stopPropagation(e);
            setIsEditing(true);
        }}
      >
        <div className="absolute right-1 top-1 z-10 flex items-center gap-1 rounded-md bg-card/60 p-0.5 backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">Open details</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task.id);
            }}
             onTouchEnd={(e) => {
              e.stopPropagation();
              deleteTask(task.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete task</span>
          </Button>
        </div>

        {isEditing ? (
          <Textarea
            ref={textareaRef}
            value={taskContent}
            onChange={(e) => setTaskContent(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={handleKeyDown}
            className="w-full resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            onClick={stopPropagation}
          />
        ) : (
          <p className="whitespace-pre-wrap text-sm">{task.content}</p>
        )}
        
        <div className="mt-3 flex flex-col gap-2">
           <div className="flex items-center justify-between text-sm text-muted-foreground">
             <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild onClick={stopPropagation} onTouchEnd={stopPropagation}>
                   <Badge variant="outline" className={cn("capitalize cursor-pointer", task.priority && priorityMap[task.priority].className)}>
                    {task.priority ? priorityMap[task.priority].label : "No priority"}
                  </Badge>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-1" onClick={stopPropagation} onTouchEnd={stopPropagation}>
                   {(["high", "medium", "low"] as Priority[]).map((p) => (
                      <Button key={p} variant="ghost" size="sm" className="w-full justify-start" onClick={() => handleDetailUpdate("priority", p)}>
                        <span className={cn(priorityMap[p].className, "mr-2")}>{priorityMap[p].icon}</span>
                        {priorityMap[p].label}
                      </Button>
                    ))}
                     <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => handleDetailUpdate("priority", undefined)}>
                        No priority
                      </Button>
                </PopoverContent>
              </Popover>
            </div>
             <Popover>
                <PopoverTrigger asChild onClick={stopPropagation} onTouchEnd={stopPropagation}>
                  <Button variant="ghost" size="sm" className={cn("flex items-center gap-1 h-auto px-2 py-0.5 text-xs", !task.dueDate && "text-muted-foreground")}>
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>{task.dueDate ? format(new Date(task.dueDate), "MMM d") : "No date"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" onClick={stopPropagation} onTouchEnd={stopPropagation}>
                  <Calendar
                    mode="single"
                    selected={task.dueDate ? new Date(task.dueDate) : undefined}
                    onSelect={(date) => handleDetailUpdate("dueDate", date?.toISOString())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
          </div>
          
          <div className="flex items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
             <Popover>
                <PopoverTrigger asChild onClick={stopPropagation} onTouchEnd={stopPropagation}>
                  <Button variant="ghost" size="sm" className="-ml-2 flex items-center gap-1 h-auto px-2 py-0.5 text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{task.timeEstimate != null ? `${task.timeEstimate}h` : "Estimate"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2" onClick={stopPropagation} onTouchEnd={stopPropagation}>
                  <label htmlFor={`estimate-${task.id}`} className="text-xs font-medium">Set estimate (hours)</label>
                  <Input
                    id={`estimate-${task.id}`}
                    type="number"
                    value={task.timeEstimate || ""}
                    onChange={(e) => handleDetailUpdate("timeEstimate", e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="0"
                    className="h-8 w-full mt-1"
                  />
                </PopoverContent>
              </Popover>
              
              <Popover>
                 <PopoverTrigger asChild onClick={stopPropagation} onTouchEnd={stopPropagation}>
                   <Button variant="ghost" size="sm" className="flex items-center gap-1 h-auto px-2 py-0.5 text-xs">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{task.comments?.length || 0}</span>
                    </Button>
                 </PopoverTrigger>
                 <PopoverContent className="w-64" onClick={stopPropagation} onTouchEnd={stopPropagation}>
                   <div className="space-y-4">
                      <h4 className="font-medium text-sm text-foreground">Comments</h4>
                      <div className="space-y-4 max-h-48 overflow-y-auto">
                        {task.comments?.length ? task.comments.slice().reverse().map(comment => (
                          <div key={comment.id} className="flex items-start gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                              <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-xs">
                              <p className="text-foreground">
                                <span className="font-semibold">{comment.author.name}</span>
                                <span className="text-muted-foreground ml-2">{formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}</span>
                              </p>
                              <p className="text-muted-foreground">{comment.text}</p>
                            </div>
                          </div>
                        )) : <p className="text-xs text-muted-foreground">No comments yet.</p>}
                      </div>
                   </div>
                 </PopoverContent>
              </Popover>

              <div className="flex flex-1 justify-end" onClick={stopPropagation} onTouchEnd={stopPropagation}>
                <Popover>
                  <PopoverTrigger asChild>
                     <Button variant="ghost" size="icon" className="h-8 w-auto px-0 -my-2">
                        <div className="flex items-center -space-x-2">
                          {displayedAssignees.length > 0 ? (
                            <>
                              {displayedAssignees.map(assignee => (
                                <Avatar key={assignee.id} className="h-6 w-6 border-2 border-card">
                                  <AvatarImage src={assignee.avatar} alt={assignee.name} />
                                  <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                              ))}
                              {hiddenAssigneesCount > 0 && (
                                <div className="h-6 w-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-semibold">
                                  +{hiddenAssigneesCount}
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="h-6 w-6 rounded-full bg-muted border-2 border-dashed flex items-center justify-center">
                              <Plus className="h-3 w-3"/>
                            </div>
                          )}
                        </div>
                     </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-64">
                     <div className="p-2 font-semibold text-sm border-b">Assign to</div>
                     <div className="max-h-48 overflow-y-auto p-1">
                      {allUsers.map((user) => {
                        const isAssigned = task.assignees?.some(a => a.id === user.id) || false;
                        return (
                          <div 
                            key={user.id} 
                            className="flex items-center p-2 hover:bg-accent rounded-md cursor-pointer" 
                            onClick={() => handleAssigneeToggle(user.id)} 
                            onTouchEnd={() => handleAssigneeToggle(user.id)}
                          >
                            <Avatar className="h-7 w-7 mr-3">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium flex-1">{user.name}</span>
                            {isAssigned && <Check className="h-4 w-4 text-primary" />}
                          </div>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}