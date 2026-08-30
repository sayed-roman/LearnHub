"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBlogPosts } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Calendar, User } from "lucide-react";

export default function BlogListPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPosts(getToken())
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-3xl font-bold mb-2">Blog</h1>
      <p className="text-muted mb-10">Insights, tutorials, and updates from LearnHub.</p>

      {loading ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-muted">No posts published yet.</p>
      ) : (
        <div className="flex flex-col gap-5">
          {posts.map((p) => (
            <Link key={p.documentId} href={`/blog/${p.documentId}`} className="card p-6 block">
              <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
              <p className="text-sm text-muted line-clamp-2 mb-3">{p.body}</p>
              <div className="flex items-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" /> {p.author?.username || "LearnHub"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(p.publishedAt || p.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
