import { gql } from "@apollo/client";

export const GET_ZONE = gql`
  query {
    regions {
      id
      name
      zones {
        id
        name
        location
        description
      }
    }
  }
`;

export const GETZONES = gql`
  query {
    zones {
      id
      name
      hypervisors {
        id
      }
    }
  }
`;

export const GET_ALL_ZONES = gql`
  query {
    zones {
      id
      name
    }
  }
`;

export const SPECIFIC_ZONE = gql`
  query getZone($where: ZoneFilter) {
    zones(where: $where) {
      id
      name
    }
  }
`;

export const CREATE_ZONE = gql`
  mutation createZoneInput($input: CreateZoneInput!) {
    createZone(input: $input) {
      id
      name
      location
      description
    }
  }
`;

export const UPDATE_ZONE = gql`
  mutation updateZoneInput($id: String!, $input: UpdateZoneInput!) {
    updateZone(id: $id, input: $input) {
      id
      name
      location
      description
    }
  }
`;

export const OPVM = gql`
  query ($or: [OpenStackInstanceFilter]!) {
    openStackInstancesConnection(
      or: $or
      where: {
        hypervisor: { name_not_in: "" }
        project: { name_not_in: "" }
        deleted: false
      }
    ) {
      total
    }
  }
`;

export const VM_VM = gql`
  query ($or: [VMWareFilter]) {
    vMWaresConnection(
      or: $or
      where: { hypervisor: { name_not_in: "" }, project: { name_not_in: "" } }
    ) {
      total
    }
  }
`;

export const REQ = gql`
  query ($or: [RequestHypervisorFilter]!) {
    requestHypervisorsConnection(or: $or) {
      total
    }
  }
`;
