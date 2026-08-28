import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::course.course', ({ strapi }) => ({
  async update(ctx) {
    const { id } = ctx.params; // this is the documentId in Strapi v5
    const user = ctx.state.user;

    const course = await strapi.documents('api::course.course').findOne({
      documentId: id,
      populate: ['instructor'],
    });

    if (!course) {
      return ctx.notFound('Course not found');
    }

    const userRole = user.role.name;

    if (userRole === 'Instructor') {
      const instructorId = (course as any).instructor?.id;
      if (instructorId !== user.id) {
        return ctx.forbidden('You can only edit your own courses');
      }
    }

    return super.update(ctx);
  },

  async delete(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    const course = await strapi.documents('api::course.course').findOne({
      documentId: id,
      populate: ['instructor'],
    });

    if (!course) {
      return ctx.notFound('Course not found');
    }

    const userRole = user.role.name;

    if (userRole === 'Instructor') {
      const instructorId = (course as any).instructor?.id;
      if (instructorId !== user.id) {
        return ctx.forbidden('You can only delete your own courses');
      }
    }

    return super.delete(ctx);
  },
}));