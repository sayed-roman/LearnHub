"use client";

import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { getBlogPosts, createBlogPost, updateBlogPost } from "@/lib/api";
import { PlusCircle } from "lucide-react";

function ManageBlog({ user, token }: { user: any; token: string }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  function load() {
    getBlogPosts(token)
      .then(setPosts)
      .finally(() => setLoading(false));
  }

  useEffect(load, [token]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await createBlogPost(token, {
        title,
        body,
        coverImageUrl,
        publishStatus: "draft",
        author: user.id,
      });
      setTitle("");
      setBody("");
      setCoverImageUrl("");
      load();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(post: any) {
    try {
      await updateBlogPost(token, post.documentId, {
        publishStatus: post.publishStatus === "published" ? "draft" : "published",
      });
      load();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Manage Blog</h1>
      <p className="text-muted mb-8">Write and publish articles for the platform.</p>

      <form onSubmit={handleCreate} className="card p-6 mb-10 flex flex-col gap-4 max-w-lg">
        <h2 className="font-semibold flex items-center gap-2">
          <PlusCircle className="h-4 w-4 text-accent" /> New Post
        </h2>
        <input
          className="input-field"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="input-field"
          placeholder="Body"
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        <input
          className="input-field"
          placeholder="Cover image URL (optional)"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
        />
        <button type="submit" disabled={saving} className="btn-primary self-start">
          {saving ? "Saving..." : "Save as Draft"}
        </button>
      </form>

      <h2 className="font-semibold mb-4">All Posts</h2>
      {loading ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((p) => (
            <div key={p.documentId} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{p.title}</p>
                <span className="badge">{p.publishStatus}</span>
              </div>
              <button onClick={() => togglePublish(p)} className="btn-secondary text-sm">
                {p.publishStatus === "published" ? "Unpublish" : "Publish"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardBlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <RequireAuth allowedRoles={["Admin", "Content Manager"]}>
        {(user, token) => <ManageBlog user={user} token={token} />}
      </RequireAuth>
    </div>
  );
}
