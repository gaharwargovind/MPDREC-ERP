import { UserRole } from './erp';
import { EncryptedPayload, EncryptedGroupKeyPackage } from '../services/e2eeService';

export type ChatType = 'direct' | 'group' | 'channel';

export type MessageContentType = 'text' | 'file' | 'image' | 'video' | 'code' | 'audio';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface ChatMember {
  id: string; // rollNo or facultyId or userId
  name: string;
  role: 'admin' | 'member';
  userRole?: UserRole;
  avatar?: string;
  handle?: string;
  statusText?: string;
  isOnline?: boolean;
  academicBadge?: string; // e.g. "B.Tech CSE Sem-3"
  joinedAt?: string;
  publicKey?: JsonWebKey;
}

export interface AttachmentData {
  name: string;
  fileType: string; // 'pdf' | 'docx' | 'pptx' | 'zip' | 'txt' | 'image' | 'video'
  size: string;
  url: string;
  thumbnailUrl?: string;
  downloadUrl?: string;
}

export interface CodeSnippetData {
  language: string; // 'cpp' | 'python' | 'java' | 'javascript' | 'typescript' | 'sql' | 'c'
  code: string;
  title?: string;
}

export interface HubMessage {
  id: string;
  chatId: string;
  conversationId?: string; // alias for chatId
  senderId: string;
  senderName: string;
  recipientId?: string; // for direct 1-on-1 messages
  senderRole: string; // 'student' | 'faculty' | 'admin' | 'staff'
  senderRollNo?: string;
  senderAvatar?: string;
  senderHandle?: string;
  content: string;
  text?: string; // alias for content
  timestamp: string;
  date: string;
  type: MessageContentType;
  status: MessageStatus;
  attachment?: AttachmentData;
  codeSnippet?: CodeSnippetData;
  replyTo?: {
    id: string;
    senderName: string;
    snippet: string;
    type?: MessageContentType;
  };
  reactions?: Record<string, string[]>; // emoji -> [userNames]
  isPinned?: boolean;
  isEdited?: boolean;
  // E2EE properties
  isEncrypted?: boolean;
  encryptedPayload?: EncryptedPayload;
  encryptionAlgorithm?: string;
  encryptionKeyVersion?: number;
  decryptionError?: boolean;
}

export interface HubChat {
  id: string;
  type: ChatType;
  name: string;
  avatar: string;
  description?: string;
  subject?: string; // e.g., 'Data Structures & Algorithms', 'AKTU Examination'
  isPinned?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
  unreadCount?: number;
  creatorId?: string;
  admins?: string[]; // user IDs / rollNos
  members?: ChatMember[];
  participantIds?: string[]; // strictly scoped participants (for DMs and groups)
  onlyAdminsCanPost?: boolean;
  customWallpaper?: string; // 'academic-graph' | 'telegram-doodle' | 'midnight-mesh' | 'emerald-study' | 'classic'
  createdAt?: string;
  tags?: string[];
  // E2EE attributes
  isEncrypted?: boolean;
  encryptedGroupKeys?: Record<string, EncryptedGroupKeyPackage>;
  groupKeyVersion?: number;
  encryptionKeyVersion?: number;
  securityFingerprint?: string;
  directPeer?: {
    id: string;
    name: string;
    role: UserRole;
    rollNo?: string;
    handle?: string;
    avatar?: string;
    isOnline?: boolean;
    academicBadge?: string;
    bioStatus?: string;
    publicKey?: JsonWebKey;
  };
  lastMessage?: {
    content: string;
    timestamp: string;
    senderName: string;
    type?: MessageContentType;
    isEncrypted?: boolean;
  };
}

export interface HubUserProfile {
  userId: string;
  displayName: string;
  handle: string; // e.g. @govind_cs
  avatar: string;
  bioStatus: string;
  customBio?: string;
  role: UserRole;
  rollNo?: string;
  branch?: string;
  semester?: number;
  wallpaperTheme?: string;
  soundEnabled?: boolean;
  readReceipts?: boolean;
}
