"use client";

import { useEffect, useState } from "react";
import { getFollowing } from "@/lib/firestore";
import type { User } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { X } from "lucide-react";

interface FollowersModalProps {
  userId: string;
  type: "followers" | "following";
  onClose: () => void;
}

export function FollowersModal({ userId, type, onClose }: FollowersModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        // For now, only show following (followers requires reverse index)
        if (type === "following") {
          const following = await getFollowing(userId);
          setUsers(following);
        } else {
          // Followers not implemented yet (requires reverse index)
          setUsers([]);
        }
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [userId, type]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[80vh] flex flex-col glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="font-display">
            {type === "followers" ? "Followers" : "Following"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {type === "followers" 
                  ? "No followers yet" 
                  : "Not following anyone yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <Link
                  key={user.uid}
                  href={`/profile/${user.username}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/10 transition-colors"
                >
                  <Avatar
                    src={user.photoURL}
                    fallback={user.displayName}
                    size="md"
                  />
                  <div className="flex-1">
                    <p className="font-display font-semibold">@{user.username}</p>
                    <p className="text-sm text-muted-foreground">{user.displayName}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

