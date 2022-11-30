import { gql } from "@apollo/client";

export const GET_PROJECTS = gql`
  query projectConnection($limit: Int, $skip: Int, $or: [ProjectFilter]) {
    projectsConnection(
      limit: $limit
      skip: $skip
      where: { hypervisor: { vendor: "openstack" } }
      or: $or
      orderBy: updatedAt_DESC
    ) {
      total
      data {
        id
        name
        cpu
        memory
        projectId
        storage
        description
        assignUser {
          id
          firstName
          lastName
        }
        updatedBy {
          id
          firstName
          lastName
        }
        hypervisor {
          id
          name
          region {
            id
            name
          }
          zone {
            id
            name
            region {
              id
              name
            }
          }
        }
        region {
          id
          name
        }
        zone {
          id
          name
        }
        createdBy {
          id
          firstName
        }
      }
    }
  }
`;

export const GET_VMWARE_PROJECTS = gql`
  query projectConnection($limit: Int, $skip: Int, $or: [ProjectFilter]) {
    projectsConnection(
      limit: $limit
      skip: $skip
      or: $or
      where: { hypervisor: { vendor: "vmware" } }
      orderBy: updatedAt_DESC
    ) {
      total
      data {
        id
        name
        cpu
        memory
        projectId
        storage
        description
        updatedBy {
          id
          firstName
          lastName
        }
        assignUser {
          id
          firstName
          lastName
        }
        hypervisor {
          id
          name
          region {
            id
            name
          }
          zone {
            id
            name
            region {
              id
              name
            }
          }
        }
        region {
          id
          name
        }
        zone {
          id
          name
        }
        createdBy {
          id
          firstName
        }
      }
    }
  }
`;
