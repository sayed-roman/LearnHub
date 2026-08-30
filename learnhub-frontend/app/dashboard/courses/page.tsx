"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import { getCourses, createCourse, deleteCourse } from "@/lib/api";
import { Trash2, PlusCircle } from "lucide-react";

function ManageCourses({ user, token }: { user: any; token: string }) {
  const [courses, setCourses] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  function load() {
    getCourses(token)
      .then((all) => {
        const visible =
          user.role?.name === "Instructor"
            ? all.filter((c: any) => c.instructor?.id === user.id)
            : all;
        setCourses(visible);
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, [token, user.id, user.role]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCreating(true);
    try {
      await createCourse(token, {
        title,
        description,
        instructor: user.role?.name === "Instructor" ? user.id : undefined,
      });
      setTitle("");
      setDescription("");
      load();
    } catch (err: any) {
      setError(err.message || "Could not create course");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(documentId: string) {
    if (!confirm("Delete this course?")) return;
    try {
      await deleteCourse(token, documentId);
      load();
    } catch (err: any) {
      alert(err.message || "Could not delete course");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Manage Courses</h1>
      <p className="text-muted mb-8">Create courses and manage lessons &amp; quizzes.</p>

      <form onSubmit={handleCreate} className="card p-6 mb-10 flex flex-col gap-4 max-w-lg">
        <h2 className="font-semibold flex items-center gap-2">
          <PlusCircle className="h-4 w-4 text-accent" /> New Course
        </h2>
        <input
          type="text"
          placeholder="Course title"
          className="input-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="input-field"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={creating} className="btn-primary self-start">
          {creating ? "Creating..." : "Create Course"}
        </button>
      </form>

      <h2 className="font-semibold mb-4">Existing Courses</h2>
      {loading ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : courses.length === 0 ? (
        <p className="text-sm text-muted">No courses yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {courses.map((c) => (
            <div key={c.documentId} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{c.title}</p>
                <p className="text-xs text-muted">
                  Instructor: {c.instructor?.username || "Unassigned"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/dashboard/courses/${c.documentId}`}
                  className="text-sm text-accent font-medium hover:underline"
                >
                  Manage
                </Link>
                <button onClick={() => handleDelete(c.documentId)} title="Delete">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardCoursesPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <RequireAuth allowedRoles={["Admin", "Content Manager", "Instructor"]}>
        {(user, token) => <ManageCourses user={user} token={token} />}
      </RequireAuth>
    </div>
  );
}
