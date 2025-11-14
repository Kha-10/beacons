"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  type Event,
  type SocialPlatform,
  type EventStatus,
  type Media,
} from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  X,
  CalendarIcon,
} from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import EventDetailsView from "./EventDetailsView";
import { ScrollArea } from "../ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { format } from "date-fns";

const platforms: SocialPlatform[] = [
  "Facebook",
  "Twitter",
  "Instagram",
  "LinkedIn",
];

const platformIcons: Record<SocialPlatform, React.ReactNode> = {
  Facebook: <Facebook className="w-4 h-4" />,
  Twitter: <Twitter className="w-4 h-4" />,
  Instagram: <Instagram className="w-4 h-4" />,
  LinkedIn: <Linkedin className="w-4 h-4" />,
};

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format (HH:mm).",
  }),
  platforms: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
});

type EditEventFormValues = z.infer<typeof formSchema>;

interface EventDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  onDelete: (eventId: string) => void;
  onUpdate: (
    eventId: string,
    values: Omit<Event, "id" | "date">,
    newStatus?: EventStatus
  ) => void;
}

export default function EventDetailsDialog({
  isOpen,
  onOpenChange,
  event,
  isEditing,
  setIsEditing,
  onDelete,
  onUpdate,
}: EventDetailsDialogProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [publishMode, setPublishMode] =
    useState<Exclude<EventStatus, "draft">>("scheduled");

  const form = useForm<EditEventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: useMemo(
      () => ({
        title: event?.title || "",
        time: event?.time || "",
        platforms: event?.platforms || [],
        description: event?.description || "",
      }),
      [event]
    ),
  });

  useEffect(() => {
    if (event) {
      form.reset({
        title: event.title,
        time: event.time,
        platforms: event.platforms,
        description: event.description,
      });
      // Published posts can't be edited, so their status won't change.
      // For drafts/scheduled, default to 'scheduled' view.
      if (event.status !== "published") {
        setPublishMode("scheduled");
      }
      setMedia(event.media || []);
    }
  }, [event, form, isEditing]);

  if (!event) return null;

  const handleUpdate = (newStatus: EventStatus) => {
    const values = form.getValues();

    const now = new Date();
    const updatedEventData: Omit<Event, "id" | "date"> = {
      ...event,
      ...values,
      platforms: values.platforms as SocialPlatform[],
      media: media,
      // If posting now, override date and time
      date: newStatus === "published" ? format(now, "yyyy-MM-dd") : event.date,
      time: newStatus === "published" ? format(now, "HH:mm") : values.time,
    };

    onUpdate(event.id, updatedEventData, newStatus);
  };

  const handleCloseDialog = (open: boolean) => {
    if (!open) {
      setIsEditing(false);
    }
    onOpenChange(open);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newMedia: Media[] = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("image/") ? "image" : "video",
      }));
      setMedia((prev) => [...prev, ...newMedia]);
    }
  };

  const handleRemoveMedia = (urlToRemove: string) => {
    setMedia((prev) => {
      const newMedia = prev.filter((m) => m.url !== urlToRemove);
      const mediaToRemove = prev.find((m) => m.url === urlToRemove);
      if (mediaToRemove) {
        // If it's a blob URL, revoke it
        if (mediaToRemove.url.startsWith("blob:")) {
          URL.revokeObjectURL(mediaToRemove.url);
        }
      }
      return newMedia;
    });
  };

  const handlePublishModeChange = (value: Exclude<EventStatus, "draft">) => {
    if (value) {
      setPublishMode(value);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        {isEditing ? (
          <>
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>Edit Post</DialogTitle>
              <DialogDescription>
                Modify the details below and save your changes.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <ScrollArea className="grow min-h-0">
                <form
                  id="edit-event-form"
                  onSubmit={(e) => e.preventDefault()}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-4"
                >
                  {/* Left Column: Form */}
                  <div className="flex flex-col gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="grow flex flex-col">
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="min-h-[150px] grow"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormItem>
                      <FormLabel>Media (Image/Video)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleFileChange}
                          className="file:text-foreground"
                          ref={fileInputRef}
                          multiple
                        />
                      </FormControl>
                    </FormItem>
                    {media.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {media.map((m) => (
                          <div
                            key={m.url}
                            className="relative group aspect-square"
                          >
                            {m.type === "image" ? (
                              <Image
                                width={100}
                                height={100}
                                src={m.url}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-md"
                              />
                            ) : (
                              <video
                                src={m.url}
                                className="w-full h-full object-cover rounded-md"
                              />
                            )}
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveMedia(m.url)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Right Column: Media & Status */}
                  <div className="flex flex-col gap-6">
                    <div className="p-4 border rounded-lg space-y-4">
                      <h3 className="font-semibold text-lg">
                        Publishing Options
                      </h3>
                      <ToggleGroup
                        type="single"
                        value={publishMode}
                        onValueChange={handlePublishModeChange}
                        className="grid grid-cols-2"
                      >
                        <ToggleGroupItem value="scheduled">
                          Schedule
                        </ToggleGroupItem>
                        <ToggleGroupItem value="published">
                          Post Now
                        </ToggleGroupItem>
                      </ToggleGroup>

                      {publishMode === "scheduled" && (
                        <>
                          <div className="flex items-center gap-2 p-2 bg-muted rounded-md text-muted-foreground border">
                            <CalendarIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Date:{" "}
                              {format(
                                new Date(`${event.date}T00:00:00`),
                                "MMMM d, yyyy"
                              )}
                            </span>
                          </div>
                          <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Time</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      <FormField
                        control={form.control}
                        name="platforms"
                        render={() => (
                          <FormItem>
                            <div className="mb-2">
                              <FormLabel>Platforms</FormLabel>
                            </div>
                            <div className="space-y-2">
                              {platforms.map((item) => (
                                <FormField
                                  key={item}
                                  control={form.control}
                                  name="platforms"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={item}
                                        className="flex flex-row items-center space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(
                                              item
                                            )}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([
                                                    ...field.value,
                                                    item,
                                                  ])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== item
                                                    )
                                                  );
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal flex items-center gap-2">
                                          {
                                            platformIcons[
                                              item as SocialPlatform
                                            ]
                                          }{" "}
                                          {item}
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </form>
              </ScrollArea>
            </Form>
            <DialogFooter className="p-6 pt-4 border-t mt-auto">
              <div className="flex justify-between w-full">
                <div>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => handleUpdate("draft")}
                  >
                    {event.status === "draft" && publishMode === "scheduled"
                      ? "Update Draft"
                      : "Save as Draft"}
                  </Button>
                  <Button onClick={() => handleUpdate(publishMode)}>
                    {publishMode === "scheduled"
                      ? event.status === "draft"
                        ? "Schedule Post"
                        : "Update Schedule"
                      : "Post Now"}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </>
        ) : (
          <EventDetailsView
            event={event}
            onClose={() => onOpenChange(false)}
            onEdit={() => setIsEditing(true)}
            onDelete={() => onDelete(event.id)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
