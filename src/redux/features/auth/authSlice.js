import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: window.localStorage.getItem("factory-user")
    ? JSON.parse(window.localStorage.getItem("factory-user"))
    : null,
  token: window.localStorage.getItem("factory-token") ?? null,
  instances: [],
  loadingCron: false,
  errorConsole: false,
  loadingSuccess: false,
  errorMessage: "",
};

export const counterSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      console.log(payload);
      state.user = payload.login.user;
      state.token = payload.login.token;

      window.localStorage.setItem(
        "factory-user",
        JSON.stringify(payload.login.user)
      );
      window.localStorage.setItem("factory-token", payload.login.token);
    },

    setUpdateUser: (state, { payload }) => {
      state.user = payload.login.user;

      window.localStorage.setItem(
        "factory-user",
        JSON.stringify(payload.login.user)
      );
    },
    removeUser: (state) => {
      state.user = null;
      window.localStorage.removeItem("factory-user");
      window.localStorage.removeItem("factory-token");
    },
    setTitle: (state, { payload }) => {
      state.title = payload.title;
    },
    setDataTable: (state, { payload }) => {
      state.instances = payload.instances;
    },
    setLoadingCron: (state, { payload }) => {
      state.loadingCron = payload.data;
    },
    setLoadingSuccess: (state, { payload }) => {
      state.loadingSuccess = payload.data;
    },
    setErrorConsole: (state, { payload }) => {
      state.errorConsole = payload.data;
    },
    setErrorMessage: (state, { payload }) => {
      state.errorMessage = payload.data;
    },
  },
});

export const {
  setUser,
  setUpdateUser,
  removeUser,
  setTitle,
  setLoadingCron,
  setErrorConsole,
  setErrorMessage,
  setLoadingSuccess,
} = counterSlice.actions;

export default counterSlice.reducer;
