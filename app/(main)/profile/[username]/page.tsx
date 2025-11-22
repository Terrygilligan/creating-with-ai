"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUser, getUserByUsername, subscribeToPosts, followUser, unfollowUser, checkIfFollowing } from "@/lib/firestore";
import { useAuth } from "@/hooks/use-auth";
import type { User, Post } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { FollowersModal } from "@/components/followers-modal";
import { Settings } from "lucide-react";
import { where, orderBy, limit } from "firebase/firestore";

export default function ProfilePage() {
  const params = useParams();
  const { user: currentUser, userData: currentUserData } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [followersModalType, setFollowersModalType] = useState<"followers" | "following">("followers");

  useEffect(() => {
    const username = params.username;
    console.log("Profile page - username param:", username);
    
    if (!username || typeof username !== "string") {
      console.log("Profile page - invalid username, setting loading to false");
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    const loadProfile = async () => {
      try {
        console.log("Profile page - loading profile for:", username);
        setLoading(true);
        
        // Check if it's a UID (Firebase UIDs are 28 characters) or username
        let userData = null;
        if (username.length === 28 && /^[a-zA-Z0-9]+$/.test(username)) {
          // Looks like a UID, try getUser first
          console.log("Profile page - detected UID, trying getUser");
          userData = await getUser(username);
          if (!userData) {
            // If not found as UID, try as username
            console.log("Profile page - not found as UID, trying as username");
            userData = await getUserByUsername(username);
          }
        } else {
          // Try as username first
          console.log("Profile page - trying as username");
          userData = await getUserByUsername(username);
          if (!userData && username.length === 28) {
            // If not found and looks like UID, try getUser
            console.log("Profile page - not found as username, trying as UID");
            userData = await getUser(username);
          }
        }
        
        console.log("Profile page - userData:", userData);
        
        if (!userData) {
          console.log("Profile page - user not found");
          setLoading(false);
          return;
        }
        setUser(userData);

        const constraints = [
          where("authorId", "==", userData.uid),
          where("isPublic", "==", true),
          orderBy("createdAt", "desc"),
          limit(50),
        ];

        unsubscribe = subscribeToPosts(constraints, (newPosts) => {
          console.log("Profile page - posts loaded:", newPosts.length);
          setPosts(newPosts);
          setLoading(false);
        });

        // Check if current user is following this user
        if (currentUser && currentUser.uid !== userData.uid) {
          checkIfFollowing(currentUser.uid, userData.uid).then(setIsFollowing);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setLoading(false);
      }
    };

    loadProfile();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [params.username, currentUser]);

  const handleFollow = async () => {
    if (!currentUser || !user || followLoading) return;

    setFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(currentUser.uid, user.uid);
        setIsFollowing(false);
      } else {
        await followUser(currentUser.uid, user.uid);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-card rounded-2xl border p-6 text-center">
          <p className="text-muted-foreground text-lg">User not found</p>
          <p className="text-sm text-muted-foreground mt-2">
            The user you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.uid === user.uid;

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="bg-card rounded-2xl border p-6 mb-6">
        <div className="flex items-start gap-6 mb-6">
          <Avatar
            src={user.photoURL}
            fallback={user.displayName}
            size="xl"
            alt={user.displayName}
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-display font-bold">@{user.username}</h1>
              {isOwnProfile && (
                <Link href="/settings">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings size={18} />
                  </Button>
                </Link>
              )}
            </div>
            <p className="text-muted-foreground mb-4">{user.displayName}</p>
            
            {user.bio && (
              <p className="text-sm mb-4">{user.bio}</p>
            )}

            <div className="flex gap-6 text-sm mb-4">
              <div className="cursor-default">
                <span className="font-display font-semibold">{posts.length}</span>
                <span className="text-muted-foreground ml-1">posts</span>
              </div>
              <button
                onClick={() => {
                  setFollowersModalType("followers");
                  setShowFollowersModal(true);
                }}
                className="hover:text-primary transition-colors"
              >
                <span className="font-display font-semibold">{user.followersCount || 0}</span>
                <span className="text-muted-foreground ml-1">followers</span>
              </button>
              <button
                onClick={() => {
                  setFollowersModalType("following");
                  setShowFollowersModal(true);
                }}
                className="hover:text-primary transition-colors"
              >
                <span className="font-display font-semibold">{user.followingCount || 0}</span>
                <span className="text-muted-foreground ml-1">following</span>
              </button>
            </div>

            {!isOwnProfile && currentUser && (
              <Button
                onClick={handleFollow}
                disabled={followLoading}
                variant={isFollowing ? "outline" : "default"}
                className="w-full sm:w-auto"
              >
                {followLoading ? "..." : isFollowing ? "Following" : "Follow"}
              </Button>
            )}
            {isOwnProfile && (
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/settings">Edit Profile</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {posts.map((post) => (
          <Link key={post.id} href={`/post/${post.id}`}>
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-transparent media-card-hover">
              {post.type === "image" && (
                <Image
                  src={post.mediaUrl}
                  alt={post.prompt}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <div className="mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📸</span>
            </div>
            <p className="text-muted-foreground font-display">
              {isOwnProfile ? "You haven't posted anything yet" : "No posts yet"}
            </p>
            {isOwnProfile && (
              <Link href="/upload">
                <Button variant="default" className="mt-4">
                  Create Your First Post
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {showFollowersModal && user && (
        <FollowersModal
          userId={user.uid}
          type={followersModalType}
          onClose={() => setShowFollowersModal(false)}
        />
      )}
    </div>
  );
}

