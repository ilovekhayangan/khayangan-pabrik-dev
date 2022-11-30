import { gql } from "@apollo/client";

export const GET_REQ_OPENSTACK = gql`
  query ($limit: Int, $skip: Int) {
    reqHypervisorsConnection(
      limit: $limit
      skip: $skip
      orderBy: createdAt_DESC
    ) {
      total
      data {
        id
        name
        zone {
          name
        }
        createdBy {
          firstName
          lastName
        }
        reqHypervisorStatus
        reqBaremetals {
          name
          cpu
          memory
          storage
        }
      }
    }
  }
`;

export const UPDATE_STATUS_HYPERVISOR_FROM_REQ_OPENSTACK = gql`
  mutation ($input: UpdateReqHypervisorInput!, $id: String!) {
    updateReqHypervisor(input: $input, id: $id) {
      name
      reqHypervisorStatus
    }
  }
`;

export const CREATE_HYPERVISOR_FROM_REQ_OPENSTACK = gql`
  mutation ($input: CreateHypervisorInput!) {
    createHypervisor(input: $input) {
      id
      name
      description
    }
  }
`;

export const CREATE_NEW_BAREMETAL = gql`
  mutation ($inputs: [CreateBaremetalInput]!) {
    createBaremetals(inputs: $inputs) {
      results {
        id
        name
        hostname
        vendor
      }
    }
  }
`;

export const CREATE_NEW_IMAGE = gql`
  mutation CreateImages($inputs: [CreateImageInput]!) {
    createImages(inputs: $inputs) {
      results {
        id
      }
    }
  }
`;

export const UPDATE_REQUEST_HYPERVISOR = gql`
  mutation UpdateRequestHypervisor(
    $input: UpdateRequestHypervisorInput!
    $id: String!
  ) {
    updateRequestHypervisor(input: $input, id: $id) {
      status
    }
  }
`;

export const GET_REQUEST_HYPERVISOR = gql`
  query RequestHypervisor(
    $where: RequestHypervisorFilter
    $or: [RequestHypervisorFilter]
    $skip: Int
    $limit: Int
  ) {
    requestHypervisorsConnection(
      where: $where
      or: $or
      orderBy: createdAt_DESC
      skip: $skip
      limit: $limit
    ) {
      total
      data {
        id
        name
        zone {
          id
          name
        }
        region {
          id
          name
        }
        status
        operatingSystems {
          name
          version
          id
        }
        setBaremetals {
          id
          name
          hostname
        }
        vendor
        totalCluster
        customMemory
        customStorageSize
        customStorageType
        customCpuCore
        customCpuType
        selectPackages {
          name
          storage
          memory
          storageType
          core
        }
        createdBy {
          id
          firstName
          lastName
        }
        createdAt
      }
    }
  }
`;

export const GETNEWREQ = gql`
  query {
    requestHypervisors(where: { status: WAITING }) {
      id
    }
  }
`;

export const DELETE_REQUEST_HYPERVISOR = gql`
  mutation DeleteRequestHypervisor($id: String!) {
    deleteRequestHypervisor(id: $id) {
      id
    }
  }
`;
