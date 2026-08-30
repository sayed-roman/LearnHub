"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBlogPost } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Calendar, User } from "lucide-react";

export default function BlogDetailPage() {
  const params = useParams();
  const documentId = params.documentId as string;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPost(documentId, getToken())
      .then(setPost)
      .finally(() => setLoading(false));
  }, [documentId]);

  if (loading) return <div className="py-24 text-center text-muted">Loading...</div>;
  if (!post) return <div className="py-24 text-center text-muted">Post not found.</div>;

  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-4 leading-tight">{post.title}</h1>
      <div className="flex items-center gap-4 text-sm text-muted mb-10">
        <span className="flex items-center gap-1">
          <User className="h-4 w-4" /> {post.author?.username || "LearnHub"}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="leading-relaxed text-foreground/90 whitespace-pre-line text-[1.05rem]">
        {post.body}
      </div>
    </article>
  );
}
