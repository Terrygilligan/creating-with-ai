"use client";

import { useEffect, useState } from "react";
import { subscribeToComments, addComment, deleteComment } from "@/lib/firestore";
import { useAuth } from "@/hooks/use-auth";
import type { Comment } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Trash2, Send } from "lucide-react";
import Link from "next/link";

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { user, userData } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToComments(postId, (newComments) => {
      setComments(newComments);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userData || !newComment.trim()) return;

    setLoading(true);
    try {
      await addComment(
        postId,
        user.uid,
        userData.username,
        userData.photoURL,
        newComment
      );
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await deleteComment(postId, commentId);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Comments ({comments.length})</h3>

      {user && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !newComment.trim()}>
            <Send size={16} className="mr-2" />
            Post
          </Button>
        </form>
      )}

      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              <Link href={`/profile/${comment.authorUsername}`}>
                <Avatar
                  src={comment.authorPhoto}
                  fallback={comment.authorUsername}
                  size="sm"
                  alt={comment.authorUsername}
                />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Link href={`/profile/${comment.authorUsername}`}>
                    <span className="text-sm font-display font-semibold hover:text-primary transition-colors">
                      @{comment.authorUsername}
                    </span>
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm">{comment.text}</p>
              </div>
              {user && user.uid === comment.authorId && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(comment.id)}
                  className="flex-shrink-0"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

