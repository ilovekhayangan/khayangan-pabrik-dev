import { gql } from "@apollo/client";

export const CREATE_HYPERVISOR = gql`
  mutation CreateHypervisor($input: CreateHypervisorInput!) {
    createHypervisor(input: $input) {
      id
      name
      region {
        id
        name
      }
      zone {
        id
        name
      }
      cpu
      memory
      storage
      endpoint
      description
    }
  }
`;

export const UPDATE_HYPERVISOR = gql`
  mutation updateHypervisorData($id: String!, $input: UpdateHypervisorInput!) {
    updateHypervisor(id: $id, input: $input) {
      id
      name
      region {
        id
        name
      }
      zone {
        id
        name
      }
      cpu
      memory
      storage
      endpoint
      description
    }
  }
`;

export const DELETE_HYPERVISOR = gql`
  mutation DeleteHypervisor($id: String!) {
    deleteHypervisor(id: $id) {
      id
    }
  }
`;
