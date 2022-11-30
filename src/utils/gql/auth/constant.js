import { gql } from "@apollo/client";

export const POST_LOGIN = gql`
  mutation execLogin($input: LoginInput) {
    login(input: $input) {
      token
      user {
        id
        firstName
        lastName
        email
        avatar
        role
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: String!, $input: UpdateUserInput) {
    updateUser(id: $id, input: $input) {
      id
      firstName
      lastName
      email
      avatar
      role
    }
  }
`;
