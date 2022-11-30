import { gql } from "@apollo/client";

export const CREATE_RESERVE_PROXY = gql`
  mutation CreateReserveProxy($input: CreateReverseProxyInput!) {
    createReverseProxy(input: $input) {
      ipPublic
      port
      ipAPI
    }
  }
`;

export const EDIT_RESERVE_PROXY = gql`
  mutation UpdateReserveProxy($input: UpdateReverseProxyInput!, $id: String!) {
    updateReverseProxy(input: $input, id: $id) {
      ipPublic
      port
      ipAPI
    }
  }
`;

export const DELETE_RESERVE_PROXY = gql`
  mutation DeleteReverseProxy($id: String!) {
    deleteReverseProxy(id: $id) {
      id
    }
  }
`;

export const GET_REVERSE_PROXY = gql`
  query ReverseProxy($skip: Int, $limit: Int, $or: [ReverseProxyFilter]) {
    reverseProxiesConnection(
      skip: $skip
      limit: $limit
      or: $or
      orderBy: createdAt_DESC
    ) {
      total
      data {
        id
        ipPublic
        port
        ipAPI
      }
    }
  }
`;
