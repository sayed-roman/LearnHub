"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCourse, enrollInCourse, getMyEnrollments } from "@/lib/api";
import { getStoredUser, getToken } from "@/lib/auth";
import { BookOpen, User, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId as string;

  const [course, setCourse] = useState<any>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState("");

  const user = getStoredUser();
  const token = getToken();

  useEffect(() => {
    async function load() {
      try {
        const c = await getCourse(documentId, token);
        setCourse(c);

        if (user && token && user.role?.name === "Student") {
          const enrollments = await getMyEnrollments(
            token,
            user.documentId ?? String(user.id),
            user.id
          );
          const isEnrolled = enrollments.some(
            (e: any) => e.course?.documentId === documentId
          );
          setEnrolled(isEnrolled);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  async function handleEnroll() {
    if (!user || !token) {
      router.push("/login");
      return;
    }
    setEnrolling(true);
    setMessage("");
    try {
      await enrollInCourse(token, documentId, user.documentId ?? user.id);
      setEnrolled(true);
      setMessage("Successfully enrolled!");
    } catch (err: any) {
      setMessage(err.message || "Could not enroll");
    } finally {
      setEnrolling(false);
    }
  }

  if (loading) return <div className="py-24 text-center text-muted">Loading...</div>;
  if (!course) return <div className="py-24 text-center text-muted">Course not found.</div>;

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 grid md:grid-cols-3 gap-10">
      <div className="md:col-span-2">
        <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted mb-6">
          <span className="flex items-center gap-1">
            <User className="h-4 w-4" /> {course.instructor?.username || "Unassigned"}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" /> {course.lessons?.length ?? 0} lessons
          </span>
        </div>
        <p className="text-foreground/90 leading-relaxed mb-10">{course.description}</p>

        <h2 className="text-lg font-semibold mb-4">Curriculum</h2>
        <div className="flex flex-col gap-2">
          {(course.lessons || [])
            .slice()
            .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
            .map((lesson: any, i: number) => (
              <div key={lesson.documentId} className="card p-4 flex items-center justify-between">
                <span className="text-sm font-medium">
                  {i + 1}. {lesson.title}
                </span>
                {enrolled && (
                  <Link
                    href={`/learn/${course.documentId}/${lesson.documentId}`}
                    className="text-xs text-accent font-medium hover:underline"
                  >
                    View
                  </Link>
                )}
              </div>
            ))}
          {(!course.lessons || course.lessons.length === 0) && (
            <p className="text-sm text-muted">No lessons added yet.</p>
          )}
        </div>
      </div>

      <div>
        <div className="card p-6 sticky top-24">
          <div className="h-32 bg-surface-muted rounded-lg mb-5 flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-muted" strokeWidth={1.5} />
          </div>
          {enrolled ? (
            <div className="flex items-center gap-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg px-3 py-2 mb-3">
              <CheckCircle2 className="h-4 w-4" /> You&apos;re enrolled
            </div>
          ) : (
            <button
              onClick={handleEnroll}
              disabled={enrolling || (!!user && user.role?.name !== "Student")}
              className="btn-primary w-full mb-3"
            >
              {enrolling ? "Enrolling..." : "Enroll Now"}
            </button>
          )}
          {message && <p className="text-xs text-muted">{message}</p>}
          {user && user.role?.name !== "Student" && !enrolled && (
            <p className="text-xs text-muted">Only students can enroll in courses.</p>
          )}
        </div>
      </div>
    </div>
  );
}
