"use client";

import { useMemo } from "react";
import Image from "next/image";
import {
  type Event,
  type SocialPlatform,
  type EventStatus,
  type Media,
} from "@/lib/types";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format, parse } from "date-fns";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Calendar,
  Clock,
  Trash2,
  Edit,
  CheckCircle2,
  History,
  Edit3,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

const platformIcons: Record<SocialPlatform, React.ReactNode> = {
  Facebook: <Facebook className="w-4 h-4" />,
  Twitter: <Twitter className="w-4 h-4" />,
  Instagram: <Instagram className="w-4 h-4" />,
  LinkedIn: <Linkedin className="w-4 h-4" />,
};

const statusConfig: Record<
  EventStatus,
  {
    icon: React.ReactNode;
    text: string;
    className: string;
    indicatorClass: string;
  }
> = {
  published: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    text: "Published",
    className: "text-green-600 dark:text-green-400",
    indicatorClass: "bg-green-500",
  },
  scheduled: {
    icon: <History className="w-4 h-4" />,
    text: "Scheduled",
    className: "text-primary",
    indicatorClass: "bg-primary",
  },
  draft: {
    icon: <Edit3 className="w-4 h-4" />,
    text: "Draft",
    className: "text-amber-600 dark:text-amber-400",
    indicatorClass: "bg-amber-500",
  },
};

interface EventDetailsViewProps {
  event: Event;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const MediaPreview = ({ media }: { media: Media }) => {
  if (media.type === "image") {
    return (
      <Image
        width={100}
        height={100}
        src={media.url}
        alt="Media preview"
        className="w-[200px] h-[200px] object-cover rounded-lg"
      />
    );
  }
  if (media.type === "video") {
    return (
      <video
        src={media.url}
        controls
        className="aspect-video w-full object-cover rounded-lg"
      />
    );
  }
  return (
    <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center">
      <p>Unsupported media type</p>
    </div>
  );
};

export default function EventDetailsView({
  event,
  onClose,
  onEdit,
  onDelete,
}: EventDetailsViewProps) {
  const statusInfo = statusConfig[event.status];
  const isPublished = event.status === "published";

  const formattedDate = useMemo(() => {
    if (!event?.date) return "";
    return format(
      parse(event.date, "yyyy-MM-dd", new Date()),
      "EEEE, MMMM d, yyyy"
    );
  }, [event?.date]);

  return (
    <>
      <DialogHeader className="p-6 pb-0">
        <DialogTitle>{event.title}</DialogTitle>
        {statusInfo && (
          <div className="flex items-center gap-2 pt-2">
            <span
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                statusInfo.indicatorClass
              )}
            />
            <span className={cn("font-semibold text-sm", statusInfo.className)}>
              {statusInfo.text}
            </span>
          </div>
        )}
      </DialogHeader>
      <ScrollArea className="grow my-4 px-6 overflow-y-auto">
        <div className="space-y-6">
          {event.media && event.media.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Media
              </h3>
              <Carousel className="w-full max-w-full">
                <CarouselContent>
                  {event.media.map((media, index) => (
                    <CarouselItem key={index} className="pl-2">
                      <div className="p-1">
                        <MediaPreview media={media} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {event.media.length > 1 && (
                  <>
                    <CarouselPrevious className="ml-12" />
                    <CarouselNext className="mr-12" />
                  </>
                )}
              </Carousel>
            </div>
          )}
          <div className="flex items-center flex-wrap gap-2">
            {event.platforms.map((platform) => (
              <div
                key={platform}
                className="flex items-center gap-2 p-2 bg-muted rounded-md text-muted-foreground"
              >
                {platformIcons[platform]}
                <span className="text-sm font-medium">{platform}</span>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-foreground">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-foreground">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>{event.time}</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Content
            </h3>
            <div className="text-sm p-4 bg-muted/50 rounded-md border text-foreground">
              <p className="whitespace-pre-wrap">{event.description}</p>
            </div>
          </div>
        </div>
      </ScrollArea>
      <DialogFooter className="p-6 pt-0 mt-auto">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="mr-auto"
              disabled={isPublished}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                post.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onEdit} disabled={isPublished}>
          <Edit className="mr-2 h-4 w-4" /> Edit Post
        </Button>
      </DialogFooter>
    </>
  );
}
