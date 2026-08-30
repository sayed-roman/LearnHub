/* eslint-disable @typescript-eslint/no-explicit-any */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

async function handle(res: Response) {
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("learnhub_token");
      localStorage.removeItem("learnhub_user");
    }
    throw new Error(data?.error?.message || "Request failed");
  }
  return data;
}

function authHeaders(token?: string | null) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

// ---------- Auth ----------

export async function loginUser(identifier: string, password: string) {
  const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ identifier, password }),
  });
  return handle(res);
}

export async function registerUser(username: string, email: string, password: string) {
  const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ username, email, password }),
  });
  return handle(res);
}

export async function getCurrentUser(token: string) {
  const res = await fetch(`${STRAPI_URL}/api/me-with-role`, {
    headers: authHeaders(token),
  });
  return handle(res);
}

// ---------- Courses ----------

export async function getCourses(token?: string | null) {
  const res = await fetch(`${STRAPI_URL}/api/courses?populate=instructor`, {
    headers: authHeaders(token),
  });
  const data = await handle(res);
  return data.data;
}

export async function getCourse(documentId: string, token?: string | null) {
  const res = await fetch(
    `${STRAPI_URL}/api/courses/${documentId}?populate[instructor]=true&populate[lessons]=true&populate[quizzes]=true`,
    { headers: authHeaders(token) }
  );
  const data = await handle(res);
  return data.data;
}

export async function createCourse(token: string, payload: any) {
  const res = await fetch(`${STRAPI_URL}/api/courses`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ data: payload }),
  });
  return handle(res);
}

export async function updateCourse(token: string, documentId: string, payload: any) {
  const res = await fetch(`${STRAPI_URL}/api/courses/${documentId}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ data: payload }),
  });
  return handle(res);
}

export async function deleteCourse(token: string, documentId: string) {
  const res = await fetch(`${STRAPI_URL}/api/courses/${documentId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error?.message || "Delete failed");
  }
}

// ---------- Lessons ----------

export async function getLesson(documentId: string, token?: string | null) {
  const res = await fetch(`${STRAPI_URL}/api/lessons/${documentId}?populate=course`, {
    headers: authHeaders(token),
  });
  const data = await handle(res);
  return data.data;
}

export async function createLesson(token: string, payload: any) {
  const res = await fetch(`${STRAPI_URL}/api/lessons`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ data: payload }),
  });
  return handle(res);
}

export async function updateLesson(token: string, documentId: string, payload: any) {
  const res = await fetch(`${STRAPI_URL}/api/lessons/${documentId}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ data: payload }),
  });
  return handle(res);
}

export async function deleteLesson(token: string, documentId: string) {
  const res = await fetch(`${STRAPI_URL}/api/lessons/${documentId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error?.message || "Delete failed");
  }
}

// ---------- Enrollments ----------

export async function enrollInCourse(
  token: string,
  courseDocumentId: string,
  studentDocumentId: string | number
) {
  const res = await fetch(`${STRAPI_URL}/api/enrollments`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({
      data: {
        course: { connect: [{ documentId: courseDocumentId }] },
        student: { connect: [{ documentId: String(studentDocumentId) }] },
        enrolledAt: new Date().toISOString(),
      },
    }),
  });
  return handle(res);
}

export async function getMyEnrollments(
  token: string,
  studentDocumentId: string,
  studentId?: number
) {
  const res = await fetch(`${STRAPI_URL}/api/enrollments?populate[student]=true&populate[course]=true`, {
    headers: authHeaders(token),
  });
  const data = await handle(res);
  return data.data.filter((e: any) => {
    const matchStudent = e.student;
    return (
      matchStudent?.documentId === studentDocumentId ||
      matchStudent?.id === studentId ||
      matchStudent?.id === Number(studentDocumentId)
    );
  });
}

// ---------- Lesson Progress ----------

export async function getLessonProgress(
  token: string,
  studentDocumentId: string,
  studentId?: number
) {
  const res = await fetch(
    `${STRAPI_URL}/api/lesson-progresses?populate[student]=true&populate[lesson]=true`,
    { headers: authHeaders(token) }
  );
  const data = await handle(res);
  return data.data.filter((p: any) => {
    const matchStudent = p.student;
    return (
      matchStudent?.documentId === studentDocumentId ||
      matchStudent?.id === studentId ||
      matchStudent?.id === Number(studentDocumentId)
    );
  });
}

export async function markLessonComplete(
  token: string,
  studentDocumentId: string,
  lessonDocumentId: string,
  studentId?: number
) {
  // fetch all progress records with relations populated, then filter client-side
  // (Strapi v5 has a known issue filtering server-side by relations to the User model)
  const res = await fetch(
    `${STRAPI_URL}/api/lesson-progresses?populate[student]=true&populate[lesson]=true`,
    { headers: authHeaders(token) }
  );
  const data = await handle(res);
  const existing = data.data.find(
    (p: any) =>
      (p.student?.documentId === studentDocumentId ||
        p.student?.id === studentId ||
        p.student?.id === Number(studentDocumentId)) &&
      p.lesson?.documentId === lessonDocumentId
  );

  if (existing) {
    const updateRes = await fetch(`${STRAPI_URL}/api/lesson-progresses/${existing.documentId}`, {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify({ data: { completed: true, completedAt: new Date().toISOString() } }),
    });
    return handle(updateRes);
  } else {
    const createRes = await fetch(`${STRAPI_URL}/api/lesson-progresses`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({
        data: {
          student: { connect: [{ documentId: String(studentDocumentId) }] },
          lesson: { connect: [{ documentId: lessonDocumentId }] },
          completed: true,
          completedAt: new Date().toISOString(),
        },
      }),
    });
    return handle(createRes);
  }
}

// ---------- Quizzes ----------

export async function getQuiz(documentId: string, token?: string | null) {
  const res = await fetch(`${STRAPI_URL}/api/quizzes/${documentId}?populate=questions`, {
    headers: authHeaders(token),
  });
  const data = await handle(res);
  return data.data;
}

export async function createQuiz(token: string, payload: any) {
  const res = await fetch(`${STRAPI_URL}/api/quizzes`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ data: payload }),
  });
  return handle(res);
}

export async function createQuestion(token: string, payload: any) {
  const res = await fetch(`${STRAPI_URL}/api/questions`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ data: payload }),
  });
  return handle(res);
}

export async function submitQuiz(
  token: string,
  studentDocumentId: string,
  quizDocumentId: string,
  score: number
) {
  const res = await fetch(`${STRAPI_URL}/api/quiz-submissions`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({
      data: {
        student: { connect: [{ documentId: String(studentDocumentId) }] },
        quiz: { connect: [{ documentId: quizDocumentId }] },
        score,
        submittedAt: new Date().toISOString(),
      },
    }),
  });
  return handle(res);
}

export async function getMyQuizSubmissions(
  token: string,
  studentDocumentId: string,
  studentId?: number
) {
  const res = await fetch(
    `${STRAPI_URL}/api/quiz-submissions?populate[student]=true&populate[quiz]=true`,
    { headers: authHeaders(token) }
  );
  const data = await handle(res);
  return data.data.filter((s: any) => {
    const matchStudent = s.student;
    return (
      matchStudent?.documentId === studentDocumentId ||
      matchStudent?.id === studentId ||
      matchStudent?.id === Number(studentDocumentId)
    );
  });
}

// ---------- Blog ----------

export async function getBlogPosts(token?: string | null) {
  const res = await fetch(`${STRAPI_URL}/api/blog-posts?populate=author`, {
    headers: authHeaders(token),
  });
  const data = await handle(res);
  return data.data;
}

export async function getBlogPost(documentId: string, token?: string | null) {
  const res = await fetch(`${STRAPI_URL}/api/blog-posts/${documentId}?populate=author`, {
    headers: authHeaders(token),
  });
  const data = await handle(res);
  return data.data;
}

export async function createBlogPost(token: string, payload: any) {
  const res = await fetch(`${STRAPI_URL}/api/blog-posts`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ data: payload }),
  });
  return handle(res);
}

export async function updateBlogPost(token: string, documentId: string, payload: any) {
  const res = await fetch(`${STRAPI_URL}/api/blog-posts/${documentId}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ data: payload }),
  });
  return handle(res);
}

// ---------- Admin: Users ----------

export async function getAllUsers(token: string) {
  const res = await fetch(`${STRAPI_URL}/api/users?populate=role`, {
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error?.message || "Failed to fetch users");
  }
  return res.json();
}

export async function getAllRoles(token: string) {
  const res = await fetch(`${STRAPI_URL}/api/users-permissions/roles`, {
    headers: authHeaders(token),
  });
  const data = await handle(res);
  return data.roles;
}

export async function changeUserRole(token: string, userId: number, roleId: number) {
  const res = await fetch(`${STRAPI_URL}/api/user-roles/${userId}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ role: roleId }),
  });
  return handle(res);
}