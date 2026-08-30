"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import {
  getMyEnrollments,
  getLessonProgress,
  getCourses,
  getMyQuizSubmissions,
} from "@/lib/api";
import { BookOpen, TrendingUp, Award, PlusCircle } from "lucide-react";

function StudentDashboard({ user, token }: { user: any; token: string }) {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getMyEnrollments(token, user.id),
      getLessonProgress(token, user.id),
      getMyQuizSubmissions(token, user.id),
    ])
      .then(([e, p, s]) => {
        setEnrollments(e);
        setProgress(p);
        setSubmissions(s);
      })
      .finally(() => setLoading(false));
  }, [token, user.id]);

  const completedLessons = progress.filter((p) => p.completed).length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Welcome back, {user.username}</h1>
      <p className="text-muted mb-8">Here&apos;s where you left off.</p>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <div className="card p-5">
          <BookOpen className="h-5 w-5 text-accent mb-2" />
          <p className="text-2xl font-bold">{enrollments.length}</p>
          <p className="text-sm text-muted">Enrolled courses</p>
        </div>
        <div className="card p-5">
          <TrendingUp className="h-5 w-5 text-accent mb-2" />
          <p className="text-2xl font-bold">{completedLessons}</p>
          <p className="text-sm text-muted">Lessons completed</p>
        </div>
        <div className="card p-5">
          <Award className="h-5 w-5 text-accent mb-2" />
          <p className="text-2xl font-bold">{submissions.length}</p>
          <p className="text-sm text-muted">Quizzes taken</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4">My Courses</h2>
      {loading ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : enrollments.length === 0 ? (
        <p className="text-sm text-muted">
          You haven&apos;t enrolled in any courses yet.{" "}
          <Link href="/courses" className="text-accent font-medium hover:underline">
            Browse courses
          </Link>
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {enrollments.map((e) => (
            <Link
              key={e.documentId}
              href={`/courses/${e.course?.documentId}`}
              className="card p-5 flex items-center justify-between"
            >
              <span className="font-medium">{e.course?.title}</span>
              <span className="text-xs text-accent">Continue &rarr;</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function StaffDashboard({ user, token }: { user: any; token: string }) {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses(token)
      .then((all) => {
        const mine =
          user.role?.name === "Instructor"
            ? all.filter((c: any) => c.instructor?.id === user.id)
            : all;
        setCourses(mine);
      })
      .finally(() => setLoading(false));
  }, [token, user.id, user.role]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Welcome back, {user.username}</h1>
      <p className="text-muted mb-8">
        {user.role?.name === "Instructor"
          ? "Manage your courses and track student progress."
          : "Manage courses, lessons, and content across the platform."}
      </p>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {user.role?.name === "Instructor" ? "My Courses" : "All Courses"}
        </h2>
        <Link href="/dashboard/courses" className="btn-primary text-sm flex items-center gap-1.5">
          <PlusCircle className="h-4 w-4" /> Manage Courses
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : courses.length === 0 ? (
        <p className="text-sm text-muted">No courses yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {courses.map((c) => (
            <div key={c.documentId} className="card p-5">
              <p className="font-medium mb-1">{c.title}</p>
              <p className="text-xs text-muted line-clamp-2">{c.description}</p>
            </div>
          ))}
        </div>
      )}

      {user.role?.name === "Content Manager" && (
        <div className="mt-8">
          <Link href="/dashboard/blog" className="btn-secondary text-sm">
            Manage Blog Posts
          </Link>
        </div>
      )}
    </div>
  );
}

function AdminDashboardLink({ user }: { user: any }) {
  return (
    <div className="card p-6 mb-8 flex items-center justify-between">
      <div>
        <p className="font-semibold">Admin controls</p>
        <p className="text-sm text-muted">Manage users, roles, and platform-wide content.</p>
      </div>
      <Link href="/admin" className="btn-primary text-sm">
        Open Admin Panel
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <RequireAuth>
        {(user, token) => (
          <>
            {user.role?.name === "Admin" && <AdminDashboardLink user={user} />}
            {user.role?.name === "Student" ? (
              <StudentDashboard user={user} token={token} />
            ) : (
              <StaffDashboard user={user} token={token} />
            )}
          </>
        )}
      </RequireAuth>
    </div>
  );
}