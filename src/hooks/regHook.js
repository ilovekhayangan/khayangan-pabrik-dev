import { useEffect, useState } from "react";
import { gql, useMutation, useLazyQuery } from "@apollo/react-hooks";

const GET_REGIONS = gql`
  query {
    regions {
      id
      name
      description
    }
  }
`;

const POST_REGION = gql`
  mutation createRegion($input: CreateRegionInput!) {
    createRegion(input: $input) {
      id
      name
      description
    }
  }
`;

const UPDATE_REGION = gql`
  mutation updateRegion($id: String!, $input: UpdateProjectInput!) {
    updateRegion(id: $id, input: $input) {
      id
      name
    }
  }
`;

const DELETE_REGION = gql`
  mutation deleteRegion($id: String!) {
    deleteRegion(id: $id) {
      id
    }
  }
`;

const CustomHook = () => {
  const [name, setName] = useState(null);
  const [currentEditedRegion, setCurrentEditedRegion] = useState(null);

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
    useMutation(POST_REGION);

  const [updateRegion, { loading: updateRegionLoading }] =
    useMutation(UPDATE_REGION);

  const [deleteRegion, { loading: deleteRegionLoading }] =
    useMutation(DELETE_REGION);

  useEffect(() => {
    getRegions();
  }, []);

  //handle Error
  useEffect(() => {
    if (!getRegionsError) return;

    //code untuk menampilkan error, tampilkan pake toast
  }, [getRegionsError]);

  const handleAddRegion = async () => {
    try {
      await createRegion({
        variables: {
          input: {
            name: name.name,
            description: name.description,
          },
        },
      });

      getRegionsRefetch();

      setName("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetEditedRegion = (region) => {
    setCurrentEditedRegion(region);

    setName({ name: region.name, description: region.description });
  };

  const handleUpdateRegion = async () => {
    try {
      await updateRegion({
        variables: {
          id: currentEditedRegion.id,
          input: {
            name,
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

  const handleDeleteRegion = async (projectId) => {
    try {
      await deleteRegion({
        variables: {
          id: projectId,
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
    formLoading,
    currentEditedRegion,
    setName,
    handleAddRegion,
    handleGetEditedRegion,
    handleUpdateRegion,
    handleDeleteRegion,
  };
};

export default CustomHook;
