"use client";

import { useEffect, useState } from "react";
import { where, orderBy, limit, getDocs, collection } from "firebase/firestore";
import { subscribeToPosts, toggleLike, checkIfLiked } from "@/lib/firestore";
import { db } from "@/lib/firebase";
import type { Post } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Heart, Share2, MessageCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [feedType, setFeedType] = useState<"all" | "following">("all");

  useEffect(() => {
    if (!user) return;

    const loadPosts = async () => {
      let constraints;
      
      if (feedType === "following") {
        // Get list of users being followed
        const followingSnapshot = await getDocs(
          collection(db, "follows", user.uid, "following")
        );
        const followingIds = followingSnapshot.docs.map((doc) => doc.id);
        
        if (followingIds.length === 0) {
          setPosts([]);
          setLoading(false);
          return;
        }

        // Firestore "in" query supports up to 10 items
        // For now, we'll use the first 10 followed users
        const limitedIds = followingIds.slice(0, 10);
        
        constraints = [
          where("isPublic", "==", true),
          where("authorId", "in", limitedIds),
          orderBy("createdAt", "desc"),
          limit(20),
        ];
      } else {
        // All public posts
        constraints = [
          where("isPublic", "==", true),
          orderBy("createdAt", "desc"),
          limit(20),
        ];
      }

      const unsubscribe = subscribeToPosts(constraints, async (newPosts) => {
        setPosts(newPosts);
        setLoading(false);
        
        // Check which posts are liked
        if (user) {
          const liked = new Set<string>();
          await Promise.all(
            newPosts.map(async (post) => {
              const isLiked = await checkIfLiked(post.id, user.uid);
              if (isLiked) liked.add(post.id);
            })
          );
          setLikedPosts(liked);
        }
      });

      return () => unsubscribe();
    };

    loadPosts();
  }, [user, feedType]);

  const handleLike = async (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;

    const isLiked = likedPosts.has(postId);
    await toggleLike(postId, user.uid, isLiked);
    
    // Update local state optimistically
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (isLiked) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-display font-bold">Feed</h1>
        <div className="flex gap-2">
          <Button
            variant={feedType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFeedType("all")}
          >
            All
          </Button>
          <Button
            variant={feedType === "following" ? "default" : "outline"}
            size="sm"
            onClick={() => setFeedType("following")}
          >
            <Users size={16} className="mr-2" />
            Following
          </Button>
        </div>
      </div>
      
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`}>
              <article className="bg-card rounded-2xl border p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold">
                      {post.authorUsername.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-display font-semibold">@{post.authorUsername}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {post.type === "image" && (
                  <div className="relative w-full aspect-square mb-3 rounded-2xl overflow-hidden border border-transparent media-card-hover">
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
                
                <div className="flex items-center gap-4 text-sm">
                  <button
                    onClick={(e) => handleLike(e, post.id)}
                    className={`flex items-center gap-1 transition-colors ${
                      likedPosts.has(post.id)
                        ? "text-destructive"
                        : "text-muted-foreground hover:text-destructive"
                    }`}
                  >
                    <Heart
                      size={16}
                      className={likedPosts.has(post.id) ? "fill-current" : ""}
                    />
                    <span>{post.likesCount}</span>
                  </button>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MessageCircle size={16} />
                    <span>{post.commentsCount || 0}</span>
                  </div>
                  <Link
                    href={`/remix/${post.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-muted-foreground hover:text-accent transition-colors hover:glow-cyan"
                  >
                    <Share2 size={16} />
                    <span>{post.remixCount}</span>
                  </Link>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

