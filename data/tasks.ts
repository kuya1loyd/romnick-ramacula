export interface Task {
  id: string;
  number: string;
  title: string;
  student: string;
  section: string;
  campus?: string;
  instructor: string;
  category: string;
  subject?: string;
  description: string;
  pdfUrl?: string;
  projectUrl?: string;
  isExternalLink?: boolean;
  previewImage?: string;
  uploadDate: string;
  fileSize?: string;
  highlights?: string[];
  tags: string[];
  featured?: boolean;
  cardColor: {
    bg: string;
    border: string;
    badgeBg: string;
    text: string;
    btnHover: string;
  };
}

export const tasksData: Task[] = [
  {
    id: "zigzag-3d-accordion-classroom",
    number: "01",
    title: "ICT Policies and Issues – 3D Zigzag Accordion Brochure in Classroom",
    student: "Romnick P. Ramacula",
    section: "BEEd-2C",
    campus: "NEMSU - Lianga Campus",
    instructor: "Kerstan Isaac Requiza",
    category: "Interactive 3D Web Application / ICT Project",
    subject: "Technology for Teaching and Learning",
    description:
      "Interactive 3D Accordion Brochure set in a realistic ICT classroom scene showcasing essential ICT policies, educational issues, and collaborative group member contributions.",
    projectUrl: "https://zigzag-nu.vercel.app/",
    isExternalLink: true,
    previewImage: "/tasks/zigzag-preview.png",
    uploadDate: "November 2026",
    highlights: [
      "Realistic 3D classroom scene rendering",
      "Interactive folding zigzag accordion brochure",
      "Exploration of national & educational ICT policies and issues",
      "Active group collaboration and digital presentation",
    ],
    tags: ["3D Web", "ICT Policies", "BEEd-2C", "Interactive", "NEMSU"],
    featured: true,
    cardColor: {
      bg: "bg-[#E0F2FE]", // Pastel Sky Blue
      border: "border-[#7DD3FC]/90",
      badgeBg: "bg-sky-100",
      text: "text-sky-950",
      btnHover: "hover:bg-sky-200",
    },
  },
  {
    id: "ttl-post-presentation-activity",
    number: "02",
    title: "Technology for Teaching and Learning – Post-Presentation Learning Activity Sheet",
    student: "Romnick P. Ramacula",
    section: "BEEd-2C",
    campus: "NEMSU - Lianga Campus",
    instructor: "Kerstan Isaac Requiza",
    category: "School Activity / Learning Activity Sheet",
    subject: "Technology for Teaching and Learning",
    description:
      "This post-presentation learning activity sheet contains my learning log from student-led presentations, synthesis and critical thinking answers, a classroom design challenge, and individual reflection about technology in teaching and learning.",
    pdfUrl: "/tasks/TTL_Post_Presentation_Activity_Sheet.pdf",
    isExternalLink: false,
    previewImage: "/tasks/ttl-activity-sheet-front.png",
    uploadDate: "November 6, 2026",
    fileSize: "223 KB",
    featured: true,
    highlights: [
      "Learning log from student-led presentations",
      "Synthesis and critical thinking evaluations",
      "Interactive 21st-century classroom design challenge",
      "Individual pedagogical & educational tech reflection",
    ],
    tags: ["TTL", "Activity Sheet", "BEEd-2C", "NEMSU", "Pedagogy"],
    cardColor: {
      bg: "bg-[#FFEDD5]", // Warm Peach
      border: "border-[#FDBA74]/90",
      badgeBg: "bg-orange-100",
      text: "text-orange-950",
      btnHover: "hover:bg-orange-200",
    },
  },
];
