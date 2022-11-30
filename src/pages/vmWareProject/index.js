import { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { GET_VMWARE_PROJECTS } from "@utils/gql/project/constant";
import {
  REGION_FILTER,
  ZONE_FILTER,
  ZONE_BEFORE_FILTER,
  HYPERVISOR_FILTER,
  HYPER_BEFORE,
} from "@utils/gql/instance/constant";

import { useLazyQuery } from "@apollo/client";

import SingleBreadcrumb from "@components/atoms/SingleBreadrumb";
import { PageTitle } from "@components/atoms/pageTitle";
import { Rack, RackClient } from "@components/atoms/rack";
import { Search } from "@components/atoms/search";
import Datatables from "@components/molecules/table";
import { useDebounce } from "use-debounce";
import Filter from "@components/atoms/Filter";
import LoadingBar from "@components/atoms/LoadingBar";

export default function VmWareProject() {
  const title = "List Project (VMware)";

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
  const [regionFilterData, setRegionFilterData] = useState([]);
  const [zoneFilterData, setZoneFilterData] = useState([]);
  const [zoneData, setZoneData] = useState([]);
  const [hyperFilterData, setHyperFilterData] = useState([]);
  const [hyperData, setHyperData] = useState([]);

  const [
    getData,
    { loading: dataLoading, error: dataError, refetch: dataRefetch },
  ] = useLazyQuery(GET_VMWARE_PROJECTS, {
    onCompleted: ({ projectsConnection }) => {
      if (projectsConnection.data.length > 0) {
        setDataSource(
          projectsConnection?.data.map((tables) => ({
            ...tables,
            key: tables.id,
          }))
        );

        setPagination((prev) => ({
          ...prev,
          total: projectsConnection.total,
          current: page,
        }));
      } else {
        setDataSource([]);
        setPagination((prev) => ({
          ...prev,
          total: 0,
          current: 0,
        }));
      }
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

  const handleSearch = (e, skip) => {
    setPage(0);
    getData({
      variables: {
        or: [
          {
            hypervisor: {
              name_contains: hypervisorFilter,
              region: {
                name_contains: regionFilter,
              },
              zone: {
                name_contains: zoneFilter,
              },
            },
            name_contains: e,
          },
        ],
        skip: skip,
        limit: pagination.pageSize,
      },
    });
  };

  useEffect(() => {
    getData({
      variables: {
        or: [
          {
            hypervisor: {
              name_contains: hypervisorFilter,
              region: {
                name_contains: regionFilter,
              },
              zone: {
                name_contains: zoneFilter,
              },
            },
            name_contains: searchTerm,
          },
        ],
        skip: pagination.pageSize * page,
        limit: pagination.pageSize,
      },
    });

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
  }, [page, regionFilter, zoneFilter, hypervisorFilter]);

  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);

  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch(searchTerm, 0);
    } else {
      getData({
        variables: {
          or: [
            {
              hypervisor: {
                name_contains: hypervisorFilter,
                region: {
                  name_contains: regionFilter,
                },
                zone: {
                  name_contains: zoneFilter,
                },
              },
              name_contains: searchTerm,
            },
          ],
          skip: pagination.pageSize * page,
          limit: pagination.pageSize,
        },
      });
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
        return row.hypervisor.zone.region.name;
      },
    },
    {
      key: "zone",
      title: "Zone",
      columnsRender: (row) => {
        return row.hypervisor.zone.name;
      },
    },
    {
      key: "hypervisor",
      title: "Hypervisor",
      columnsRender: (row) => {
        return row.hypervisor?.name;
      },
    },
    {
      key: "name",
      title: "Project Name",
      columnsRender: (row) => {
        let project = row?.name;
        if (project.includes("↭")) {
          return project.split("↭")[1];
        } else {
          return project;
        }
      },
    },
    {
      key: "createdBy",
      title: "Client",
      columnsRender: (row) => {
        return row?.updatedBy != null ? row.updatedBy?.firstName : "Admin MSP";
      },
    },
    {
      key: "cpu",
      title: "CPU",
      columnsRender: (row) => {
        return `${row?.cpu} GHz`;
      },
    },
    {
      key: "memory",
      title: "Memory",
      columnsRender: (row) => {
        return row?.memory >= 1000
          ? `${(row?.memory / 1000).toFixed(1)} TB`
          : `${row?.memory} GB`;
      },
    },
    // {
    //   key: "storage",
    //   title: "Storage",
    //   columnsRender: (row) => {
    //     return `${row?.storage} GB`;
    //   },
    // },
    // {
    //   key: "description",
    //   title: "Description",
    //   columnsRender: (row) => {
    //     return row?.description;
    //   },
    // },
  ];

  const resetFilter = () => {
    setSearchTerm("");
    setHypervisorFilter("");
    setZoneFilter("");
    setRegionFilter("");
    document.getElementById("zero").value = "";
    setPage(0);
  };

  return (
    <div>
      {dataLoading ? <LoadingBar /> : null}
      <Box sx={{ px: "1.5rem", boxSizing: "border-box" }}>
        <div style={{ paddingTop: "0.25rem" }}>
          <SingleBreadcrumb
            title="List Project (VMWare)"
            route="openstack/project"
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
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div style={{ marginRight: 20 }}>
              <Filter
                filterName="Select Region"
                filterData={regionFilterData}
                val={regionFilter}
                setFilter={setRegionFilter}
                setPage={setPage}
              />
            </div>
            <div style={{ marginRight: 20 }}>
              <Filter
                filterName="Select Zone"
                filterData={regionFilter === "" ? zoneData : zoneFilterData}
                setFilter={setZoneFilter}
                val={zoneFilter}
                setPage={setPage}
              />
            </div>
            <div style={{ marginRight: 20 }}>
              <Filter
                filterName="Select Hypervisor"
                filterData={
                  regionFilter === "" && zoneFilter === ""
                    ? hyperData
                    : hyperFilterData
                }
                setFilter={setHypervisorFilter}
                val={hypervisorFilter}
                setPage={setPage}
              />
            </div>
          </div>
          <Search onChange={(e) => setSearchTerm(e)} />
        </Box>

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
            marginBottom: 2,
            float: "right",
            "&:hover": {
              backgroundColor: "yellow",
            },
          }}
          onClick={resetFilter}
        >
          Reset Filter
        </Button>

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
