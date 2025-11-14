"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  Wand2,
  Loader2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  X,
} from "lucide-react";
import { getAISuggestionAction } from "@/app/action";
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
  DialogFooter,
  DialogClose,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { CalendarIcon } from "lucide-react";

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
  title: z.string().optional(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format (HH:mm).",
  }),
  platforms: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  description: z.string().min(1, { message: "Content cannot be empty." }),
  aiTopic: z.string().optional(),
});

type NewEventFormValues = z.infer<typeof formSchema>;

interface NewEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: string | null;
  onAddEvent: (event: Omit<Event, "id">) => void;
}

export default function NewEventDialog({
  isOpen,
  onOpenChange,
  selectedDate,
  onAddEvent,
}: NewEventDialogProps) {
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionReason, setSuggestionReason] = useState<string | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [publishMode, setPublishMode] =
    useState<Exclude<EventStatus, "draft">>("scheduled");

  const form = useForm<NewEventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      time: format(new Date(), "HH:mm"),
      platforms: ["Twitter"],
      description: "",
      aiTopic: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      setPublishMode("scheduled");
    }
  }, [isOpen]);

  const resetDialog = () => {
    form.reset({
      title: "",
      time: format(new Date(), "HH:mm"),
      platforms: ["Twitter"],
      description: "",
      aiTopic: "",
    });
    setSuggestionReason(null);
    media.forEach((m) => URL.revokeObjectURL(m.url));
    setMedia([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFormSubmit = async (status: EventStatus) => {
    const isValid = await form.trigger();
    if (!isValid) {
      //   toast({
      //     variant: "destructive",
      //     title: "Incomplete Post",
      //     description: "Please fill out all required fields before posting.",
      //   });
      return;
    }

    if (!selectedDate) return;

    const values = form.getValues();
    const now = new Date();

    const newEvent: Omit<Event, "id"> = {
      date: status === "published" ? format(now, "yyyy-MM-dd") : selectedDate,
      time: status === "published" ? format(now, "HH:mm") : values.time,
      title: values.title || "Untitled Post",
      platforms: values.platforms as SocialPlatform[],
      description: values.description,
      status: status,
      media: media,
    };

    onAddEvent(newEvent);
    resetDialog();
    onOpenChange(false);

    if (status === "published") {
      //   toast({
      //     title: "✅ Post Published!",
      //     description: `Your post "${newEvent.title}" has been published.`,
      //   });
    } else if (status === "scheduled") {
      //   toast({
      //     title: "✅ Post Scheduled!",
      //     description: `Your post "${newEvent.title}" is on the calendar.`,
      //   });
    } else {
      //   toast({
      //     title: "📝 Draft Saved",
      //     description: `Your post "${newEvent.title}" has been saved as a draft.`,
      //   });
    }
  };

  const handleSuggest = async () => {
    const topic = form.getValues("aiTopic");
    if (!topic) {
      form.setError("aiTopic", {
        type: "manual",
        message: "Please enter a topic to get a suggestion.",
      });
      return;
    }

    setIsSuggesting(true);
    setSuggestionReason(null);
    form.clearErrors("aiTopic");

    const result = await getAISuggestionAction(topic);

    if (
      result &&
      !result.error &&
      result.suggestedTime &&
      result.title &&
      result.description
    ) {
      const suggestedDate = new Date(result.suggestedTime);
      form.setValue("title", result.title);
      form.setValue("description", result.description);
      form.setValue("time", format(suggestedDate, "HH:mm"));
      setSuggestionReason(result.reasoning);
      setPublishMode("scheduled"); // Switch to schedule mode when AI suggests a time
    } else {
      //   toast({
      //     variant: "destructive",
      //     title: "AI Suggestion Failed",
      //     description: result.error || "Could not get a suggestion at this time.",
      //   });
    }
    setIsSuggesting(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
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
        URL.revokeObjectURL(mediaToRemove.url);
      }
      return newMedia;
    });
  };

  const handlePublishModeChange = (value: "scheduled" | "published") => {
    if (value) {
      setPublishMode(value);
    }
  };

  if (!selectedDate) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          resetDialog();
        }
      }}
    >
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>New Post</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <ScrollArea className="grow min-h-0">
            <form
              id="new-event-form"
              onSubmit={(e) => e.preventDefault()}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-4"
            >
              {/* Left Column: Content Creation */}
              <div className="flex flex-col gap-4">
                <div className="space-y-2 p-4 bg-muted/50 rounded-lg border">
                  <FormField
                    control={form.control}
                    name="aiTopic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base">
                          <Wand2 className="h-5 w-5 text-primary" />
                          Compose with AI
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., A post about the benefits of morning coffee"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSuggest}
                    disabled={isSuggesting}
                    className="gap-2"
                  >
                    {isSuggesting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="h-4 w-4" />
                    )}
                    Generate Post
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="A catchy title for your post"
                          {...field}
                        />
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
                          placeholder="It's a beautiful day to create..."
                          {...field}
                          className="min-h-[150px] grow text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Media</FormLabel>
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
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {media.map((m) => (
                      <div key={m.url} className="relative group aspect-square">
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

              {/* Right Column: Publishing */}
              <div className="flex flex-col gap-6">
                <div className="p-4 border rounded-lg space-y-4">
                  <h3 className="font-semibold text-lg">Publishing Options</h3>
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
                            new Date(`${selectedDate}T00:00:00`),
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
                                        checked={field.value?.includes(item)}
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
                                      {platformIcons[item as SocialPlatform]}{" "}
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

        <DialogFooter className="p-6 pt-4 mt-auto border-t">
          <div className="flex justify-between w-full">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleFormSubmit("draft")}
              >
                Save Draft
              </Button>
              <Button
                type="button"
                onClick={() => handleFormSubmit(publishMode)}
              >
                {publishMode === "scheduled" && "Schedule Post"}
                {publishMode === "published" && "Post Now"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
