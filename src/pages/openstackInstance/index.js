import { useState, useEffect } from "react";
import { Alert, Box, Grow, Button } from "@mui/material";
import { OP_INSTANCE, OP_INSTANCE_2 } from "@utils/gql/instance/constant";
import {
  REGION_FILTER,
  ZONE_FILTER,
  ZONE_BEFORE_FILTER,
  HYPERVISOR_FILTER,
  HYPER_BEFORE,
  PROJECT_FILTER,
  PROJECT_AFTER,
} from "@utils/gql/filter/constant";
import { useLazyQuery } from "@apollo/client";

import SingleBreadcrumb from "@components/atoms/SingleBreadrumb";
import { PageTitle } from "@components/atoms/pageTitle";
import { Search } from "@components/atoms/search";
import Datatables from "@components/molecules/table";
import { useDebounce } from "use-debounce";
import Filter from "@components/atoms/Filter";
import ActionButton from "@components/atoms/ActionButton";
import LoadingBar from "@components/atoms/LoadingBar";

export default function OpenstackInstance() {
  const title = "List Instance (Openstack)";

  const [page, setPage] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    current: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [hypervisorFilter, setHypervisorFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [regionFilterData, setRegionFilterData] = useState([]);
  const [zoneFilterData, setZoneFilterData] = useState([]);
  const [zoneData, setZoneData] = useState([]);
  const [hyperFilterData, setHyperFilterData] = useState([]);
  const [hyperData, setHyperData] = useState([]);
  const [projectFilterData, setProjectFilterData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [alert, setAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [
    getData,
    { loading: dataLoading, error: dataError, refetch: dataRefetch },
  ] = useLazyQuery(OP_INSTANCE, {
    onCompleted: ({ openStackInstancesConnection }) => {
      setDataSource(
        openStackInstancesConnection?.data.map((instance) => ({
          ...instance,
          key: instance.id,
        }))
      );

      setPagination((prev) => ({
        ...prev,
        total: openStackInstancesConnection?.total,
        current: page,
      }));
    },
  });

  const [
    getRegionFilter,
    { loading: regionLoading, error: regionError, refetch: regionRefetch },
  ] = useLazyQuery(REGION_FILTER, {
    onCompleted: ({ regionsConnection }) => {
      if (regionsConnection.data.length > 0) {
        setRegionFilterData(
          regionsConnection?.data.map((regions) => ({
            ...regions,
            key: regions.id,
          }))
        );
      } else {
        setRegionFilterData([]);
      }
    },
  });

  const [zoneBefore, { loading, error, refetch }] = useLazyQuery(
    ZONE_BEFORE_FILTER,
    {
      onCompleted: ({ zonesConnection }) => {
        if (zonesConnection.data.length > 0) {
          setZoneData(
            zonesConnection?.data.map((zones) => ({
              ...zones,
              key: zones.id,
            }))
          );
        } else {
          setZoneData([]);
        }
      },
    }
  );

  const [
    getZoneFilter,
    { loading: zoneLoading, error: zoneError, refetch: zoneRefetch },
  ] = useLazyQuery(ZONE_FILTER, {
    variables: {
      input: regionFilter,
    },
    onCompleted: ({ zonesConnection }) => {
      if (zonesConnection.data.length > 0) {
        setZoneFilterData(
          zonesConnection?.data.map((zones) => ({
            ...zones,
            key: zones.id,
          }))
        );
      } else {
        setZoneFilterData([]);
      }
    },
  });

  const [
    getHypervisorFilter,
    { loading: hypeLoading, error: hypeError, refetch: hypeRefetch },
  ] = useLazyQuery(HYPERVISOR_FILTER, {
    variables: {
      region: regionFilter,
      zone: zoneFilter,
    },
    onCompleted: ({ hypervisorsConnection }) => {
      if (hypervisorsConnection.data.length > 0) {
        setHyperFilterData(
          hypervisorsConnection?.data.map((hyper) => ({
            ...hyper,
            key: hyper.id,
          }))
        );
      } else {
        setHyperFilterData([]);
      }
    },
  });

  const [
    hyperBefore,
    {
      loading: hypeBeforeLoading,
      error: hypeBeforeError,
      refetch: hypeBeforeRefetch,
    },
  ] = useLazyQuery(HYPER_BEFORE, {
    onCompleted: ({ hypervisorsConnection }) => {
      if (hypervisorsConnection.data.length > 0) {
        setHyperData(
          hypervisorsConnection?.data.map((hyper) => ({
            ...hyper,
            key: hyper.id,
          }))
        );
      } else {
        setHyperData([]);
      }
    },
  });

  const [
    projData,
    { loading: projLoading, error: projError, refetch: projRefetch },
  ] = useLazyQuery(PROJECT_FILTER, {
    onCompleted: ({ projectsConnection }) => {
      if (projectsConnection.data.length > 0) {
        setProjectFilterData(
          projectsConnection?.data.map((hyper) => ({
            ...hyper,
            key: hyper.id,
          }))
        );
      } else {
        setProjectFilterData([]);
      }
    },
  });

  const [
    projAfter,
    {
      loading: projAfterLoading,
      error: projAfterError,
      refetch: projAfterRefetch,
    },
  ] = useLazyQuery(PROJECT_AFTER, {
    variables: {
      region: regionFilter,
      zone: zoneFilter,
      hypervisor: hypervisorFilter,
    },
    onCompleted: ({ projectsConnection }) => {
      if (projectsConnection.data.length > 0) {
        setProjectData(
          projectsConnection?.data.map((hyper) => ({
            ...hyper,
            key: hyper.id,
          }))
        );
      } else {
        setProjectData([]);
      }
    },
  });

  const stateData = [
    {
      name: "POWER_ON",
    },
    {
      name: "POWER_OFF",
    },
    {
      name: "ERROR",
    },
    {
      name: "DELETED",
    },
  ];

  const handleSearch = (e, skip) => {
    setPage(0);
    if (stateFilter === "DELETED") {
      getData({
        variables: {
          or: [
            {
              name_contains: searchTerm,
              hypervisor: {
                name_contains: hypervisorFilter,
                zone: { name_contains: zoneFilter },
                region: { name_contains: regionFilter },
              },
              project: { name_contains: projectFilter },
              deleted: true,
            },
          ],
          skip: skip,
          limit: pagination.pageSize,
        },
      });
    } else if (stateFilter !== "") {
      getData({
        variables: {
          or: [
            {
              name_contains: searchTerm,
              hypervisor: {
                name_contains: hypervisorFilter,
                zone: { name_contains: zoneFilter },
                region: { name_contains: regionFilter },
              },
              project: { name_contains: projectFilter },
              state: stateFilter,
              deleted: false,
            },
          ],
          skip: skip,
          limit: pagination.pageSize,
        },
      });
    } else {
      getData({
        variables: {
          or: [
            {
              name_contains: searchTerm,
              hypervisor: {
                name_contains: hypervisorFilter,
                zone: { name_contains: zoneFilter },
                region: { name_contains: regionFilter },
              },
              project: { name_contains: projectFilter },
              deleted: false,
            },
          ],
          skip: skip,
          limit: pagination.pageSize,
        },
      });
    }
  };

  useEffect(() => {
    if (stateFilter === "DELETED") {
      getData({
        variables: {
          or: [
            {
              name_contains: searchTerm,
              hypervisor: {
                name_contains: hypervisorFilter,
                zone: { name_contains: zoneFilter },
                region: { name_contains: regionFilter },
              },
              project: { name_contains: projectFilter },
              deleted: true,
            },
          ],
          skip: pagination.pageSize * page,
          limit: pagination.pageSize,
        },
      });
    } else if (stateFilter !== "") {
      getData({
        variables: {
          or: [
            {
              name_contains: searchTerm,
              hypervisor: {
                name_contains: hypervisorFilter,
                zone: { name_contains: zoneFilter },
                region: { name_contains: regionFilter },
              },
              project: { name_contains: projectFilter },
              state: stateFilter,
            },
          ],
          skip: pagination.pageSize * page,
          limit: pagination.pageSize,
        },
      });
    } else {
      getData({
        variables: {
          or: [
            {
              name_contains: searchTerm,
              hypervisor: {
                name_contains: hypervisorFilter,
                zone: { name_contains: zoneFilter },
                region: { name_contains: regionFilter },
              },
              project: { name_contains: projectFilter },
              deleted: false,
            },
          ],
          skip: pagination.pageSize * page,
          limit: pagination.pageSize,
        },
      });
    }

    getRegionFilter({
      variables: {
        limit: 100,
      },
    });

    getZoneFilter({
      variables: {
        limit: 100,
      },
    });
    zoneBefore({
      variables: {
        limit: 100,
      },
    });
    getHypervisorFilter({
      variables: {
        limit: 100,
      },
    });
    hyperBefore({
      variables: {
        limit: 100,
      },
    });
    projData({
      variables: {
        limit: 100,
      },
    });
    projAfter({
      variables: {
        limit: 100,
      },
    });
  }, [
    page,
    regionFilter,
    zoneFilter,
    hypervisorFilter,
    projectFilter,
    stateFilter,
  ]);

  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);

  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch(searchTerm, 0);
    } else {
      if (stateFilter === "DELETED") {
        getData({
          variables: {
            or: [
              {
                name_contains: searchTerm,
                hypervisor: {
                  name_contains: hypervisorFilter,
                  zone: { name_contains: zoneFilter },
                  region: { name_contains: regionFilter },
                },
                project: { name_contains: projectFilter },
                deleted: true,
              },
            ],
            skip: pagination.pageSize * page,
            limit: pagination.pageSize,
          },
        });
      } else if (stateFilter !== "") {
        getData({
          variables: {
            or: [
              {
                name_contains: searchTerm,
                hypervisor: {
                  name_contains: hypervisorFilter,
                  zone: { name_contains: zoneFilter },
                  region: { name_contains: regionFilter },
                },
                project: { name_contains: projectFilter },
                state: stateFilter,
              },
            ],
            skip: pagination.pageSize * page,
            limit: pagination.pageSize,
          },
        });
      } else {
        getData({
          variables: {
            or: [
              {
                name_contains: searchTerm,
                hypervisor: {
                  name_contains: hypervisorFilter,
                  zone: { name_contains: zoneFilter },
                  region: { name_contains: regionFilter },
                },
                project: { name_contains: projectFilter },
                deleted: false,
              },
            ],
            skip: pagination.pageSize * page,
            limit: pagination.pageSize,
          },
        });
      }
    }
  }, [debouncedSearchTerm]);

  const columns = [
    {
      key: "no",
      title: "No",
      headerAlign: "center",
      contentAlign: "center",
      columnsRender: (_, index) => {
        return page * pagination.pageSize + index + 1;
      },
    },
    {
      key: "region",
      title: "Region",
      columnsRender: (row) => {
        return row?.hypervisor?.region?.name;
      },
    },
    {
      key: "zone",
      title: "Zone",
      columnsRender: (row) => {
        return row?.hypervisor?.zone?.name;
      },
    },
    {
      key: "hypervisor",
      title: "Hypervisor",
      columnsRender: (row) => {
        return row?.hypervisor?.name;
      },
    },
    {
      key: "project",
      title: "Project",
      columnsRender: (row) => {
        let project = row?.project?.name;
        if (project.includes("↭")) {
          return project.split("↭")[1];
        } else {
          return project;
        }
      },
    },
    {
      key: "name",
      title: "Instance",
      columnsRender: (row) => {
        return row?.name;
      },
    },
    {
      key: "client",
      title: "Client",
      columnsRender: (row) => {
        let client = row.project?.updatedBy?.firstName;
        return client ? client : "Admin MSP";
      },
    },
    // {
    //   key: "imageName",
    //   title: "Image Name",
    //   columnsRender: (row) => {
    //     return `${row.image.operatingSystem.name} ${row.image.version}`;
    //   },
    // },
    {
      key: "disk",
      title: "Disk",
      columnsRender: (row) => {
        return `${row.flavor?.rootDisk} GB`;
      },
    },
    {
      key: "flavorId",
      title: "Flavor",
      columnsRender: (row) => {
        return row.flavor?.name;
      },
    },
    {
      key: "powerState",
      title: "State",
      columnsRender: (row) => {
        return row.deleted ? "DELETED" : row.state;
      },
    },
    {
      key: "age",
      title: "Age",
      columnsRender: (row) => {
        let date = new Date(row.created);
        let dateNow = new Date();
        let age = Math.ceil((dateNow - date) / (1000 * 60 * 60 * 24));
        return `${age} Day`;
      },
    },
    {
      key: "action",
      title: "Action Button",
      columnsRender: (row) => {
        return (
          <div>
            <ActionButton
              data={row}
              refetch={dataRefetch}
              setAlert={setAlert}
              setErrorMessage={setErrorMessage}
            />
          </div>
        );
      },
    },
  ];

  const resetFilter = () => {
    setSearchTerm("");
    setHypervisorFilter("");
    setZoneFilter("");
    setRegionFilter("");
    setProjectFilter("");
    document.getElementById("zero").value = "";
    setPage(0);
  };

  return (
    <div>
      {dataLoading ? <LoadingBar /> : null}
      <Box sx={{ px: "1.5rem", boxSizing: "border-box" }}>
        <div style={{ paddingTop: "0.25rem" }}>
          <SingleBreadcrumb
            title="List Instance (Openstack)"
            route="openstack/instance"
          />
        </div>

        <PageTitle
          title={title}
          marginBottom="2rem"
          marginTop="1.5rem"
          fontWeight={500}
        />
        <Box
          sx={{
            width: "100%",
            marginTop: "1rem",
            marginBottom: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
            }}
          >
            <Filter
              filterName="Select Region"
              setFilter={setRegionFilter}
              val={regionFilter}
              filterData={regionFilterData}
              setPage={setPage}
            />
            <Filter
              filterName="Select Zone"
              setFilter={setZoneFilter}
              val={zoneFilter}
              filterData={regionFilter === "" ? zoneData : zoneFilterData}
              setPage={setPage}
            />
            {/* <Filter
              filterName="Select State"
              setFilter={setStateFilter}
              val={stateFilter}
              filterData={stateData}
              setPage={setPage}
            /> */}
          </div>
          <Search onChange={(e) => setSearchTerm(e)} />
        </Box>

        <Box
          sx={{
            display: "flex",
            width: "100%",
            marginTop: "1rem",
            marginBottom: 3,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
            }}
          >
            <Filter
              filterName="Select Hypervisor"
              setFilter={setHypervisorFilter}
              val={hypervisorFilter}
              filterData={
                regionFilter === "" && zoneFilter === ""
                  ? hyperData
                  : hyperFilterData
              }
              setPage={setPage}
            />
            <Filter
              filterName="Select Project"
              setFilter={setProjectFilter}
              val={projectFilter}
              filterData={
                regionFilter === "" &&
                zoneFilter === "" &&
                hypervisorFilter === ""
                  ? projectFilterData
                  : projectData
              }
              setPage={setPage}
            />
          </div>
          <Button
            sx={{
              height: "2.5rem",
              width: "15rem",
              fontSize: "1rem",
              backgroundColor: "#EAB737",
              borderRadius: 1,
              border: "none",
              cursor: "pointer",
              color: "black",
              "&:hover": {
                backgroundColor: "yellow",
              },
            }}
            onClick={resetFilter}
          >
            Reset Filter
          </Button>
        </Box>

        <Datatables
          dataSource={dataSource}
          columns={columns}
          page={page}
          setPage={setPage}
          loading={dataLoading}
          pagination={pagination}
        />
      </Box>
    </div>
  );
}
