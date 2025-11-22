"use client";

import { useEffect, useState } from "react";
import { where, orderBy, limit } from "firebase/firestore";
import { subscribeToPosts } from "@/lib/firestore";
import { useAuth } from "@/hooks/use-auth";
import type { Post } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Heart, Share2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExplorePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"trending" | "recent" | "popular">("trending");

  useEffect(() => {
    if (!user) return;

    let constraints;
    
    if (filter === "trending") {
      // Trending: Most likes in last 7 days
      constraints = [
        where("isPublic", "==", true),
        orderBy("likesCount", "desc"),
        limit(50),
      ];
    } else if (filter === "recent") {
      // Recent: Latest posts
      constraints = [
        where("isPublic", "==", true),
        orderBy("createdAt", "desc"),
        limit(50),
      ];
    } else {
      // Popular: Most remixes
      constraints = [
        where("isPublic", "==", true),
        orderBy("remixCount", "desc"),
        limit(50),
      ];
    }

    const unsubscribe = subscribeToPosts(constraints, (newPosts) => {
      setPosts(newPosts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, filter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Explore</h1>
          <p className="text-muted-foreground">Discover trending AI creations</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <Button
          variant={filter === "trending" ? "default" : "ghost"}
          onClick={() => setFilter("trending")}
          className="rounded-b-none"
        >
          <TrendingUp size={16} className="mr-2" />
          Trending
        </Button>
        <Button
          variant={filter === "recent" ? "default" : "ghost"}
          onClick={() => setFilter("recent")}
          className="rounded-b-none"
        >
          Recent
        </Button>
        <Button
          variant={filter === "popular" ? "default" : "ghost"}
          onClick={() => setFilter("popular")}
          className="rounded-b-none"
        >
          Popular
        </Button>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts found. Be the first to share!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`}>
              <div className="group relative aspect-square rounded-2xl overflow-hidden border border-transparent media-card-hover">
                {post.type === "image" && (
                  <Image
                    src={post.mediaUrl}
                    alt={post.prompt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-3">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-full">
                    <p className="text-sm font-semibold line-clamp-1 mb-1">
                      @{post.authorUsername}
                    </p>
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <Heart size={12} />
                        <span>{post.likesCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 size={12} />
                        <span>{post.remixCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

