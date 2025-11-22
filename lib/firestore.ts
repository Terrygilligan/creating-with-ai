import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
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
import type { User, Post, Notification } from "@/types";

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

