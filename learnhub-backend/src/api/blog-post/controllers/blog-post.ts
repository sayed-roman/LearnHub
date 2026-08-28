import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::blog-post.blog-post', ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;

    // Public visitors and Students only see published posts
    if (!user || user.role.name === 'Student') {
      ctx.query = {
        ...ctx.query,
        filters: {
          ...(ctx.query.filters as object),
          publishStatus: 'published',
        },
      };
    }

    return super.find(ctx);
  },

  async findOne(ctx) {
    const user = ctx.state.user;

    if (!user || user.role.name === 'Student') {
      const { id } = ctx.params;
      const post = await strapi.documents('api::blog-post.blog-post').findOne({
        documentId: id,
      });

      if (!post || (post as any).publishStatus !== 'published') {
        return ctx.notFound('Blog post not found');
      }
    }

    return super.findOne(ctx);
  },

  async update(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;
    const userRole = user.role.name;

    if (userRole === 'Content Manager') {
      const post = await strapi.documents('api::blog-post.blog-post').findOne({
        documentId: id,
        populate: ['author'],
      });

      if (!post) {
        return ctx.notFound('Blog post not found');
      }

      const authorId = (post as any).author?.id;
      if (authorId !== user.id) {
        return ctx.forbidden('You can only edit your own blog posts');
      }
    }

    return super.update(ctx);
  },

  async delete(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;
    const userRole = user.role.name;

    if (userRole === 'Content Manager') {
      const post = await strapi.documents('api::blog-post.blog-post').findOne({
        documentId: id,
        populate: ['author'],
      });

      if (!post) {
        return ctx.notFound('Blog post not found');
      }

      const authorId = (post as any).author?.id;
      if (authorId !== user.id) {
        return ctx.forbidden('You can only delete your own blog posts');
      }
    }

    return super.delete(ctx);
  },
}));