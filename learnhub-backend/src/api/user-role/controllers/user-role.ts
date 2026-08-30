export default {
  async updateRole(ctx: any) {
    const requester = ctx.state.user;

    if (!requester) {
      return ctx.unauthorized('You must be logged in');
    }

    if (requester.role.name !== 'Admin') {
      return ctx.forbidden('Only Admin can change user roles');
    }

    const { id } = ctx.params;
    const { role } = ctx.request.body;

    if (!role) {
      return ctx.badRequest('role is required');
    }

    const updatedUser = await strapi
      .plugin('users-permissions')
      .service('user')
      .edit(id, { role });

    ctx.body = updatedUser;
  },

  async getMeWithRole(ctx: any) {
    const requester = ctx.state.user;

    if (!requester) {
      return ctx.unauthorized('You must be logged in');
    }

    const fullUser = await strapi.documents('plugin::users-permissions.user').findOne({
      documentId: requester.documentId,
      populate: ['role'],
    });

    ctx.body = fullUser;
  },
};