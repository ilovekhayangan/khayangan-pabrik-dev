import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import {
  REQ_OPENS_PROJECT,
  UPDATE_STATUS,
} from "@utils/gql/reqOpensProject/constant";
import {
  USER_FILTER,
  REGION_FILTER,
  ZONE_FILTER,
  HYPERVISOR_FILTER,
  PROJECT_FILTER,
} from "@utils/gql/filter/constant";
import { useLazyQuery, useMutation } from "@apollo/client";

import SingleBreadcrumb from "@components/atoms/SingleBreadrumb";
import { PageTitle } from "@components/atoms/pageTitle";
import { Rack, RackClient } from "@components/atoms/rack";
import { ChangeStatus } from "@components/atoms/changeStatus";
import { Search } from "@components/atoms/search";
import RequestFinishForm from "@components/molecules/RequestFinishForm";
import Datatables from "@components/molecules/table";
import { useDebounce } from "use-debounce";

export default function OpenstackInstance() {
  const title = "List Instance";

  const [page, setPage] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    current: 0,
    pageSize: 8,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isFinish, setIsFinish] = useState(false);
  const [hypervisorData, setHypervisorData] = useState([]);

  // state for filter
  const [userFilter, setUserFilter] = useState([]);
  const [regionFilter, setRegionFilter] = useState([]);
  const [zoneFilter, setZoneFilter] = useState([]);
  const [hypervisorFilter, setHypervisorFilter] = useState([]);
  const [projectFilter, setProjectFilter] = useState([]);

  const [filterParam, setFilterParam] = useState({
    client: "",
    region: "",
    zone: "",
    hypervisor: "",
    project: "",
  });

  // querying data
  const [
    getUser,
    { loading: userLoading, error: userError, refetch: userRefetch },
  ] = useLazyQuery(USER_FILTER, {
    onCompleted: ({ usersConnection }) => setUserFilter(usersConnection.data),
  });
  const [
    getRegion,
    { loading: regionLoading, error: regionError, refetch: regionRefetch },
  ] = useLazyQuery(REGION_FILTER, {
    onCompleted: ({ regionsConnection }) =>
      setRegionFilter(regionsConnection.data),
  });
  const [
    getZone,
    { loading: zoneLoading, error: zoneError, refetch: zoneRefetch },
  ] = useLazyQuery(ZONE_FILTER, {
    onCompleted: ({ zonesConnection }) => setZoneFilter(zonesConnection.data),
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
      setHypervisorFilter(hypervisorsConnection.data),
  });
  const [
    getProject,
    { loading: projectLoading, error: projectError, refetch: projectRefetch },
  ] = useLazyQuery(PROJECT_FILTER, {
    onCompleted: ({ projectsConnection }) =>
      setProjectFilter(projectsConnection.data),
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

  const [
    getData,
    { loading: dataLoading, error: dataError, refetch: dataRefetch },
  ] = useLazyQuery(REQ_OPENS_PROJECT, {
    onCompleted: ({ reqProjectsConnection }) => {
      if (reqProjectsConnection.data.length > 0) {
        setDataSource(
          reqProjectsConnection?.data.map((tables) => ({
            ...tables,
            key: tables.id,
          }))
        );

        setPagination((prev) => ({
          ...prev,
          total: reqProjectsConnection.total,
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

  const handleFilter = () => {
    if (
      filterParam.region === "" ||
      filterParam.region === "All Data" ||
      filterParam.zone === "" ||
      filterParam.zone === "All Data" ||
      filterParam.client === "" ||
      filterParam.client === "All Data" ||
      filterParam.hypervisor === "" ||
      filterParam.hypervisor === "All Data" ||
      filterParam.project === "" ||
      filterParam.project === "All Data"
    ) {
      getData({
        variables: {
          skip: pagination.pageSize * page,
          limit: pagination.pageSize,
        },
      });
    } else {
      getData({
        variables: {
          where: {
            region: {
              name_contains: filterParam.region,
            },
            zone: {
              name_contains: filterParam.zone,
            },
            createdBy: {
              firtsName_contains: filterParam.client,
            },
            hypervisor: {
              name_contains: filterParam.hypervisor,
            },
            project: {
              name_contains: filterParam.project,
            },
          },
          skip: pagination.pageSize * page,
          limit: pagination.pageSize,
        },
      });
    }
  };

  const handleSearch = (e, skip) => {
    getData({
      variables: {
        where: { name_contains: e },
        skip: skip,
        limit: pagination.pageSize,
      },
    });
  };

  useEffect(() => {
    getData({
      variables: {
        where: { name_contains: searchTerm },
        skip: pagination.pageSize * page,
        limit: pagination.pageSize,
      },
    });
  }, [page]);

  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setPage(0);
      handleSearch(searchTerm, 0);
    } else {
      setPage(0);
      setPagination((prev) => ({
        ...prev,
        total: 0,
        current: 0,
      }));
      getData({
        variables: {
          where: { name_contains: searchTerm },
          skip: 0,
          limit: pagination.pageSize,
        },
      });
    }
  }, [debouncedSearchTerm]);

  const handleChangeStatus = (value, rowData) => {
    if (value === "COMPLETE") {
      setIsFinish(true);
    } else if (value === "CANCEL") {
      updateStatus({
        variables: {
          id: rowData.id,
          input: {
            reqProjectStatus: "CANCEL",
          },
        },
        refetchQueries: [{ query: REQ_OPENS_PROJECT }],
      });
    } else if (value === "ONPROGRESS") {
      updateStatus({
        variables: {
          id: rowData.id,
          input: {
            reqProjectStatus: "ONPROGRESS",
          },
        },
        refetchQueries: [{ query: REQ_OPENS_PROJECT }],
      });
    }

    setHypervisorData(rowData);
  };

  const [updateStatus, { loading: updateProjectLoading }] = useMutation(
    UPDATE_STATUS,
    {
      refetchQueries: [{ query: REQ_OPENS_PROJECT }],
    }
  );

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
      key: "name",
      title: "Name",
      columnsRender: (row) => {
        return row.name;
      },
    },
    {
      key: "cpu",
      title: "CPU",
      columnsRender: (row) => {
        return row.cpu;
      },
    },
    {
      key: "memory",
      title: "Memory",
      columnsRender: (row) => {
        return row.memory;
      },
    },
    {
      key: "storage",
      title: "Storage",
      columnsRender: (row) => {
        return row.storage;
      },
    },
    {
      key: "reqHypervisor",
      title: "Hypervisor",
      columnsRender: (row) => {
        return row.reqHypervisor?.name;
      },
    },
    {
      key: "description",
      title: "Description",
      columnsRender: (row) => {
        return row.description;
      },
    },
    {
      key: "services",
      title: "Service",
      columnsRender: (row) => {
        return row.services;
      },
    },
    {
      key: "projectId",
      title: "Project",
      columnsRender: (row) => {
        return row.projectId;
      },
    },
    {
      key: "reqProjectStatus",
      title: "Status",
      columnsRender: (row) => {
        return (
          <div>
            <ChangeStatus
              handleChange={(value) => handleChangeStatus(value, row)}
              statusReqHypervisor={row.reqProjectStatus}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {isFinish ? (
        <RequestFinishForm
          hypervisorData={hypervisorData}
          close={() => setIsFinish(false)}
        />
      ) : (
        <></>
      )}
      <Box sx={{ px: "1.5rem", boxSizing: "border-box" }}>
        <div style={{ paddingTop: "0.25rem" }}>
          <SingleBreadcrumb title="Instance" route="openstack/instance" />
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

              gap: "1.5rem",
            }}
          >
            <Rack
              name="Region"
              handleChange={handleFilter}
              selectData={regionFilter}
            />
            <Rack
              name="Zone"
              handleChange={handleFilter}
              selectData={zoneFilter}
            />
            <RackClient
              name="Client"
              handleChange={(value) => handleFilter(value)}
              selectData={userFilter}
            />
          </div>
          <Search onChange={(e) => setSearchTerm(e)} />
        </Box>

        <Box
          sx={{
            display: "flex",
            width: "100%",
            marginTop: "1rem",
            marginBottom: 3,
            gap: "1.5rem",
          }}
        >
          <Rack
            name="Hypervisor"
            handleChange={(value) => handleFilter(value)}
            selectData={hypervisorFilter}
          />
          <Rack
            name="Project"
            handleChange={handleFilter}
            selectData={projectFilter}
            style={{ float: "left" }}
          />
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
