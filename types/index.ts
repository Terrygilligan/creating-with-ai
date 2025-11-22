export interface User {
  uid: string;
  username: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  isAdmin?: boolean;
  isBanned?: boolean;
  fcmToken?: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  authorId: string;
  authorUsername: string;
  type: "image" | "video" | "audio";
  mediaUrl: string;
  thumbnailUrl?: string;
  prompt: string;
  negativePrompt?: string;
  model?: string;
  parameters?: Record<string, any>;
  iterations?: string[];
  likesCount: number;
  copiesCount: number;
  remixCount: number;
  isPublic: boolean;
  originalPostId?: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  type: "like" | "remix" | "comment" | "follow";
  fromUserId: string;
  fromUsername: string;
  fromUserPhoto?: string;
  postId?: string;
  read: boolean;
  createdAt: Date;
}

export interface Report {
  postId: string;
  reporterId: string;
  reason?: string;
  createdAt: Date;
}

export interface Follow {
  userId: string;
  targetId: string;
  createdAt: Date;
}

