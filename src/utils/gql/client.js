import {
  ApolloClient,
  InMemoryCache,
  split,
  NetworkStatus,
  ApolloLink,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";

import { getAuthToken } from "@utils/auth";

const GRAPHQL_URL = process.env.REACT_APP_GRAPHQL_URL;
const WS_URL = process.env.REACT_APP_WS_URL;

const httpLink = createUploadLink({
  uri: `${GRAPHQL_URL}`,
});

const wsLink = new WebSocketLink({
  uri: `${WS_URL}`,
  options: {
    reconnect: true,
    connectionParams: async () => {
      const token = getAuthToken();

      return {
        Authorization: token ? `Bearer ${token}` : null,
      };
    },
  },
});

const loggerLink = new ApolloLink((operation, forward) => {
  operation.setContext({ start: new Date() });
  return forward(operation).map((response) => {
    const responseTime = new Date() - operation.getContext().start;

    console.log(
      `GraphQL Response [${operation.operationName}] took: ${responseTime} ms`
    );
    return response;
  });
});

const authLink = setContext(async (_, { headers }) => {
  const token = getAuthToken();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message }) => {
      console.log(message);
      if (
        message.includes("jwt malformed") ||
        message.includes("UnAuthorized")
      ) {
        // window.localStorage.removeItem("factory-token");
        // window.localStorage.removeItem("factory-user");

        return;
      }
      console.log(`GraphQL Error: ${message}`);
    });
  }
  if (networkError) {
    console.log(
      `Network Error${
        networkError.statusCode ? ` [${networkError.statusCode}]` : ""
      }: ${networkError.message}`
    );
  }
});

const links = ApolloLink.from([loggerLink, authLink, errorLink, httpLink]);

const splitLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);

    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  links
);

const defaultOptions = {
  watchQuery: {
    fetchPolicy: "cache-and-network",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "network-only",
    errorPolicy: "all",
  },
  mutate: {
    errorPolicy: "all",
  },
};

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions,
});

export { NetworkStatus };
