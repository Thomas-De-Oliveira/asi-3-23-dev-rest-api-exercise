import config from "@/config.js"

const apiRoutes = {
  users: {
    create: (nameRole) => `${config.api.baseURL}/${nameRole}/createUser`,
    read: {
      collection: (nameRole) => `${config.api.baseURL}/${nameRole}/users`,
      single: (userId) => `${config.api.baseURL}/users/${userId}`,
    },
    update: (userId) => `${config.api.baseURL}/users/${userId}`,
    delete: (userId) => `${config.api.baseURL}/users/${userId}`,
    sign: {
      in: () => `${config.api.baseURL}/sign-in`,
    },
  },
  roles: {
    read: {
      collection: () => `${config.api.baseURL}/roles`,
    },
  },
  nav: {
    create: () => `${config.api.baseURL}/createNav`,
    read: {
      collectionWithPages: () => `${config.api.baseURL}/navigationPages`,
      collection: () => `${config.api.baseURL}/navigation`,
      single: (navId) => `${config.api.baseURL}/nav/${navId}`,
    },
    update: (navId) => `${config.api.baseURL}/nav/${navId}`,
    delete: (navId) => `${config.api.baseURL}/nav/${navId}`,
  },
}

export default apiRoutes
