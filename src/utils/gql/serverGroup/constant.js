import { gql } from "@apollo/client";

export const GET_SERVER_GROUPS = gql`
  query getServerGroups {
    servergroups {
      id
      name
    }
  }
`;
