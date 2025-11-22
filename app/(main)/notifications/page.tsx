"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { subscribeToNotifications } from "@/lib/firestore";
import type { Notification } from "@/types";
import Link from "next/link";
import { Heart, Share2, MessageCircle, UserPlus } from "lucide-react";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToNotifications(user.uid, (newNotifications, count) => {
      setNotifications(newNotifications);
      setUnreadCount(count);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "like":
        return <Heart size={20} className="text-destructive" />;
      case "remix":
        return <Share2 size={20} className="text-primary" />;
      case "comment":
        return <MessageCircle size={20} className="text-blue-500" />;
      case "follow":
        return <UserPlus size={20} className="text-green-500" />;
    }
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
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <Link
              key={notification.id}
              href={notification.postId ? `/post/${notification.postId}` : `/profile/${notification.fromUsername}`}
            >
              <div
                className={`bg-card rounded-lg border p-4 hover:bg-accent transition-colors ${
                  !notification.read ? "border-primary" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">@{notification.fromUsername}</span>{" "}
                      {notification.type === "like" && "liked your post"}
                      {notification.type === "remix" && "remixed your post"}
                      {notification.type === "comment" && "commented on your post"}
                      {notification.type === "follow" && "started following you"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
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

