import { gql } from "@apollo/client";

export const GET_WEBSSH = gql`
  query WebSSH($skip: Int, $limit: Int, $or: [WsshFilter]) {
    wsshesConnection(skip: $skip, limit: $limit, or: $or) {
      total
      data {
        id
        endpoint
      }
    }
  }
`;

export const CREATE_WEBSSH = gql`
  mutation ($input: CreateWsshInput!) {
    createWssh(input: $input) {
      id
      endpoint
    }
  }
`;

export const UPDATE_WEBSSH = gql`
  mutation ($id: String!, $input: UpdateWsshInput!) {
    updateWssh(id: $id, input: $input) {
      id
      endpoint
    }
  }
`;

export const DEL_WEBSSH = gql`
  mutation ($id: String!) {
    deleteWssh(id: $id) {
      id
    }
  }
`;
