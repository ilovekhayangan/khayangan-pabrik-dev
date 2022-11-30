import { gql } from "@apollo/client";

export const GET_ELAS = gql`
  query ($skip: Int, $limit: Int, $or: [ElasticFilter]) {
    elasticsConnection(skip: $skip, limit: $limit, or: $or) {
      total
      data {
        id
        ipAddress
        port
        username
        password
      }
    }
  }
`;

export const CREATE_ELAS = gql`
  mutation ($input: CreateElasticInput!) {
    createElastic(input: $input) {
      id
      ipAddress
      port
      username
      password
    }
  }
`;

export const UPDATE_ELAS = gql`
  mutation ($id: String!, $input: UpdateElasticInput!) {
    updateElastic(id: $id, input: $input) {
      id
      ipAddress
      port
      username
      password
    }
  }
`;

export const DEL_ELAS = gql`
  mutation ($id: String!) {
    deleteElastic(id: $id) {
      id
    }
  }
`;
