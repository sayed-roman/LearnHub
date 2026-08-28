import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::question.question', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    const userRole = user.role.name;

    if (userRole === 'Instructor') {
      const quizId = ctx.request.body?.data?.quiz;
      if (!quizId) {
        return ctx.badRequest('quiz is required');
      }

      const quiz = await strapi.documents('api::quiz.quiz').findOne({
        documentId: quizId,
        populate: ['course.instructor'],
      });

      if (!quiz) {
        return ctx.notFound('Quiz not found');
      }

      const instructorId = (quiz as any).course?.instructor?.id;
      if (instructorId !== user.id) {
        return ctx.forbidden('You can only add questions to your own quizzes');
      }
    }

    return super.create(ctx);
  },

  async update(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;
    const userRole = user.role.name;

    if (userRole === 'Instructor') {
      const question = await strapi.documents('api::question.question').findOne({
        documentId: id,
        populate: ['quiz.course.instructor'],
      });

      if (!question) {
        return ctx.notFound('Question not found');
      }

      const instructorId = (question as any).quiz?.course?.instructor?.id;
      if (instructorId !== user.id) {
        return ctx.forbidden('You can only edit questions in your own quizzes');
      }
    }

    return super.update(ctx);
  },

  async delete(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;
    const userRole = user.role.name;

    if (userRole === 'Instructor') {
      const question = await strapi.documents('api::question.question').findOne({
        documentId: id,
        populate: ['quiz.course.instructor'],
      });

      if (!question) {
        return ctx.notFound('Question not found');
      }

      const instructorId = (question as any).quiz?.course?.instructor?.id;
      if (instructorId !== user.id) {
        return ctx.forbidden('You can only delete questions in your own quizzes');
      }
    }

    return super.delete(ctx);
  },
}));