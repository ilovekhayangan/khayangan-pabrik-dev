import { gql } from "@apollo/client";

export const GET_CLIENT = gql`
  query ($limit: Int, $skip: Int, $or: [UserFilter]) {
    usersConnection(
      limit: $limit
      skip: $skip
      or: $or
      orderBy: createdAt_DESC
    ) {
      total
      data {
        firstName
        lastName
        email
        phoneNumber
        role
      }
    }
  }
`;
