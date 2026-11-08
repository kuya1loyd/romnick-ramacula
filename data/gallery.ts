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
  isLocalFile?: boolean;
  createdAt: number;
}

export const initialJourneyItems: JourneyItem[] = [
  {
    id: "journey-beed-scholar",
    title: "Embracing the Calling as a BEEd-2C Scholar",
    meaning: "Choosing to become an elementary teacher is a promise to build strong foundations for young minds.",
    description: "Beginning my teacher education journey at North Eastern Mindanao State University (NEMSU - Lianga Campus). Every lecture, study session, and discussion strengthens my commitment to foundational literacy, child-centered guidance, and compassionate classroom leadership.",
    date: "Academic Year 2026",
    location: "NEMSU - Lianga Campus",
    tag: "Academic Milestone",
    photoUrl: "/images/profile.jpg",
    createdAt: 1,
  },
  {
    id: "journey-ttl-demonstration",
    title: "Exploring 21st-Century Educational Technologies (TTL)",
    meaning: "Technology is not just a tool—it is a bridge that makes complex ideas accessible and joyful for children.",
    description: "Collaborating with peers and presenting innovative educational media under Instructor Kerstan Isaac Requiza. Crafting interactive visual materials and learning activity sheets designed to elevate elementary pupil engagement in modern digital classrooms.",
    date: "November 2026",
    location: "Lianga, Surigao del Sur",
    tag: "Classroom Experience",
    photoUrl: "/tasks/ttl-activity-sheet-front.png",
    createdAt: 2,
  },
];
