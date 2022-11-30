export const setAuthToken = (key) =>
  window.localStorage.setItem("factory-token", key);
export const getAuthToken = () => window.localStorage.getItem("factory-token");
export const removeAuthToken = () =>
  window.localStorage.removeItem("factory-token");
