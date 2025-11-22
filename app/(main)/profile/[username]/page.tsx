"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserByUsername, subscribeToPosts } from "@/lib/firestore";
import { useAuth } from "@/hooks/use-auth";
import type { User, Post } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { where, orderBy, limit } from "firebase/firestore";

export default function ProfilePage() {
  const params = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = params.username;
    if (!username || typeof username !== "string") return;

    const loadProfile = async () => {
      const userData = await getUserByUsername(username);
      if (!userData) {
        setLoading(false);
        return;
      }
      setUser(userData);

      const constraints = [
        where("authorId", "==", userData.uid),
        where("isPublic", "==", true),
        orderBy("createdAt", "desc"),
        limit(50),
      ];

      const unsubscribe = subscribeToPosts(constraints, (newPosts) => {
        setPosts(newPosts);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    loadProfile();
  }, [params]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p className="text-muted-foreground">User not found</p>
      </div>
    );
  }

  const isOwnProfile = currentUser?.uid === user.uid;

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="bg-card rounded-lg border p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-semibold">
            {user.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">@{user.username}</h1>
            <p className="text-muted-foreground">{user.displayName}</p>
          </div>
          {!isOwnProfile && (
            <Button>Follow</Button>
          )}
        </div>
        
        {user.bio && (
          <p className="text-sm mb-4">{user.bio}</p>
        )}

        <div className="flex gap-6 text-sm">
          <div>
            <span className="font-semibold">{posts.length}</span>
            <span className="text-muted-foreground ml-1">posts</span>
          </div>
          <div>
            <span className="font-semibold">0</span>
            <span className="text-muted-foreground ml-1">followers</span>
          </div>
          <div>
            <span className="font-semibold">0</span>
            <span className="text-muted-foreground ml-1">following</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {posts.map((post) => (
          <Link key={post.id} href={`/post/${post.id}`}>
            <div className="relative aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity">
              {post.type === "image" && (
                <Image
                  src={post.mediaUrl}
                  alt={post.prompt}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts yet</p>
        </div>
      )}
    </div>
  );
}

