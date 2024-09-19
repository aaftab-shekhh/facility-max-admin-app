import {instance} from './instances';

export const authAPI = {
  verifyPassword(body: {password: string; email: string}) {
    return instance.post('auth/verify-password', body);
  },

  sendVerificationCode(body: {email: string}) {
    return instance.post('auth/send-verification-code', body);
  },

  logIn(body: {password: string; email: string; verificationCode: number}) {
    return instance.patch('auth/sign-in', body);
  },

  logOut() {
    return instance.delete('auth/logout');
  },

  checkVerificationCode(body: {email: string; verificationCode: number}) {
    return instance.post('auth/verify-verification-code', body);
  },

  setNewPassword(body: {
    email: string;
    password: string;
    verificationCode: number;
  }) {
    return instance.patch('auth/forgot-password', body);
  },

  changePassword(body: {
    email: string;
    password?: string;
    newPassword: string;
  }) {
    return instance.post('auth/change-password', body);
  },
};
