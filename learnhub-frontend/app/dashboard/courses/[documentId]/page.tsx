"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import {
  getCourse,
  createLesson,
  createQuiz,
  createQuestion,
} from "@/lib/api";
import { PlusCircle } from "lucide-react";

function ManageCourseDetail({ token }: { token: string }) {
  const params = useParams();
  const documentId = params.documentId as string;
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [savingLesson, setSavingLesson] = useState(false);

  const [quizTitle, setQuizTitle] = useState("");
  const [savingQuiz, setSavingQuiz] = useState(false);

  const [qText, setQText] = useState("");
  const [qOptions, setQOptions] = useState(["", "", "", ""]);
  const [qCorrect, setQCorrect] = useState(0);
  const [selectedQuiz, setSelectedQuiz] = useState<string>("");
  const [savingQuestion, setSavingQuestion] = useState(false);

  function load() {
    getCourse(documentId, token)
      .then(setCourse)
      .finally(() => setLoading(false));
  }

  useEffect(load, [documentId, token]);

  async function handleAddLesson(e: React.FormEvent) {
    e.preventDefault();
    setSavingLesson(true);
    try {
      await createLesson(token, {
        title: lessonTitle,
        content: lessonContent,
        videoUrl: lessonVideoUrl,
        order: (course.lessons?.length || 0) + 1,
        course: documentId,
      });
      setLessonTitle("");
      setLessonContent("");
      setLessonVideoUrl("");
      load();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingLesson(false);
    }
  }

  async function handleAddQuiz(e: React.FormEvent) {
    e.preventDefault();
    setSavingQuiz(true);
    try {
      await createQuiz(token, { title: quizTitle, course: documentId });
      setQuizTitle("");
      load();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingQuiz(false);
    }
  }

  async function handleAddQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedQuiz) {
      alert("Select a quiz first");
      return;
    }
    setSavingQuestion(true);
    try {
      await createQuestion(token, {
        text: qText,
        options: qOptions,
        correctOptionIndex: qCorrect,
        quiz: selectedQuiz,
      });
      setQText("");
      setQOptions(["", "", "", ""]);
      setQCorrect(0);
      load();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingQuestion(false);
    }
  }

  if (loading) return <p className="text-sm text-muted">Loading...</p>;
  if (!course) return <p className="text-sm text-muted">Course not found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">{course.title}</h1>
      <p className="text-muted mb-10">Manage lessons and quizzes for this course.</p>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Lessons */}
        <div>
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <PlusCircle className="h-4 w-4 text-accent" /> Add Lesson
          </h2>
          <form onSubmit={handleAddLesson} className="card p-5 flex flex-col gap-3 mb-6">
            <input
              className="input-field"
              placeholder="Lesson title"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              required
            />
            <textarea
              className="input-field"
              placeholder="Content"
              rows={3}
              value={lessonContent}
              onChange={(e) => setLessonContent(e.target.value)}
            />
            <input
              className="input-field"
              placeholder="Video URL (optional)"
              value={lessonVideoUrl}
              onChange={(e) => setLessonVideoUrl(e.target.value)}
            />
            <button type="submit" disabled={savingLesson} className="btn-primary self-start text-sm">
              {savingLesson ? "Adding..." : "Add Lesson"}
            </button>
          </form>

          <h3 className="text-sm font-semibold mb-2">Lessons ({course.lessons?.length || 0})</h3>
          <div className="flex flex-col gap-2">
            {(course.lessons || []).map((l: any, i: number) => (
              <div key={l.documentId} className="card p-3 text-sm">
                {i + 1}. {l.title}
              </div>
            ))}
          </div>
        </div>

        {/* Quizzes */}
        <div>
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <PlusCircle className="h-4 w-4 text-accent" /> Add Quiz
          </h2>
          <form onSubmit={handleAddQuiz} className="card p-5 flex flex-col gap-3 mb-6">
            <input
              className="input-field"
              placeholder="Quiz title"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              required
            />
            <button type="submit" disabled={savingQuiz} className="btn-primary self-start text-sm">
              {savingQuiz ? "Adding..." : "Add Quiz"}
            </button>
          </form>

          <h3 className="text-sm font-semibold mb-2">Quizzes ({course.quizzes?.length || 0})</h3>
          <div className="flex flex-col gap-2 mb-6">
            {(course.quizzes || []).map((q: any) => (
              <div key={q.documentId} className="card p-3 text-sm">
                {q.title}
              </div>
            ))}
          </div>

          {course.quizzes?.length > 0 && (
            <>
              <h3 className="text-sm font-semibold mb-2">Add Question</h3>
              <form onSubmit={handleAddQuestion} className="card p-5 flex flex-col gap-3">
                <select
                  className="input-field"
                  value={selectedQuiz}
                  onChange={(e) => setSelectedQuiz(e.target.value)}
                  required
                >
                  <option value="">Select quiz</option>
                  {course.quizzes.map((q: any) => (
                    <option key={q.documentId} value={q.documentId}>
                      {q.title}
                    </option>
                  ))}
                </select>
                <input
                  className="input-field"
                  placeholder="Question text"
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  required
                />
                {qOptions.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={qCorrect === i}
                      onChange={() => setQCorrect(i)}
                    />
                    <input
                      className="input-field"
                      placeholder={`Option ${i + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const copy = [...qOptions];
                        copy[i] = e.target.value;
                        setQOptions(copy);
                      }}
                      required
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={savingQuestion}
                  className="btn-primary self-start text-sm"
                >
                  {savingQuestion ? "Adding..." : "Add Question"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CourseManagePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <RequireAuth allowedRoles={["Admin", "Content Manager", "Instructor"]}>
        {(_user, token) => <ManageCourseDetail token={token} />}
      </RequireAuth>
    </div>
  );
}
