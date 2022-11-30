import { gql } from "@apollo/client";

export const REQ_OPENS_PROJECT = gql`
  query ($limit: Int, $skip: Int) {
    reqProjectsConnection(limit: $limit, skip: $skip) {
      total
      data {
        id
        name
        cpu
        memory
        storage
        reqHypervisor {
          id
          name
        }
        description
        services {
          id
          name
        }
        projectId
        reqProjectStatus
        createdBy {
          id
          firstName
        }
      }
    }
  }
`;

export const UPDATE_STATUS = gql`
  mutation ($input: UpdateReqProjectInput!, $id: String!) {
    updateReqProject(input: $input, id: $id) {
      name
      reqProjectStatus
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation createProjectInput($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
      description
    }
  }
`;
