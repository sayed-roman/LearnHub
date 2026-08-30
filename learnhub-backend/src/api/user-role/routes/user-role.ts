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
    {
      method: 'GET',
      path: '/me-with-role',
      handler: 'user-role.getMeWithRole',
      config: {
        policies: [],
      },
    },
  ],
};