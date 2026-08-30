import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::enrollment.enrollment', ({ strapi }) => ({
  async create(ctx) {
    const { course, student, enrolledAt } = ctx.request.body?.data || {};

    if (!course || !student) {
      return ctx.badRequest('course and student are required');
    }

    const entry = await strapi.documents('api::enrollment.enrollment').create({
      data: {
        course,
        student,
        enrolledAt: enrolledAt || new Date().toISOString(),
      },
      populate: ['student', 'course'],
    });

    ctx.body = { data: entry };
  },

  async find(ctx) {
    const user = ctx.state.user;
    const all = await strapi.documents('api::enrollment.enrollment').findMany({
      populate: { student: true, course: { populate: ['instructor'] } },
    });

    let filtered = all;
    if (user?.role?.name === 'Student') {
      filtered = all.filter((e: any) => e.student?.id === user.id);
    } else if (user?.role?.name === 'Instructor') {
      filtered = all.filter((e: any) => e.course?.instructor?.id === user.id);
    }

    ctx.body = {
      data: filtered,
      meta: { pagination: { page: 1, pageSize: filtered.length, pageCount: 1, total: filtered.length } },
    };
  },
}));