export type CouncilId = 
  | 'technical_council'
  | 'sports_council'
  | 'media_council'
  | 'cultural_council'
  | 'literary_council'
  | 'hobby_council'
  | 'fine_arts_council';

export interface CouncilMember {
  id: string;
  name: string;
  role: string;
  year?: 1 | 2 | 3 | 4;
  branch?: string;
  rollNo?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  instagramUrl?: string;
}

export interface FacultyConvener {
  facultyId?: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  cabinRoom?: string;
}

export interface CouncilLeadership {
  // Tier 1: Faculty Coordinator / Convener
  convener: FacultyConvener;
  conveners?: FacultyConvener[];
  // Tier 2: Council Heads (4th Year Final Year Students)
  head: CouncilMember;
  heads?: CouncilMember[];
  // Tier 3: General Secretaries (4th Year Students)
  secretary: CouncilMember;
  secretaries?: CouncilMember[];
  // Additional Core Members
  members?: CouncilMember[];
  // Tier 4: Executive Members (2nd Year Students)
  executiveMembers: CouncilMember[];
  // Tier 5: Volunteers (1st Year Students)
  volunteers: CouncilMember[];
}

export interface CouncilDomain {
  id: string;
  title: string;
  description: string;
  iconName: string;
  skills: string[];
}

export interface CouncilEvent {
  id: string;
  councilId: CouncilId;
  title: string;
  tagline?: string;
  category: 'Hackathon' | 'Workshop' | 'Contest' | 'Tournament' | 'Exhibition' | 'Fest' | 'Performance' | 'Seminar' | 'Celebration';
  date: string; // YYYY-MM-DD or readable
  endDate?: string;
  time: string;
  venue: string;
  description: string;
  bannerUrl: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  registrationOpen: boolean;
  registrationLink?: string;
  registeredCount: number;
  maxSeats?: number;
  registeredUsers?: string[]; // Array of rollNos / emails
  eligibility?: string;
  prizes?: string;
  submittedBy?: {
    name: string;
    role: string;
    id: string;
    timestamp: string;
  };
  moderationStatus?: 'approved' | 'pending' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export interface CouncilMediaItem {
  id: string;
  councilId: CouncilId;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  videoEmbedUrl?: string; // YouTube embed / drive link
  title: string;
  caption: string;
  eventName?: string;
  eventDate?: string;
  tags?: string[];
  uploadedBy: {
    name: string;
    role: string;
    id: string;
    year?: number;
    timestamp: string;
  };
  status: 'approved' | 'pending' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  likes: number;
  likedBy?: string[];
}

export interface CollegeCouncil {
  id: CouncilId;
  name: string;
  hindiName?: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  missionStatement: string;
  objectives: string[];
  domains: CouncilDomain[];
  leadership: CouncilLeadership;
  themeColor: {
    primary: string; // e.g. '#2563eb'
    secondary: string;
    gradient: string; // Tailwind gradient classes
    glowColor: string; // rgba/hex for ambient glow
    accentBorder: string;
    badgeBg: string;
  };
  logoUrl?: string;
  bannerUrl: string;
  socials: {
    instagram?: string;
    youtube?: string;
    github?: string;
    email: string;
    whatsappCommunity?: string;
    discordServer?: string;
  };
  meetingVenue: string;
  stats: {
    annualEvents: number;
    activeMembers: number;
    achievementsCount: number;
  };
}
