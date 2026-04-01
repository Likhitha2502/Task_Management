const TEMP_PASSWORD_FLAG = 'focusflow_temp_password';

export const tempAuthService = {
  setTempPasswordFlag(): void {
    localStorage.setItem(TEMP_PASSWORD_FLAG, 'true');
  },

  isTempPassword(): boolean {
    return localStorage.getItem(TEMP_PASSWORD_FLAG) === 'true';
  },

  clearTempPasswordFlag(): void {
    localStorage.removeItem(TEMP_PASSWORD_FLAG);
  },
};
