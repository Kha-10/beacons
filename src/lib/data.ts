import type { EngagementData, ReachData, FollowerData, SocialAccount } from './types';

export const socialAccounts: SocialAccount[] = [
  { id: 'facebook', name: 'Facebook', handle: 'socialinsights' },
  { id: 'instagram', name: 'Instagram', handle: '@socialinsights' },
  { id: 'twitter', name: 'Twitter', handle: '@socialinsights' },
];

const generateDateRange = (days: number): Date[] => {
  const dates = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date);
  }
  return dates;
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const dates = generateDateRange(90); // Generate more data for wider date ranges

export const engagementData: EngagementData[] = dates.map(date => ({
  date: formatDate(date),
  likes: Math.floor(Math.random() * 500) + 100,
  comments: Math.floor(Math.random() * 100) + 20,
  shares: Math.floor(Math.random() * 50) + 10,
}));

export const reachData: ReachData[] = dates.map(date => ({
  date: formatDate(date),
  impressions: Math.floor(Math.random() * 10000) + 5000,
  reach: Math.floor(Math.random() * 5000) + 2000,
}));

export const followerData: FollowerData[] = dates.map((date, i) => ({
  date: formatDate(date),
  followers: 10000 + i * (Math.random() * 50 + 10) + Math.floor(Math.random() * 100),
}));

export const getSummaryStats = (
  engagement: EngagementData[],
  reach: ReachData[],
  followers: FollowerData[]
) => {
  if (followers.length === 0 && engagement.length === 0 && reach.length === 0) {
    return {
      totalFollowers: { value: '0', change: 0 },
      totalEngagement: { value: '0', change: 0 },
      totalReach: { value: '0', change: 0 },
    };
  }

  const lastFollowers = followers.length > 0 ? followers[followers.length - 1].followers : 0;
  const totalEngagement = engagement.reduce((acc, item) => acc + item.likes + item.comments + item.shares, 0);
  const totalReach = reach.reduce((acc, item) => acc + item.reach, 0);

  // Fake change calculation for demonstration
  const followerChange = Math.random() * 10 - 4;
  const engagementChange = Math.random() * 20 - 10;
  const reachChange = Math.random() * 15 - 7;
  
  return {
    totalFollowers: { value: lastFollowers.toLocaleString(), change: followerChange },
    totalEngagement: { value: totalEngagement.toLocaleString(), change: engagementChange },
    totalReach: { value: totalReach.toLocaleString(), change: reachChange },
  };
};
