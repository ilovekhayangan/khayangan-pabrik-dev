import { gql } from "@apollo/client";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";

const GET_REGIONS = gql`
  query {
    regions {
      id
      name
      location
      description
      zones {
        id
        name
        location
        description
      }
      hypervisors {
        id
        name
        zone {
          id
          name
          location
          description
        }
        region {
          id
          name
          location
          description
        }
        auth
        vendor
        cpu
        memory
        endpoint
        storage
        endpointMonitoring
        domainPrometheus
      }
    }
  }
`;

const CREATE_REGION = gql`
  mutation createRegionInput($input: CreateRegionInput!) {
    createRegion(input: $input) {
      id
      name
      location
      description
    }
  }
`;

const UPDATE_REGION = gql`
  mutation updateRegionData($id: String!, $input: UpdateRegionInput!) {
    updateRegion(id: $id, input: $input) {
      id
      name
      description
    }
  }
`;

const DELETE_REGION = gql`
  mutation deleteRegion($id: String!) {
    deleteRegion(id: $id) {
      id
      name
    }
  }
`;

const DELETE_ZONE = gql`
  mutation deleteZone($id: String!) {
    deleteZone(id: $id) {
      id
      name
    }
  }
`;

const RegionHook = () => {
  const [name, setName] = useState({
    name: "",
    location: "",
    description: "",
  });
  const [currentEditedRegion, setCurrentEditedRegion] = useState(null);
  const [loadingCron, setLoadingCron] = useState(false);

  const [
    getRegions,
    {
      data: getRegionsData,
      error: getRegionsError,
      loading: getRegionsLoading,
      refetch: getRegionsRefetch,
    },
  ] = useLazyQuery(GET_REGIONS);

  const [createRegion, { loading: createRegionLoading }] =
    useMutation(CREATE_REGION);

  const [updateRegion, { loading: updateRegionLoading }] =
    useMutation(UPDATE_REGION);

  const [deleteRegion, { loading: deleteRegionLoading }] =
    useMutation(DELETE_REGION);

  const [deleteZone, { loading: deleteZoneLoading }] = useMutation(DELETE_ZONE);

  useEffect(() => {
    getRegions();
  }, []);

  const handleUpdateCron = async () => {
    setLoadingCron(!loadingCron);
  };

  const handleAddRegion = async () => {
    try {
      await createRegion({
        variables: {
          input: {
            name: name.name,
            location: name.location,
            description: name.description,
          },
        },
      });

      getRegionsRefetch();

      setName({
        name: "",
        location: "",
        description: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetEditedRegion = (region) => {
    setCurrentEditedRegion(region);

    setName({
      name: region.name,
      location: region.location,
      description: region.description,
    });
  };

  const handleUpdateRegion = async () => {
    try {
      await updateRegion({
        variables: {
          id: currentEditedRegion.id,
          input: {
            name: name.name,
            location: name.location,
            description: name.description,
          },
        },
      });

      getRegionsRefetch();

      setName("");
      setCurrentEditedRegion(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteRegion = async (regionId) => {
    try {
      await deleteRegion({
        variables: {
          id: regionId,
        },
      });

      getRegionsRefetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteZone = async (zoneId) => {
    try {
      await deleteZone({
        variables: {
          id: zoneId,
        },
      });

      getRegionsRefetch();
    } catch (error) {
      console.log(error);
    }
  };

  const formLoading = createRegionLoading || updateRegionLoading;

  return {
    name,
    getRegionsData,
    getRegionsLoading,
    getRegionsRefetch,
    formLoading,
    currentEditedRegion,
    setName,
    handleAddRegion,
    handleGetEditedRegion,
    handleUpdateRegion,
    handleDeleteRegion,
    handleDeleteZone,
    handleUpdateCron,
    loadingCron,
  };
};

export default RegionHook;
