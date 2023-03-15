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
  nav: {
    create: (nameRole) => `/${nameRole}/createNav`,
    read: {
      collection: (nameRole) => `/${nameRole}/nav`,
      single: (navId) => `/nav/${navId}`,
    },
    update: (navId) => `/nav/${navId}/edit`,
  },
  pages: {
    create: () => `/createPage`,
    read: {
      collection: () => `/pages`,
      single: (pageId) => `/page/${pageId}`,
      contentPage: (slug) => `/pages/content/${slug}`,
    },
    update: (pageId) => `/page/${pageId}/edit`,
    updateContent: (pageId) => `/pages/${pageId}/edit`,
  },
  sign: {
    in: () => "/sign-in",
  },
}

export default routes
