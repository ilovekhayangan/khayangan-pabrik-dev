import { gql } from "@apollo/client";

export const SUBCRIPTION_GET_REQUEST = gql`
  subscription {
    requestHypervisorsAdded(where: { status: WAITING }) {
      id
      name
      createdBy {
        firstName
        lastName
        email
      }
      updatedBy {
        firstName
        lastName
        email
      }
    }
  }
`;

export const POST_MESSAGE = gql`
  mutation ($inputs: [CreateMessageInput]!) {
    createMessages(inputs: $inputs) {
      results {
        name
      }
    }
  }
`;

export const GET_MESSAGES = gql`
  query ($or: [MessageFilter]) {
    messages(or: $or, orderBy: createdAt_DESC, limit: 1000) {
      id
      statusMessage
      name
      description
      createdAt
    }
  }
`;

export const GET_MESSAGE = gql`
  query ($or: [MessageFilter]) {
    messagesConnection(or: $or, orderBy: createdAt_DESC, limit: 1000) {
      total
    }
  }
`;

export const UPDATE_MESSAGE = gql`
  mutation ($inputs: [UpdateMessageInputs]!) {
    updateMessages(inputs: $inputs) {
      results {
        statusMessage
      }
    }
  }
`;

export const DELETE_MESSAGE = gql`
  mutation ($id: String!) {
    deleteMessage(id: $id) {
      name
      description
    }
  }
`;

export const DELETE_ALL_MESSAGE = gql`
  mutation ($ids: [ID]!) {
    deleteMessages(ids: $ids) {
      results {
        name
        description
        statusMessage
      }
      errors
    }
  }
`;
