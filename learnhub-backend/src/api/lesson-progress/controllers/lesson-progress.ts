import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::lesson-progress.lesson-progress', ({ strapi }) => ({
  async create(ctx) {
    const { student, lesson, completed, completedAt } = ctx.request.body?.data || {};

    if (!student || !lesson) {
      return ctx.badRequest('student and lesson are required');
    }

    const entry = await strapi.documents('api::lesson-progress.lesson-progress').create({
      data: {
        student,
        lesson,
        completed: completed ?? false,
        completedAt: completedAt || null,
      },
      populate: ['student', 'lesson'],
    });

    ctx.body = { data: entry };
  },

  async update(ctx) {
    const { id } = ctx.params;
    const { completed, completedAt } = ctx.request.body?.data || {};

    const entry = await strapi.documents('api::lesson-progress.lesson-progress').update({
      documentId: id,
      data: { completed, completedAt },
      populate: ['student', 'lesson'],
    });

    ctx.body = { data: entry };
  },

  async find(ctx) {
    const user = ctx.state.user;
    const all = await strapi.documents('api::lesson-progress.lesson-progress').findMany({
      populate: { student: true, lesson: { populate: { course: { populate: ['instructor'] } } } },
    });

    let filtered = all;
    if (user?.role?.name === 'Student') {
      filtered = all.filter((p: any) => p.student?.id === user.id);
    } else if (user?.role?.name === 'Instructor') {
      filtered = all.filter((p: any) => p.lesson?.course?.instructor?.id === user.id);
    }

    ctx.body = {
      data: filtered,
      meta: { pagination: { page: 1, pageSize: filtered.length, pageCount: 1, total: filtered.length } },
    };
  },
}));