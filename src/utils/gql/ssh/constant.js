import { gql } from "@apollo/client";

export const GET_SSH = gql`
  query ($skip: Int, $limit: Int, $or: [SshForwardingFilter]) {
    sshForwardingsConnection(skip: $skip, limit: $limit, or: $or) {
      total
      data {
        id
        ipAddress
        username
        password
      }
    }
  }
`;

export const CREATE_SSH = gql`
  mutation ($input: CreateSshForwardingInput!) {
    createSshForwarding(input: $input) {
      id
      ipAddress
      username
      password
    }
  }
`;

export const UPDATE_SSH = gql`
  mutation ($id: String!, $input: UpdateSshForwardingInput!) {
    updateSshForwarding(id: $id, input: $input) {
      id
      ipAddress
      username
      password
    }
  }
`;

export const DEL_SSH = gql`
  mutation ($id: String!) {
    deleteSshForwarding(id: $id) {
      id
    }
  }
`;
