import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::lesson.lesson', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    const userRole = user.role.name;

    if (userRole === 'Instructor') {
      const courseId = ctx.request.body?.data?.course;
      if (!courseId) {
        return ctx.badRequest('course is required');
      }

      const course = await strapi.documents('api::course.course').findOne({
        documentId: courseId,
        populate: ['instructor'],
      });

      if (!course) {
        return ctx.notFound('Course not found');
      }

      const instructorId = (course as any).instructor?.id;
      if (instructorId !== user.id) {
        return ctx.forbidden('You can only add lessons to your own courses');
      }
    }

    return super.create(ctx);
  },

  async update(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;
    const userRole = user.role.name;

    if (userRole === 'Instructor') {
      const lesson = await strapi.documents('api::lesson.lesson').findOne({
        documentId: id,
        populate: { course: { populate: ['instructor'] } },
      });

      if (!lesson) {
        return ctx.notFound('Lesson not found');
      }

      const instructorId = (lesson as any).course?.instructor?.id;
      if (instructorId !== user.id) {
        return ctx.forbidden('You can only edit lessons in your own courses');
      }
    }

    return super.update(ctx);
  },

  async delete(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;
    const userRole = user.role.name;

    if (userRole === 'Instructor') {
      const lesson = await strapi.documents('api::lesson.lesson').findOne({
        documentId: id,
        populate: { course: { populate: ['instructor'] } },
      });

      if (!lesson) {
        return ctx.notFound('Lesson not found');
      }

      const instructorId = (lesson as any).course?.instructor?.id;
      if (instructorId !== user.id) {
        return ctx.forbidden('You can only delete lessons in your own courses');
      }
    }

    return super.delete(ctx);
  },
}));