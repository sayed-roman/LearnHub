export default {
  routes: [
    {
      method: 'PUT',
      path: '/user-roles/:id',
      handler: 'user-role.updateRole',
      config: {
        policies: [],
      },
    },
  ],
};