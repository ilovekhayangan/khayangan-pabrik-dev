import { gql } from "@apollo/client";

export const GET_VOLUMES = gql`
  query ($limit: Int, $skip: Int, $or: [VolumeFilter]) {
    volumesConnection(
      limit: $limit
      skip: $skip
      where: { vendor_not: "vmware" }
      or: $or
      orderBy: updatedAt_DESC
    ) {
      total
      data {
        id
        region {
          id
          name
        }
        zone {
          id
          name
        }
        hypervisor {
          id
          name
        }
        size
        status
        type
        attachTo
        createdBy {
          id
          firstName
          lastName
        }
        project {
          id
          name
        }
      }
    }
  }
`;

export const OPENSTACK_VOLUME = gql`
  query OpenstackVolume($limit: Int, $skip: Int, $or: [OpenStackVolumeFilter]) {
    openStackVolumesConnection(
      limit: $limit
      skip: $skip
      or: $or
      where: { openStackInstance: { name_contains: "" } }
      orderBy: updatedAt_DESC
    ) {
      total
      data {
        id
        name
        openStackInstance {
          name
          id
          name
          project {
            id
            name
            createdBy {
              id
              firstName
              lastName
            }
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
              name
              region {
                id
                name
              }
              zone {
                id
                name
              }
            }
          }
        }
        size
        status
      }
    }
  }
`;

export const OPENSTACK_VOLUME_2 = gql`
  query OpenstackVolumes(
    $limit: Int
    $skip: Int
    $or: [OpenStackVolumeFilter]
  ) {
    openStackVolumesConnection(
      limit: $limit
      skip: $skip
      or: $or
      orderBy: createdAt_DESC
    ) {
      total
      data {
        id
        volumeId
        status
        type
        size
        availabilityZone
        hypervisor {
          id
          name
          region {
            name
          }
          zone {
            name
          }
        }
        project {
          id
          name
          updatedBy {
            firstName
            lastName
          }
        }
        openStackInstance {
          id
          name
        }
      }
    }
  }
`;

export const VMWARE_VOLUME = gql`
  query VMWareVolume($limit: Int, $skip: Int, $or: [VmwareVolumeFilter]) {
    vmwareVolumesConnection(
      limit: $limit
      skip: $skip
      or: $or
      orderBy: updatedAt_DESC
    ) {
      total
      data {
        id
        name
        size
        status
        vmwares {
          id
          name
          vmId
          memory
          cpu
          storage
          ipAddress
          project {
            name
            hypervisor {
              name
              zone {
                name
                region {
                  name
                }
              }
            }
            updatedBy {
              id
              firstName
              lastName
            }
          }
          operatingSystem {
            id
            operatingSystem {
              name
            }
            version
            imageId
          }
          state
          createdBy {
            firstName
            lastName
          }
          createdAt
        }
      }
    }
  }
`;

export const VM_VOLUME = gql`
  query ($skip: Int, $limit: Int, $or: [VolumeFilter]) {
    volumesConnection(
      or: $or
      where: { vendor: "vmware" }
      skip: $skip
      limit: $limit
    ) {
      total
      data {
        id
        name
        vendor
        region {
          name
        }
        zone {
          name
        }
        hypervisor {
          name
        }
        project {
          name
        }
        size
        status
        instance
        updatedBy {
          firstName
        }
        type
      }
    }
  }
`;
