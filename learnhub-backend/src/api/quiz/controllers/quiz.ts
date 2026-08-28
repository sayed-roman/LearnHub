import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::quiz.quiz', ({ strapi }) => ({
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
        return ctx.forbidden('You can only add quizzes to your own courses');
      }
    }

    return super.create(ctx);
  },

  async update(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;
    const userRole = user.role.name;

    if (userRole === 'Instructor') {
      const quiz = await strapi.documents('api::quiz.quiz').findOne({
        documentId: id,
        populate: ['course.instructor'],
      });

      if (!quiz) {
        return ctx.notFound('Quiz not found');
      }

      const instructorId = (quiz as any).course?.instructor?.id;
      if (instructorId !== user.id) {
        return ctx.forbidden('You can only edit quizzes in your own courses');
      }
    }

    return super.update(ctx);
  },

  async delete(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;
    const userRole = user.role.name;

    if (userRole === 'Instructor') {
      const quiz = await strapi.documents('api::quiz.quiz').findOne({
        documentId: id,
        populate: ['course.instructor'],
      });

      if (!quiz) {
        return ctx.notFound('Quiz not found');
      }

      const instructorId = (quiz as any).course?.instructor?.id;
      if (instructorId !== user.id) {
        return ctx.forbidden('You can only delete quizzes in your own courses');
      }
    }

    return super.delete(ctx);
  },
}));