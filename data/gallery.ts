export interface JourneyItem {
  id: string;
  title: string;
  meaning: string;
  description: string;
  date: string;
  location: string;
  tag: string;
  photoUrl?: string;
  thumbnail?: string;
  createdAt: number;
}

// Start with empty gallery so only the user's uploaded pictures appear
export const initialJourneyItems: JourneyItem[] = [];
