import { type Event, type Media } from "./types";
import { format, isPast, parse } from "date-fns";

const today = new Date();

const MOCK_DATA: (Omit<Event, "status" | "media"> & {
  mediaUrl?: string;
  mediaType?: "image" | "video";
  media?: Media[];
})[] = [
  {
    id: "1",
    title: "Learn to Dive in Koh Tao",
    date: format(
      new Date(today.getFullYear(), today.getMonth(), 3),
      "yyyy-MM-dd"
    ),
    time: "15:49",
    platforms: ["Instagram"],
    description:
      "Posting a throwback to my amazing diving trip in Thailand! The vibrant coral reefs and marine life were breathtaking. #tbt #travel #diving #kohtao",
    media: [{ url: "https://picsum.photos/seed/1/600/400", type: "image" }],
  },
  {
    id: "2",
    title: "Weekly Team Sync",
    date: format(
      new Date(today.getFullYear(), today.getMonth(), 10),
      "yyyy-MM-dd"
    ),
    time: "10:00",
    platforms: ["LinkedIn"],
    description:
      "Kicking off the week with our team sync. Aligning on goals and pushing projects forward! #teamwork #productivity",
  },
  {
    id: "3",
    title: "New Product Launch Campaign",
    date: format(
      new Date(today.getFullYear(), today.getMonth(), 10),
      "yyyy-MM-dd"
    ),
    time: "14:30",
    platforms: ["Twitter", "Facebook"],
    description:
      "BIG NEWS! Our new product is launching soon. Follow for updates! #productlaunch #innovation",
  },
  {
    id: "4",
    title: "Client Meeting Prep",
    date: format(
      new Date(today.getFullYear(), today.getMonth(), 18),
      "yyyy-MM-dd"
    ),
    time: "09:15",
    platforms: ["Facebook"],
    description:
      "Prepping for a major client presentation. Wish us luck! #business #clientrelations",
  },
  {
    id: "5",
    title: "Yoga Session",
    date: format(
      new Date(today.getFullYear(), today.getMonth(), 18),
      "yyyy-MM-dd"
    ),
    time: "18:00",
    platforms: ["Instagram"],
    description:
      "Ending the day with some relaxing yoga. #wellness #mindfulness",
  },
  {
    id: "6",
    title: 'Blog Post: "Intro to Next.js 15"',
    date: format(
      new Date(today.getFullYear(), today.getMonth(), 18),
      "yyyy-MM-dd"
    ),
    time: "12:00",
    platforms: ["LinkedIn"],
    description:
      "My new blog post is live! A deep dive into the latest features of Next.js 15. Link in bio. #webdev #react #nextjs",
  },
  {
    id: "7",
    title: "Design brainstorming",
    date: format(
      new Date(today.getFullYear(), today.getMonth(), 18),
      "yyyy-MM-dd"
    ),
    time: "16:00",
    platforms: ["Twitter"],
    description:
      "Creative sparks are flying! Brainstorming session for our Q4 campaign visuals. #design #creativity",
    media: [{ url: "https://picsum.photos/seed/2/800/600", type: "image" }],
  },
  {
    id: "8",
    title: "Happy Friday Post!",
    date: format(
      new Date(today.getFullYear(), today.getMonth(), 21),
      "yyyy-MM-dd"
    ),
    time: "17:00",
    platforms: ["Instagram", "Facebook", "Twitter"],
    description:
      "That Friday feeling! Ready for the weekend. What are your plans? #friday #weekendvibes",
  },
  {
    id: "9",
    title: "Q3 Report Draft",
    date: format(
      new Date(today.getFullYear(), today.getMonth() + 1, 5),
      "yyyy-MM-dd"
    ),
    time: "11:00",
    platforms: ["LinkedIn"],
    description:
      "Drafting the Q3 performance report. Lots of great insights to share.",
    status: "draft",
  },
];

export const MOCK_EVENTS: Event[] = MOCK_DATA.map((e) => {
  // Handle old format
  if (e.mediaUrl && !e.media) {
    e.media = [{ url: e.mediaUrl, type: e.mediaType || "image" }];
  }
  delete e.mediaUrl;
  delete e.mediaType;

  if (e.status) return e as Event;

  const eventDate = parse(
    `${e.date}T${e.time}`,
    "yyyy-MM-dd'T'HH:mm",
    new Date()
  );
  const status = isPast(eventDate) ? "published" : "scheduled";
  return { ...e, status } as Event;
});
