"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { subscribeToNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/firestore";
import type { Notification } from "@/types";
import Link from "next/link";
import { Heart, Share2, MessageCircle, UserPlus, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const handleMarkAsRead = async (notificationId: string) => {
    if (!user) return;
    await markNotificationAsRead(user.uid, notificationId);
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    await markAllNotificationsAsRead(user.uid);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-display font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            <CheckCheck size={16} className="mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-card rounded-2xl border p-4 hover:bg-accent/10 transition-colors ${
                !notification.read ? "border-primary/50" : ""
              }`}
            >
              <Link
                href={notification.postId ? `/post/${notification.postId}` : `/profile/${notification.fromUsername}`}
                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
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
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

