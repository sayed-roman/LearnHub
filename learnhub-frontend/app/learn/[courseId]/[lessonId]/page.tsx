"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import { getCourse, markLessonComplete, getLessonProgress } from "@/lib/api";
import { CheckCircle2, ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";

function LessonViewer({ user, token }: { user: any; token: string }) {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const [course, setCourse] = useState<any>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [marking, setMarking] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    const c = await getCourse(courseId, token);
    setCourse(c);
    if (user.role?.name === "Student") {
      const progress = await getLessonProgress(token, user.id);
      setCompletedIds(
        progress.filter((p: any) => p.completed).map((p: any) => p.lesson?.documentId)
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, lessonId]);

  if (loading || !course) return <div className="py-24 text-center text-muted">Loading...</div>;

  const lessons = (course.lessons || []).slice().sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
  const currentIndex = lessons.findIndex((l: any) => l.documentId === lessonId);
  const lesson = lessons[currentIndex];
  const prevLesson = lessons[currentIndex - 1];
  const nextLesson = lessons[currentIndex + 1];
  const isComplete = completedIds.includes(lessonId);
  const progressPct = lessons.length > 0 ? Math.round((completedIds.length / lessons.length) * 100) : 0;

  async function handleMarkComplete() {
    setMarking(true);
    try {
      await markLessonComplete(token, user.id, lessonId);
      await load();
    } finally {
      setMarking(false);
    }
  }

  if (!lesson) return <div className="py-24 text-center text-muted">Lesson not found.</div>;

  return (
    <div className="grid md:grid-cols-[280px_1fr] min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="border-r border-border p-5 hidden md:block">
        <p className="font-semibold text-sm mb-1">{course.title}</p>
        <div className="w-full bg-surface-muted rounded-full h-1.5 mb-4">
          <div
            className="bg-accent h-1.5 rounded-full transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-xs text-muted mb-4">{progressPct}% complete</p>
        <div className="flex flex-col gap-1">
          {lessons.map((l: any, i: number) => (
            <Link
              key={l.documentId}
              href={`/learn/${courseId}/${l.documentId}`}
              className={`text-sm px-3 py-2 rounded-lg flex items-center gap-2 ${
                l.documentId === lessonId
                  ? "bg-accent/10 text-accent font-medium"
                  : "hover:bg-surface-muted"
              }`}
            >
              {completedIds.includes(l.documentId) ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
              ) : (
                <PlayCircle className="h-4 w-4 text-muted shrink-0" />
              )}
              <span className="line-clamp-1">
                {i + 1}. {l.title}
              </span>
            </Link>
          ))}
        </div>
      </aside>

      {/* Content */}
      <div className="p-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
        {lesson.videoUrl && (
          <div className="mb-6 rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center text-white text-sm">
            Video: {lesson.videoUrl}
          </div>
        )}
        <p className="leading-relaxed text-foreground/90 whitespace-pre-line mb-10">
          {lesson.content}
        </p>

        <div className="flex items-center justify-between border-t border-border pt-6">
          {prevLesson ? (
            <Link
              href={`/learn/${courseId}/${prevLesson.documentId}`}
              className="btn-secondary text-sm flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Link>
          ) : (
            <span />
          )}

          {user.role?.name === "Student" && (
            <button
              onClick={handleMarkComplete}
              disabled={marking || isComplete}
              className="btn-primary text-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              {isComplete ? "Completed" : marking ? "Saving..." : "Mark Complete"}
            </button>
          )}

          {nextLesson ? (
            <Link
              href={`/learn/${courseId}/${nextLesson.documentId}`}
              className="btn-secondary text-sm flex items-center gap-1"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            course.quizzes?.length > 0 && (
              <button
                onClick={() => router.push(`/quiz/${course.quizzes[0].documentId}`)}
                className="btn-secondary text-sm"
              >
                Take Quiz &rarr;
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default function LessonPage() {
  return (
    <RequireAuth>{(user, token) => <LessonViewer user={user} token={token} />}</RequireAuth>
  );
}