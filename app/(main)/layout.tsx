"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { subscribeToNotifications } from "@/lib/firestore";
import { Home, Search, Plus, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userData, loading, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (userData?.isBanned) {
      logout();
      router.push("/login");
      return;
    }

    const unsubscribe = subscribeToNotifications(user.uid, (notifications, count) => {
      setUnreadCount(count);
    });

    return () => unsubscribe();
  }, [user, userData, router, logout]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navItems = [
    { href: "/feed", icon: Home, label: "Feed" },
    { href: "/explore", icon: Search, label: "Explore" },
    { href: "/upload", icon: Plus, label: "Upload" },
    { href: "/notifications", icon: Bell, label: "Notifications" },
    { href: `/profile/${userData?.username || user.uid}`, icon: User, label: "Profile" },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <main className="flex-1">{children}</main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href === "/feed" && pathname === "/") ||
              (item.href.startsWith("/profile") && pathname.startsWith("/profile"));
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`relative ${isActive ? "text-primary" : "text-muted-foreground"}`}
                >
                  <Icon size={24} />
                  {item.href === "/notifications" && unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-2 w-2 bg-destructive rounded-full"></span>
                  )}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

