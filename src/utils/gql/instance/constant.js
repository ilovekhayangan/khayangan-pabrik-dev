import { gql } from "@apollo/client";

export const GET_HYPERVISOR = gql`
  query ($limit: Int, $skip: Int, $or: [HypervisorFilter]) {
    hypervisorsConnection(
      limit: $limit
      skip: $skip
      or: $or
      where: { vendor: "openstack" }
      orderBy: createdAt_DESC
    ) {
      total
      data {
        id
        region {
          name
        }
        zone {
          name
        }
        name
        cpu
        memory
        storage
        endpoint
        auth
        description
        vendor
        users {
          id
          firstName
          lastName
        }
        baremetals {
          id
          hostname
          vcpusTotal
          ramTotal
          storageType
          localStorageTotal
          domain
          state
        }
      }
    }
  }
`;

export const GET_HYPERVISOR_VMWARE = gql`
  query ($limit: Int, $skip: Int, $or: [HypervisorFilter]) {
    hypervisorsConnection(
      limit: $limit
      skip: $skip
      or: $or
      where: { vendor: "vmware" }
      orderBy: createdAt_DESC
    ) {
      total
      data {
        id
        region {
          name
        }
        zone {
          name
        }
        vendor
        name
        cpu
        memory
        storage
        endpoint
        auth
        description
        users {
          id
          firstName
          lastName
        }
        baremetals {
          id
          hostname
          vcpusTotal
          ramTotal
          storageType
          localStorageTotal
          domain
        }
      }
    }
  }
`;

export const GET_FILTERED_USER = gql`
  query ($where: UserFilter, $limit: Int, $skip: Int) {
    usersConnection(where: $where, skip: $skip, limit: $limit) {
      total
      data {
        id
        firstName
        lastName
        email
        role
        phoneNumber
        verify
      }
    }
  }
`;

export const GET_SEARCH = gql`
  query (
    $firstName: UserFilter
    $lastName: UserFilter
    $limit: Int
    $skip: Int
  ) {
    usersConnection(or: [$firstName, $lastName], skip: $skip, limit: $limit) {
      total
      data {
        id
        firstName
        lastName
        email
        role
        phoneNumber
        verify
      }
    }
  }
`;

export const GET_INSTANCES = gql`
  query ($limit: Int, $skip: Int, $or: [InstanceFilter]) {
    instancesConnection(
      limit: $limit
      skip: $skip
      or: $or
      where: { vendor_not: "vmware" }
      orderBy: createdAt_DESC
    ) {
      total
      data {
        id
        name
        client {
          id
          name
        }
        flavorId
        networkId
        sourceName
        sourceUuid
        sourceType
        keypairName
        disk
        deleteOnTermination
        serverId
        servergroupIdOs
        vmId
        powerState
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
          endpoint
          auth
        }
        project {
          id
          name
        }
        status
        ipAddress
        powerState
        age
        client {
          name
        }
      }
    }
  }
`;

export const OP_INSTANCE = gql`
  query OpenstackInstance(
    $limit: Int
    $skip: Int
    $or: [OpenStackInstanceFilter]
  ) {
    openStackInstancesConnection(
      limit: $limit
      skip: $skip
      or: $or
      orderBy: created_DESC
      where: {
        hypervisor: { name_not_in: "" }
        project: { name_not_in: "" }
        flavor: { name_not_in: "" }
      }
    ) {
      total
      data {
        id
        name
        state
        instanceId
        flavor {
          id
          name
          rootDisk
        }
        created
        deleted
        project {
          name
          updatedBy {
            id
            firstName
            lastName
          }
        }
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
      }
    }
  }
`;

export const OP_INSTANCE_2 = gql`
  query oSInstancesConnection(
    $skip: Int
    $limit: Int
    $or: [OSInstanceFilter]
  ) {
    oSInstancesConnection(
      skip: $skip
      limit: $limit
      or: $or
      orderBy: created_DESC
      where: {
        hypervisor: { name_not_in: "" }
        project: { name_not_in: "" }
        flavor: { name_not_in: "" }
      }
    ) {
      total
      data {
        id
        name
        project {
          name
        }
        hypervisor {
          name
          zone {
            name
          }
          region {
            name
          }
        }
        flavor {
          name
          rootDisk
        }
        state
        created
      }
    }
  }
`;

export const VM_INSTANCE = gql`
  query VmwareInstance($limit: Int, $skip: Int, $or: [InstanceFilter]) {
    instancesConnection(
      or: $or
      limit: $limit
      skip: $skip
      where: { vendor: "vmware" }
      orderBy: createdAt_DESC
    ) {
      total
      data {
        id
        vendor
        vmId
        region {
          name
        }
        zone {
          name
        }
        project {
          name
        }
        name
        client {
          name
        }
        imageName
        disk
        flavorId
        keypairName
        status
        powerState
        age
      }
    }
  }
`;

export const VMWARE_INSTANCE_2 = gql`
  query vmwareInstance($limit: Int, $skip: Int, $or: [VmwareInstanceFilter]) {
    vmwareInstancesConnection(
      or: $or
      limit: $limit
      skip: $skip
      orderBy: createdAt_DESC
    ) {
      total
      data {
        id
        name
        memory
        storage
        cpu
        operatingSystem
        state
        createdAt
        project {
          name
          updatedBy {
            id
            firstName
            lastName
          }
        }
        hypervisor {
          id
          name
        }
        region {
          name
        }
        zone {
          name
        }
      }
    }
  }
`;

export const VMWARE_INSTANCE = gql`
  query VMwareInstance($limit: Int, $skip: Int, $or: [VMWareFilter]) {
    vMWaresConnection(
      or: $or
      limit: $limit
      skip: $skip
      orderBy: createdAt_DESC
    ) {
      total
      data {
        id
        name
        vmId
        memory
        cpu
        storage
        ipAddress
        operatingSystem
        state
        delete
        project {
          name
          updatedBy {
            id
            firstName
            lastName
          }
        }
        hypervisor {
          id
          name
        }
        region {
          name
        }
        zone {
          name
        }
      }
    }
  }
`;

export const UPDATE_VM_STATUS = gql`
  mutation ($input: UpdateInstanceInput!, $id: String!) {
    updateInstance(input: $input, id: $id) {
      id
      name
      vmId
    }
  }
`;

export const UPDATE_VMWARE_STATUS = gql`
  mutation ($input: UpdateVMWareInput!, $id: String!) {
    updateVMWare(input: $input, id: $id) {
      id
      name
      vmId
    }
  }
`;

export const UPDATE_VMWARE_STATUS_2 = gql`
  mutation ($input: UpdateVmwareInstanceInput!, $id: String!) {
    updateVmwareInstance(input: $input, id: $id) {
      id
      name
    }
  }
`;

export const DELETE_VM_INSTANCE = gql`
  mutation DeleteVMInstance($id: String!) {
    deleteInstance(id: $id) {
      name
    }
  }
`;

export const DELETE_VMWARE_INSTANCE = gql`
  mutation DeleteVMInstance($id: String!) {
    deleteVMWare(id: $id) {
      name
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

export const ZONE_FILTER = gql`
  query ($limit: Int, $input: String) {
    zonesConnection(
      limit: $limit
      where: {
        hypervisors: { vendor_contains: "vmware" }
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
      where: { hypervisors: { vendor_contains: "vmware" } }
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
    hypervisorsConnection(limit: $limit, where: { vendor: "vmware" }) {
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
      where: { hypervisor: { vendor: "vmware" }, status: COMPLETE }
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
          vendor: "vmware"
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

export const UPDATE_BAREMETAL = gql`
  mutation ($id: String!, $input: UpdateBaremetalInput!) {
    updateBaremetal(id: $id, input: $input) {
      id
      hostname
      domain
    }
  }
`;
