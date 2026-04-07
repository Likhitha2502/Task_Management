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
    userInfo: (email: string) => `${BASE.profile}/${email}`,
    updateUserInfo: `${BASE.profile}`,
  }
};
