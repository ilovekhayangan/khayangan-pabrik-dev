import { gql } from "@apollo/client";

export const UPDATE_BILLING_SETTING = gql`
  mutation ($id: String!, $input: UpdateBillingSettingInput!) {
    updateBillingSetting(id: $id, input: $input) {
      id
      isActive
    }
  }
`;

export const GET_BILL_SET = gql`
  query {
    billingSettings {
      id
      isActive
    }
  }
`;
