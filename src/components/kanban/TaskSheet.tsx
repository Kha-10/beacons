"use client";

import { useState, useEffect } from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar as CalendarIcon,
  Clock,
  Paperclip,
  Send,
  TagIcon,
  ChevronsUp,
  ChevronUp,
  ChevronDown,
  X,
  Users,
  Activity,
  Text,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  Task,
  Column,
  Priority,
  Tag as TagType,
  Comment,
  User as UserType,
} from "@/lib/types";
import { users } from "@/lib/taskData";
import { Separator } from "@/components/ui/separator";
import { MultiSelect } from "@/components/ui/multi-select";

interface TaskSheetProps {
  task: Task | null;
  columns: Column[];
  onOpenChange: (isOpen: boolean) => void;
  onUpdateTask: (task: Task) => void;
}

const priorityMap: {
  [key in Priority]: { label: string; icon: React.ReactNode };
} = {
  high: {
    label: "High",
    icon: <ChevronsUp className="h-4 w-4 text-red-500" />,
  },
  medium: {
    label: "Medium",
    icon: <ChevronUp className="h-4 w-4 text-yellow-500" />,
  },
  low: {
    label: "Low",
    icon: <ChevronDown className="h-4 w-4 text-gray-500" />,
  },
};

const initialTags: TagType[] = ["feature", "bug", "docs", "ui"];
const allUsers: UserType[] = users;

export default function TaskSheet({
  task,
  columns,
  onOpenChange,
  onUpdateTask,
}: TaskSheetProps) {
  const [editedTask, setEditedTask] = useState<Task | null>(task);
  const [newComment, setNewComment] = useState("");
  const [newAttachment, setNewAttachment] = useState<File | null>(null);
  const [availableTags, setAvailableTags] = useState<TagType[]>(initialTags);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  if (!task || !editedTask) return null;

  const handleUpdate = <K extends keyof Task>(field: K, value: Task[K]) => {
    const updatedTask = { ...editedTask, [field]: value };
    setEditedTask(updatedTask);
    onUpdateTask(updatedTask);
  };

  const handleAssigneeToggle = (userId: string) => {
    const currentAssignees = editedTask.assignees || [];
    const user = allUsers.find((u) => u.id === userId);
    if (!user) return;

    let newAssignees;
    if (currentAssignees.some((a) => a.id === userId)) {
      newAssignees = currentAssignees.filter((a) => a.id !== userId);
    } else {
      newAssignees = [...currentAssignees, user];
    }
    handleUpdate("assignees", newAssignees);
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim() && !newAttachment) return;

    const newCommentObj: Comment = {
      id: `c${Date.now()}`,
      author: allUsers[0], // Assuming current user is the first user for now
      text: newComment.trim(),
      timestamp: new Date().toISOString(),
      fileUrl: newAttachment ? URL.createObjectURL(newAttachment) : undefined,
      fileName: newAttachment ? newAttachment.name : undefined,
    };

    const updatedComments = [...(editedTask.comments || []), newCommentObj];
    handleUpdate("comments", updatedComments);
    setNewComment("");
    setNewAttachment(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewAttachment(e.target.files[0]);
    }
  };

  const currentColumn = columns.find((c) => c.id === editedTask.columnId);

  const handleCreateTag = (newTag: string) => {
    setAvailableTags((prev) => [...prev, newTag as TagType]);
  };

  return (
    <Sheet open={!!task} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
        <div className="p-6">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold">
              {editedTask.content}
            </SheetTitle>
            <SheetDescription>
              In list{" "}
              <span className="font-semibold text-foreground">
                {currentColumn?.title}
              </span>
              {editedTask.createdAt && (
                <span>
                  {" "}
                  · Created{" "}
                  {formatDistanceToNow(new Date(editedTask.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              )}
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex flex-col space-y-6 p-6 border-t">
          <div className="space-y-4">
            <Label className="text-sm font-semibold text-foreground flex items-center">
              <Text className="mr-2 h-4 w-4" /> Description
            </Label>
            <Textarea
              value={editedTask.content}
              onChange={(e) => handleUpdate("content", e.target.value)}
              placeholder="Add a more detailed description..."
              className="mt-2 min-h-[100px] bg-muted"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Details</h3>
            <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <Label className="text-muted-foreground">Status</Label>
                <Select
                  value={editedTask.columnId}
                  onValueChange={(value) => handleUpdate("columnId", value)}
                >
                  <SelectTrigger className="w-48 h-8 text-sm">
                    <SelectValue placeholder="Set status" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map((col) => (
                      <SelectItem key={col.id} value={col.id}>
                        {col.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-muted-foreground">Priority</Label>
                <Select
                  value={editedTask.priority}
                  onValueChange={(value: Priority) =>
                    handleUpdate("priority", value)
                  }
                >
                  <SelectTrigger className="w-48 h-8 text-sm">
                    <SelectValue placeholder="Set priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityMap).map(
                      ([key, { label, icon }]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            {icon}
                            <span>{label}</span>
                          </div>
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-muted-foreground flex items-center">
                  <Users className="mr-2 h-4 w-4" /> Assignees
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-48 h-8 text-sm justify-start text-left font-normal"
                    >
                      <div className="flex items-center grow -space-x-2 overflow-hidden">
                        {editedTask.assignees?.length ? (
                          editedTask.assignees.map((a) => (
                            <Avatar
                              key={a.id}
                              className="h-6 w-6 border-2 border-background"
                            >
                              <AvatarImage src={a.avatar} alt={a.name} />
                              <AvatarFallback>
                                {a.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ))
                        ) : (
                          <span className="text-muted-foreground">Add...</span>
                        )}
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-64">
                    <div className="p-2 font-semibold text-sm border-b">
                      Assign to
                    </div>
                    <div className="max-h-48 overflow-y-auto p-1">
                      {allUsers.map((user) => {
                        const isAssigned =
                          task.assignees?.some((a) => a.id === user.id) ||
                          false;
                        return (
                          <div
                            key={user.id}
                            className="flex items-center p-2 hover:bg-accent rounded-md cursor-pointer"
                            onClick={() => handleAssigneeToggle(user.id)}
                            onTouchEnd={() => handleAssigneeToggle(user.id)}
                          >
                            <Avatar className="h-7 w-7 mr-3">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium flex-1">
                              {user.name}
                            </span>
                            {isAssigned && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-muted-foreground flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" /> Start Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-48 h-8 text-sm justify-start text-left font-normal",
                        !editedTask.startDate && "text-muted-foreground"
                      )}
                    >
                      {editedTask.startDate
                        ? format(new Date(editedTask.startDate), "MMM d, yyyy")
                        : "Set date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        editedTask.startDate
                          ? new Date(editedTask.startDate)
                          : undefined
                      }
                      onSelect={(date) =>
                        handleUpdate("startDate", date?.toISOString())
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-muted-foreground flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" /> Due Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-48 h-8 text-sm justify-start text-left font-normal",
                        !editedTask.dueDate && "text-muted-foreground"
                      )}
                    >
                      {editedTask.dueDate
                        ? format(new Date(editedTask.dueDate), "MMM d, yyyy")
                        : "Set date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        editedTask.dueDate
                          ? new Date(editedTask.dueDate)
                          : undefined
                      }
                      onSelect={(date) =>
                        handleUpdate("dueDate", date?.toISOString())
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-muted-foreground flex items-center">
                  <Clock className="mr-2 h-4 w-4" /> Estimate
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={editedTask.timeEstimate || ""}
                    onChange={(e) =>
                      handleUpdate("timeEstimate", Number(e.target.value))
                    }
                    placeholder="0"
                    className="h-8 w-20 text-right"
                  />
                  <span className="text-muted-foreground text-sm">hours</span>
                </div>
              </div>

              <div className="flex items-start justify-between">
                <Label className="text-muted-foreground mt-1.5 flex items-center">
                  <TagIcon className="mr-2 h-4 w-4" /> Tags
                </Label>
                <div className="w-48">
                  <MultiSelect
                    options={availableTags.map((tag) => ({
                      value: tag,
                      label: tag,
                    }))}
                    selected={editedTask.tags || []}
                    onChange={(selected) =>
                      handleUpdate("tags", selected as TagType[])
                    }
                    onCreate={handleCreateTag}
                    placeholder="Add tags..."
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="text-sm font-semibold text-foreground flex items-center">
              <Activity className="mr-2 h-4 w-4" /> Activity
            </Label>

            <div className="relative">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="pr-24 bg-muted"
              />
              <div className="absolute right-2 top-2 flex items-center gap-1">
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Label htmlFor="file-upload">
                    <Paperclip className="h-5 w-5" />
                  </Label>
                </Button>
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  size="icon"
                  onClick={handleCommentSubmit}
                  disabled={!newComment.trim() && !newAttachment}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
            {newAttachment && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 bg-muted rounded-md">
                <Paperclip className="h-4 w-4" />
                <span>{newAttachment.name}</span>
                <button
                  onClick={() => setNewAttachment(null)}
                  className="ml-auto"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="space-y-6">
              {editedTask.comments
                ?.slice()
                .reverse()
                .map((comment) => (
                  <div key={comment.id} className="flex items-start gap-4">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={comment.author.avatar}
                        alt={comment.author.name}
                      />
                      <AvatarFallback>
                        {comment.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                          {comment.author.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.timestamp), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <div className="mt-1 prose prose-sm text-foreground max-w-none">
                        {comment.text && <p>{comment.text}</p>}
                        {comment.fileUrl && (
                          <a
                            href={comment.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 flex items-center gap-2 text-sm text-primary hover:underline p-2 bg-muted rounded-md w-fit"
                          >
                            <Paperclip className="h-4 w-4" />
                            <span>{comment.fileName || "Attachment"}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
