const routes = {
  home: () => "/",
  users: {
    create: (nameRole) => `/${nameRole}/createUser`,
    read: {
      collection: (nameRole) => `/${nameRole}/users`,
      single: (userId) => `/users/${userId}`,
    },
    update: (userId) => `/users/${userId}/edit`,
  },
  sign: {
    in: () => "/sign-in",
  },
}

export default routes
