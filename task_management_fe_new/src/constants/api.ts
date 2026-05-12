const BASE = {
  auth: '/auth',
  profile: '/profile',
} as const;

export const api = {
  auth: {
    register: `${BASE.auth}/register`,
    login: `${BASE.auth}/login`,
    logout: `${BASE.auth}/logout`,
    resetPassword: `${BASE.auth}/reset-password`,
    forgotPassword: `${BASE.auth}/forgot-password`,
  },
  profile: {
    changePassword: `${BASE.profile}/change-password`,
    userInfo: `${BASE.profile}`,
    userIcon: `${BASE.profile}/picture`,
  },
  tasks: {
    getAll: '/tasks',
    create: '/tasks',
    getById: (id: number) => `/tasks/${id}`,
    update: (id: number) => `/tasks/${id}`,
    delete: (id: number) => `/tasks/${id}`,
  },
  progress: {
    count:   '/progress/count',
    percent: '/progress/percent',
  },
};
