import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";
import type { User, Post, Notification, Comment } from "@/types";

// User hooks
export async function getUser(uid: string): Promise<User | null> {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) return null;
  
  const data = userDoc.data();
  return {
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
  } as User;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const q = query(collection(db, "users"), where("username", "==", username.toLowerCase()), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  
  const data = snapshot.docs[0].data();
  return {
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
  } as User;
}

// Post hooks
export async function getPost(postId: string): Promise<Post | null> {
  const postDoc = await getDoc(doc(db, "posts", postId));
  if (!postDoc.exists()) return null;
  
  const data = postDoc.data();
  return {
    id: postDoc.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
  } as Post;
}

export function getPosts(constraints: QueryConstraint[] = []) {
  const q = query(collection(db, "posts"), ...constraints);
  return getDocs(q);
}

export function subscribeToPosts(
  constraints: QueryConstraint[],
  callback: (posts: Post[]) => void
) {
  const q = query(collection(db, "posts"), ...constraints);
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Post[];
    callback(posts);
  });
}

// Notification hooks
export function subscribeToNotifications(
  uid: string,
  callback: (notifications: Notification[], unreadCount: number) => void
) {
  const notificationsRef = doc(db, "notifications", uid);
  return onSnapshot(notificationsRef, (doc) => {
    if (!doc.exists()) {
      callback([], 0);
      return;
    }
    
    const data = doc.data();
    const notifications = (data.list || []).map((n: any) => ({
      ...n,
      createdAt: n.createdAt?.toDate() || new Date(),
    })) as Notification[];
    
    const unreadCount = data.unreadCount || 0;
    callback(notifications, unreadCount);
  });
}

// Like/Unlike
export async function toggleLike(postId: string, userId: string, isLiked: boolean) {
  const likeRef = doc(db, "posts", postId, "likes", userId);
  const postRef = doc(db, "posts", postId);
  
  if (isLiked) {
    await deleteDoc(likeRef);
    await updateDoc(postRef, {
      likesCount: (await getDoc(postRef)).data()?.likesCount - 1 || 0,
    });
  } else {
    await setDoc(likeRef, { userId, createdAt: serverTimestamp() });
    await updateDoc(postRef, {
      likesCount: (await getDoc(postRef)).data()?.likesCount + 1 || 0,
    });
  }
}

export async function checkIfLiked(postId: string, userId: string): Promise<boolean> {
  const likeDoc = await getDoc(doc(db, "posts", postId, "likes", userId));
  return likeDoc.exists();
}

// Comments
export function subscribeToComments(
  postId: string,
  callback: (comments: Comment[]) => void
) {
  const q = query(
    collection(db, "posts", postId, "comments"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Comment[];
    callback(comments);
  });
}

export async function addComment(
  postId: string,
  userId: string,
  username: string,
  userPhoto: string | undefined,
  text: string
) {
  const commentsRef = collection(db, "posts", postId, "comments");
  await addDoc(commentsRef, {
    postId,
    authorId: userId,
    authorUsername: username,
    authorPhoto: userPhoto || null,
    text: text.trim(),
    createdAt: serverTimestamp(),
  });

  // Update post comments count
  const postRef = doc(db, "posts", postId);
  const postDoc = await getDoc(postRef);
  const currentCount = postDoc.data()?.commentsCount || 0;
  await updateDoc(postRef, {
    commentsCount: currentCount + 1,
  });
}

export async function deleteComment(postId: string, commentId: string) {
  await deleteDoc(doc(db, "posts", postId, "comments", commentId));

  // Update post comments count
  const postRef = doc(db, "posts", postId);
  const postDoc = await getDoc(postRef);
  const currentCount = postDoc.data()?.commentsCount || 0;
  await updateDoc(postRef, {
    commentsCount: Math.max(0, currentCount - 1),
  });
}

// Follow/Unfollow
export async function followUser(userId: string, targetUserId: string) {
  const followRef = doc(db, "follows", userId, "following", targetUserId);
  await setDoc(followRef, {
    userId,
    targetId: targetUserId,
    createdAt: serverTimestamp(),
  });

  // Update follower count
  const targetUserRef = doc(db, "users", targetUserId);
  const targetUserDoc = await getDoc(targetUserRef);
  const currentFollowers = targetUserDoc.data()?.followersCount || 0;
  await updateDoc(targetUserRef, {
    followersCount: currentFollowers + 1,
  });

  // Update following count
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  const currentFollowing = userDoc.data()?.followingCount || 0;
  await updateDoc(userRef, {
    followingCount: currentFollowing + 1,
  });
}

export async function unfollowUser(userId: string, targetUserId: string) {
  await deleteDoc(doc(db, "follows", userId, "following", targetUserId));

  // Update follower count
  const targetUserRef = doc(db, "users", targetUserId);
  const targetUserDoc = await getDoc(targetUserRef);
  const currentFollowers = targetUserDoc.data()?.followersCount || 0;
  await updateDoc(targetUserRef, {
    followersCount: Math.max(0, currentFollowers - 1),
  });

  // Update following count
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  const currentFollowing = userDoc.data()?.followingCount || 0;
  await updateDoc(userRef, {
    followingCount: Math.max(0, currentFollowing - 1),
  });
}

export async function checkIfFollowing(userId: string, targetUserId: string): Promise<boolean> {
  const followDoc = await getDoc(doc(db, "follows", userId, "following", targetUserId));
  return followDoc.exists();
}

// Get followers list (users who follow this userId)
export async function getFollowers(userId: string): Promise<User[]> {
  // This is expensive - we need to check all users' following subcollections
  // For now, return empty array and we'll optimize with a reverse index later
  // TODO: Add a reverse index collection: followers/{userId}/followers/{followerId}
  return [];
}

// Get following list (users this userId follows)
export async function getFollowing(userId: string): Promise<User[]> {
  const followingRef = collection(db, "follows", userId, "following");
  const snapshot = await getDocs(followingRef);
  
  if (snapshot.empty) return [];
  
  const followingIds = snapshot.docs.map((doc) => doc.id);
  const users: User[] = [];
  
  await Promise.all(
    followingIds.map(async (uid) => {
      const user = await getUser(uid);
      if (user) users.push(user);
    })
  );
  
  return users;
}

// Notification mark as read
export async function markNotificationAsRead(uid: string, notificationId: string) {
  const notificationsRef = doc(db, "notifications", uid);
  const notificationsDoc = await getDoc(notificationsRef);
  
  if (!notificationsDoc.exists()) return;
  
  const data = notificationsDoc.data();
  const list = data.list || [];
  const unreadCount = data.unreadCount || 0;
  
  // Find and mark notification as read
  const updatedList = list.map((n: any) => 
    n.id === notificationId ? { ...n, read: true } : n
  );
  
  // Count unread
  const newUnreadCount = updatedList.filter((n: any) => !n.read).length;
  
  await updateDoc(notificationsRef, {
    list: updatedList,
    unreadCount: newUnreadCount,
  });
}

export async function markAllNotificationsAsRead(uid: string) {
  const notificationsRef = doc(db, "notifications", uid);
  const notificationsDoc = await getDoc(notificationsRef);
  
  if (!notificationsDoc.exists()) return;
  
  const data = notificationsDoc.data();
  const list = data.list || [];
  
  // Mark all as read
  const updatedList = list.map((n: any) => ({ ...n, read: true }));
  
  await updateDoc(notificationsRef, {
    list: updatedList,
    unreadCount: 0,
  });
}

