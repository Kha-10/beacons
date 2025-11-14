"use client";

import { type Event, type SocialPlatform, type EventStatus } from "@/lib/types";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Edit,
  Paperclip,
} from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

const platformIcons: Record<SocialPlatform, React.ReactNode> = {
  Facebook: <Facebook className="w-3.5 h-3.5" />,
  Twitter: <Twitter className="w-3.5 h-3.5" />,
  Instagram: <Instagram className="w-3.5 h-3.5" />,
  LinkedIn: <Linkedin className="w-3.5 h-3.5" />,
};

const statusConfig: Record<
  EventStatus,
  { pillClass: string; timeClass: string }
> = {
  published: {
    pillClass:
      "border-l-4 border-l-green-200 bg-green-200/10 hover:bg-green-500/20",
    timeClass: "text-green-800 dark:text-green-300",
  },
  scheduled: {
    pillClass: "border-l-4 border-l-blue-200 bg-blue-200/10 hover:bg-blue-200/20",
    timeClass: "text-blue-800 dark:text-blue-300",
  },
  draft: {
    pillClass:
      "border-l-4 border-l-amber-200 bg-amber-200/10 hover:bg-amber-500/20",
    timeClass: "text-amber-700 dark:text-amber-300",
  },
};

interface EventPillProps {
  event: Event & { status: EventStatus };
  onClick: () => void;
  onEditClick: () => void;
}

export default function EventPill({
  event,
  onClick,
  onEditClick,
}: EventPillProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", event.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditClick();
  };

  const config: { pillClass: string; timeClass: string } =
    statusConfig[event.status] || statusConfig.scheduled;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
      className={cn(
        "group relative flex items-start gap-2 p-2 rounded-md cursor-pointer transition-colors",
        config.pillClass
      )}
      aria-label={`Event: ${event.title} at ${event.time}`}
    >
      <div className="grow">
        <p className="text-xs font-semibold leading-tight text-foreground">
          <span className={cn("font-bold", config.timeClass)}>
            {event.time}
          </span>{" "}
          — {event.title}
        </p>
        <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
          {event.platforms.map((platform) => (
            <div key={platform}>{platformIcons[platform]}</div>
          ))}
        </div>
      </div>
      {event.mediaUrl && (
        <Paperclip className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
      )}
      <div className="absolute right-1 top-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 group-hover:bg-white rounded transition-opacity">
        <button
          onClick={handleEditClick}
          className="p-1 rounded text-foreground/70 hover:bg-background/50 hover:text-foreground"
          aria-label="Edit post"
        >
          <Edit className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
