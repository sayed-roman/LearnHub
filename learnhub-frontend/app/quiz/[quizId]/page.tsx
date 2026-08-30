"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import { getQuiz, submitQuiz } from "@/lib/api";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";

function QuizRunner({ user, token }: { user: any; token: string }) {
  const params = useParams();
  const quizId = params.quizId as string;

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getQuiz(quizId, token)
      .then(setQuiz)
      .finally(() => setLoading(false));
  }, [quizId, token]);

  if (loading) return <div className="py-24 text-center text-muted">Loading...</div>;
  if (!quiz) return <div className="py-24 text-center text-muted">Quiz not found.</div>;

  const questions = quiz.questions || [];
  const question = questions[current];

  function selectOption(optionIndex: number) {
    setAnswers((prev) => ({ ...prev, [question.documentId]: optionIndex }));
  }

  async function handleSubmit() {
    let correct = 0;
    questions.forEach((q: any) => {
      if (answers[q.documentId] === q.correctOptionIndex) correct += 1;
    });
    const pct = Math.round((correct / questions.length) * 100);
    setScore(pct);
    setSubmitting(true);
    try {
      await submitQuiz(token, user.id, quizId, pct);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <p className="text-sm text-muted mb-2">Quiz Complete</p>
        <p className="text-6xl font-bold text-accent mb-4">{score}%</p>
        <p className="text-muted mb-8">
          You answered{" "}
          {Math.round((score / 100) * questions.length)} out of {questions.length} questions
          correctly.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setAnswers({});
            setCurrent(0);
          }}
          className="btn-secondary inline-flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" /> Retry Quiz
        </button>
      </div>
    );
  }

  if (!question) return <div className="py-24 text-center text-muted">This quiz has no questions yet.</div>;

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <p className="text-sm text-muted mb-2">
        Question {current + 1} of {questions.length}
      </p>
      <div className="w-full bg-surface-muted rounded-full h-1.5 mb-8">
        <div
          className="bg-accent h-1.5 rounded-full transition-all"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>

      <h1 className="text-xl font-semibold mb-6">{question.text}</h1>

      <div className="flex flex-col gap-3 mb-8">
        {(question.option || []).map((opt: string, i: number) => (
          <button
            key={i}
            onClick={() => selectOption(i)}
            className={`card text-left px-4 py-3 text-sm font-medium ${
              answers[question.documentId] === i ? "border-accent bg-accent/5" : ""
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="btn-secondary text-sm disabled:opacity-40"
        >
          Previous
        </button>
        {current < questions.length - 1 ? (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            disabled={answers[question.documentId] === undefined}
            className="btn-primary text-sm"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={answers[question.documentId] === undefined || submitting}
            className="btn-primary text-sm"
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <RequireAuth allowedRoles={["Student"]}>
      {(user, token) => <QuizRunner user={user} token={token} />}
    </RequireAuth>
  );
}
