export const endpoints = {
  login: () => `${process.env.REACT_APP_API_KEY}/api/auth/login`,
  registration: () => `${process.env.REACT_APP_API_KEY}/api/auth/registration`,
};
