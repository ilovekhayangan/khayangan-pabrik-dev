import { gql } from "@apollo/client";

export const GET_REGIONS = gql`
  query {
    regions {
      id
      name
      location
      description
      zones {
        id
        name
        location
      }
    }
  }
`;

export const CREATE_REGION = gql`
  mutation createRegionInput($input: CreateRegionInput!) {
    createRegion(input: $input) {
      id
      name
      location
      description
    }
  }
`;

export const UPDATE_REGION = gql`
  mutation updateRegionData($id: String!, $input: UpdateRegionInput!) {
    updateRegion(id: $id, input: $input) {
      id
      name
      description
    }
  }
`;

export const DELETE_REGION = gql`
  mutation deleteRegion($id: String!) {
    deleteRegion(id: $id) {
      id
      name
    }
  }
`;
