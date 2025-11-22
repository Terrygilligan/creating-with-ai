"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, limit, getDocs, startAfter } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { subscribeToPosts } from "@/lib/firestore";
import type { Post } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Heart, Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const constraints = [
      where("isPublic", "==", true),
      orderBy("createdAt", "desc"),
      limit(20),
    ];

    const unsubscribe = subscribeToPosts(constraints, (newPosts) => {
      setPosts(newPosts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Feed</h1>
      
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`}>
              <article className="bg-card rounded-lg border p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold">
                      {post.authorUsername.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">@{post.authorUsername}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {post.type === "image" && (
                  <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden">
                    <Image
                      src={post.mediaUrl}
                      alt={post.prompt}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {post.prompt}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Heart size={16} />
                    <span>{post.likesCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={16} />
                    <span>0</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 size={16} />
                    <span>{post.remixCount}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

