"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPost, checkIfLiked, toggleLike } from "@/lib/firestore";
import { useAuth } from "@/hooks/use-auth";
import type { Post } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Heart, Share2, MessageCircle, ArrowLeft, MoreVertical, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RevealCard } from "@/components/reveal-card";
import { ReportModal } from "@/components/report-modal";

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const postId = params.id;
    if (!postId || typeof postId !== "string") return;

    const loadPost = async () => {
      const postData = await getPost(postId);
      if (!postData) {
        router.push("/feed");
        return;
      }
      setPost(postData);

      if (user && postId) {
        const liked = await checkIfLiked(postId, user.uid);
        setIsLiked(liked);
      }

      setLoading(false);
    };

    loadPost();
  }, [params, user, router]);

  const handleLike = async () => {
    if (!user || !post) return;
    await toggleLike(post.id, user.uid, isLiked);
    setIsLiked(!isLiked);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft size={20} />
      </Button>

      <article className="bg-card rounded-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold">
                {post.authorUsername.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <Link href={`/profile/${post.authorUsername}`}>
                <p className="font-semibold hover:underline">@{post.authorUsername}</p>
              </Link>
              <p className="text-xs text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowReportModal(true)}
            >
              <Flag size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical size={20} />
            </Button>
          </div>
        </div>

        {post.type === "image" && (
          <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
            <Image
              src={post.mediaUrl}
              alt={post.prompt}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="mb-4">
          <p className="text-sm">{post.prompt}</p>
        </div>

        <RevealCard
          prompt={post.prompt}
          negativePrompt={post.negativePrompt}
          model={post.model}
          parameters={post.parameters}
        />

        <div className="flex items-center gap-4 mt-4 pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={isLiked ? "text-destructive" : ""}
          >
            <Heart size={20} className={isLiked ? "fill-current" : ""} />
            <span className="ml-2">{post.likesCount}</span>
          </Button>
          
          <Button variant="ghost" size="sm">
            <MessageCircle size={20} />
            <span className="ml-2">0</span>
          </Button>
          
          <Link href={`/remix/${post.id}`}>
            <Button variant="ghost" size="sm">
              <Share2 size={20} />
              <span className="ml-2">{post.remixCount}</span>
            </Button>
          </Link>
        </div>
      </article>

      {showReportModal && post && (
        <ReportModal postId={post.id} onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
}

