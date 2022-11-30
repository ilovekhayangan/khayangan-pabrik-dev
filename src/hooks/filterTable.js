import { useLazyQuery, useQuery } from "@apollo/client";
import {
  HYPERVISOR_FILTER,
  PROJECT_FILTER,
  REGION_FILTER,
  USER_FILTER,
  ZONE_FILTER,
} from "@utils/gql/filter/constant";
import React, { useEffect, useState } from "react";

const FilterTable = () => {
  // state for filter
  const [userData, setUserData] = useState([]);
  const [regionData, setGetRegionData] = useState([]);
  const [zoneData, setZoneData] = useState([]);
  const [hypervisorData, setHypervisorData] = useState([]);
  const [projectData, setProjectData] = useState([]);

  const [
    getUser,
    { loading: userLoading, error: userError, refetch: userRefetch },
  ] = useLazyQuery(USER_FILTER, {
    onCompleted: ({ usersConnection }) => setUserData(usersConnection.data),
  });
  const [
    getRegion,
    { loading: regionLoading, error: regionError, refetch: regionRefetch },
  ] = useLazyQuery(REGION_FILTER, {
    onCompleted: ({ regionsConnection }) =>
      setGetRegionData(regionsConnection.data),
  });
  const [
    getZone,
    { loading: zoneLoading, error: zoneError, refetch: zoneRefetch },
  ] = useLazyQuery(ZONE_FILTER, {
    onCompleted: ({ zonesConnection }) => setZoneData(zonesConnection.data),
  });
  const [
    getHypervisor,
    {
      loading: hypervisorLoading,
      error: hypervisorError,
      refetch: hypervisorRefetch,
    },
  ] = useLazyQuery(HYPERVISOR_FILTER, {
    onCompleted: ({ hypervisorsConnection }) =>
      setHypervisorData(hypervisorsConnection.data),
  });
  const [
    getProject,
    { loading: projectLoading, error: projectError, refetch: projectRefetch },
  ] = useLazyQuery(PROJECT_FILTER, {
    onCompleted: ({ projectsConnection }) =>
      setProjectData(projectsConnection.data),
  });

  // set state to hold the datas
  useEffect(() => {
    getUser({
      variables: {
        limit: 1000,
      },
    });
    getRegion({
      variables: {
        limit: 1000,
      },
    });
    getZone({
      variables: {
        limit: 1000,
      },
    });
    getHypervisor({
      variables: {
        limit: 1000,
      },
    });
    getProject({
      variables: {
        limit: 1000,
      },
    });
  }, []);

  return {
    userData,
    regionData,
    zoneData,
    hypervisorData,
    projectData,
  };
};

export default FilterTable;
