export type EngagementData = {
  date: string;
  likes: number;
  comments: number;
  shares: number;
};

export type ReachData = {
  date: string;
  impressions: number;
  reach: number;
};

export type FollowerData = {
  date: string;
  followers: number;
};

export type SocialAccount = {
  id: "facebook" | "instagram" | "twitter";
  name: string;
  handle: string;
};

export type Priority = "low" | "medium" | "high";
export type Tag = "feature" | "bug" | "docs" | "ui";

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Comment {
  id: string;
  author: User;
  text: string;
  timestamp: string;
  fileUrl?: string;
  fileName?: string;
}
export interface Task {
  id: string;
  columnId: string;
  content: string;
  priority?: Priority;
  tags?: Tag[];
  assignees?: User[];
  createdAt?: string;
  startDate?: string;
  dueDate?: string;
  timeEstimate?: number; // in hours
  comments?: Comment[];
}

export interface Column {
  id: string;
  title: string;
}

export type SocialPlatform = "Facebook" | "Twitter" | "Instagram" | "LinkedIn";
export type MediaType = "image" | "video";
export type EventStatus = "scheduled" | "published" | "draft";

export interface Media {
  url: string;
  type: MediaType;
}

export interface Event {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  platforms: SocialPlatform[];
  description: string;
  status: EventStatus;
  media?: Media[];
}
