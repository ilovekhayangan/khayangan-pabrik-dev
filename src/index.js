import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import { Provider } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material";
import "leaflet/dist/leaflet.css";

import App from "./App";

import { client } from "@utils/gql/client";
import { store } from "@redux/store";

const theme = createTheme({
  typography: {
    fontFamily: ["Montserrat", "sans-serif"].join(","),
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
