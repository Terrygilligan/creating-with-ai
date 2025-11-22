"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPost } from "@/lib/firestore";
import { useAuth } from "@/hooks/use-auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp, updateDoc, doc, getDoc } from "firebase/firestore";
import { storage, db } from "@/lib/firebase";
import type { Post } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function RemixPage() {
  const params = useParams();
  const router = useRouter();
  const { user, userData } = useAuth();
  const [originalPost, setOriginalPost] = useState<Post | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const postId = params.postId;
    if (!postId || typeof postId !== "string") return;

    const loadPost = async () => {
      const post = await getPost(postId);
      if (!post) {
        router.push("/feed");
        return;
      }
      setOriginalPost(post);
      setPrompt(post.prompt); // Pre-fill with original prompt
      setLoading(false);
    };

    loadPost();
  }, [params, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userData || !originalPost || !prompt.trim()) return;

    setSubmitting(true);

    try {
      // Create a new post with the remixed prompt
      // For now, we'll reuse the original image (in a real app, you'd generate a new one)
      const newPostRef = await addDoc(collection(db, "posts"), {
        authorId: user.uid,
        authorUsername: userData.username,
        type: originalPost.type,
        mediaUrl: originalPost.mediaUrl, // In production, generate new image here
        thumbnailUrl: originalPost.thumbnailUrl,
        prompt: prompt.trim(),
        negativePrompt: originalPost.negativePrompt,
        model: originalPost.model,
        parameters: originalPost.parameters,
        iterations: originalPost.iterations || [],
        likesCount: 0,
        copiesCount: 0,
        remixCount: 0,
        commentsCount: 0,
        isPublic: true,
        originalPostId: originalPost.id,
        createdAt: serverTimestamp(),
      });

      // Update original post's remix count
      const originalPostRef = doc(db, "posts", originalPost.id);
      const originalPostDoc = await getDoc(originalPostRef);
      const currentRemixCount = originalPostDoc.data()?.remixCount || 0;
      await updateDoc(originalPostRef, {
        remixCount: currentRemixCount + 1,
      });

      // Redirect to the new remix post
      router.push(`/post/${newPostRef.id}`);
    } catch (error) {
      console.error("Error creating remix:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!originalPost) {
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

      <Card>
        <CardHeader>
          <CardTitle>Remix Post</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">Original:</p>
            {originalPost.type === "image" && (
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-primary/20 mb-2 media-card-hover">
                <Image
                  src={originalPost.mediaUrl}
                  alt={originalPost.prompt}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <p className="text-sm font-mono">{originalPost.prompt}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Your Prompt</Label>
              <Input
                id="prompt"
                placeholder="Modify the prompt to create your own version..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="font-mono"
                required
              />
            </div>

            <Button type="submit" variant="accent" className="w-full glow-cyan" disabled={submitting}>
              {submitting ? "Creating remix..." : "Create Remix"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

