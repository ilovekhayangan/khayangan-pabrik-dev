import { gql } from "@apollo/client";

export const USER_FILTER = gql`
  query ($limit: Int) {
    usersConnection(limit: $limit) {
      data {
        id
        firstName
      }
    }
  }
`;

export const REGION_FILTER = gql`
  query ($limit: Int) {
    regionsConnection(limit: $limit) {
      data {
        id
        name
        zones {
          id
          name
        }
        location
        lat
        long
      }
    }
  }
`;

export const ZONE_LOCATION = gql`
  query ($limit: Int) {
    zonesConnection(limit: $limit) {
      data {
        id
        name
        region {
          id
          name
        }
        location
        lat
        long
      }
    }
  }
`;

export const ZONE_FILTER = gql`
  query ($limit: Int, $input: String) {
    zonesConnection(
      limit: $limit
      where: {
        hypervisors: { vendor_contains: "openstack" }
        region: { name: $input }
      }
    ) {
      data {
        id
        name
        region {
          id
          name
        }
        location
        lat
        long
      }
    }
  }
`;

export const ZONE_BEFORE_FILTER = gql`
  query ($limit: Int) {
    zonesConnection(
      limit: $limit
      where: { hypervisors: { vendor_contains: "openstack" } }
    ) {
      data {
        id
        name
        region {
          id
          name
        }
        location
        lat
        long
      }
    }
  }
`;

export const HYPERVISOR_FILTER = gql`
  query ($limit: Int, $region: String, $zone: String) {
    hypervisorsConnection(
      limit: $limit
      where: {
        region: { name_contains: $region }
        zone: { name_contains: $zone }
        vendor: "openstack"
      }
    ) {
      data {
        id
        name
      }
    }
  }
`;

export const HYPER_BEFORE = gql`
  query ($limit: Int) {
    hypervisorsConnection(limit: $limit, where: { vendor: "openstack" }) {
      data {
        id
        name
      }
    }
  }
`;

export const PROJECT_FILTER = gql`
  query ($limit: Int) {
    projectsConnection(
      limit: $limit
      where: { hypervisor: { vendor: "openstack" }, status: COMPLETE }
    ) {
      data {
        id
        name
      }
    }
  }
`;

export const PROJECT_AFTER = gql`
  query ($limit: Int, $region: String, $zone: String, $hypervisor: String) {
    projectsConnection(
      limit: $limit
      where: {
        hypervisor: {
          name_contains: $hypervisor
          vendor: "openstack"
          region: { name_contains: $region }
          zone: { name_contains: $zone }
        }
        status: COMPLETE
      }
    ) {
      data {
        id
        name
      }
    }
  }
`;

export const TEST_ZONE = gql`
  query ($limit: Int, $or: [ZoneFilter], $name: String) {
    zonesConnection(
      limit: $limit
      where: {
        hypervisors: { vendor_contains: "openstack" }
        name_contains: $name
      }
      or: $or
    ) {
      data {
        id
        name
        region {
          id
          name
        }
        location
        lat
        long
      }
    }
  }
`;

export const TEST_REGION = gql`
  query ($limit: Int, $name: String) {
    regionsConnection(
      limit: $limit
      where: {
        hypervisors: { vendor_contains: "openstack" }
        name_contains: $name
      }
    ) {
      data {
        id
        name
        zones {
          id
          name
        }
        location
        lat
        long
      }
    }
  }
`;

export const TEST_HYPERVISOR = gql`
  query ($limit: Int, $or: [HypervisorFilter], $name: String) {
    hypervisorsConnection(
      limit: $limit
      where: { vendor: "openstack", name_contains: $name }
      or: $or
    ) {
      data {
        id
        name
      }
    }
  }
`;

export const TEST_PROJECT = gql`
  query ($limit: Int, $or: [ProjectFilter], $name: String) {
    projectsConnection(
      limit: $limit
      where: { hypervisor: { vendor: "openstack", name_contains: $name } }
      or: $or
    ) {
      data {
        id
        name
      }
    }
  }
`;

export const TEST_ISTANCE = gql`
  query (
    $limit: Int
    $skip: Int
    $or: [OpenStackInstanceFilter]
    $name: String
  ) {
    openStackInstancesConnection(
      limit: $limit
      skip: $skip
      or: $or
      where: { project: { name_contains: $name } }
      orderBy: createdAt_DESC
    ) {
      total
      data {
        id
        name
        state
        instanceId
        createdBy {
          id
          firstName
          lastName
        }
        image {
          version
          imageId
          operatingSystem {
            name
          }
        }
        flavour {
          hypervisor {
            id
            name
            endpoint
          }
          idFlavor
          name
          rootDisk
        }
        createdAt
        project {
          name
          createdBy {
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
            name
            endpoint
            zone {
              name
              region {
                name
              }
            }
          }
        }
      }
    }
  }
`;

// export const TEST_PROJECT = gql`
//   query ($limit: Int, $or: [ProjectFilter], $name: String) {
//     projectsConnection(
//       limit: $limit
//       where: { openstackInstance : {}hypervisor: { vendor: "openstack", name_contains: $name } }
//       or: $or
//     ) {
//       data {
//         id
//         name
//       }
//     }
//   }
// `;
