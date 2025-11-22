"use client";

import { useState } from "react";
import type { Post } from "@/types";

export default function ExplorePage() {
  const [posts, setPosts] = useState<Post[]>([]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Explore</h1>
      <p className="text-muted-foreground">Discover trending AI creations</p>
    </div>
  );
}

