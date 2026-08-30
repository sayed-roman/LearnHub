import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::quiz-submission.quiz-submission', ({ strapi }) => ({
  async create(ctx) {
    const { student, quiz, score, submittedAt } = ctx.request.body?.data || {};

    if (!student || !quiz) {
      return ctx.badRequest('student and quiz are required');
    }

    const entry = await strapi.documents('api::quiz-submission.quiz-submission').create({
      data: {
        student,
        quiz,
        score,
        submittedAt: submittedAt || new Date().toISOString(),
      },
      populate: ['student', 'quiz'],
    });

    ctx.body = { data: entry };
  },

  async find(ctx) {
    const user = ctx.state.user;
    const all = await strapi.documents('api::quiz-submission.quiz-submission').findMany({
      populate: { student: true, quiz: { populate: { course: { populate: ['instructor'] } } } },
    });

    let filtered = all;
    if (user?.role?.name === 'Student') {
      filtered = all.filter((s: any) => s.student?.id === user.id);
    } else if (user?.role?.name === 'Instructor') {
      filtered = all.filter((s: any) => s.quiz?.course?.instructor?.id === user.id);
    }

    ctx.body = {
      data: filtered,
      meta: { pagination: { page: 1, pageSize: filtered.length, pageCount: 1, total: filtered.length } },
    };
  },
}));