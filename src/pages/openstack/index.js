import React, { useState, useEffect } from "react";
import { Box, Container, Button } from "@mui/material";
import { GET_HYPERVISOR } from "@utils/gql/instance/constant";
import {
  REGION_FILTER,
  ZONE_FILTER,
  ZONE_BEFORE_FILTER,
} from "@utils/gql/filter/constant";
import { useLazyQuery } from "@apollo/client";

import HypervisorBreadcrumbs from "@components/atoms/here";
import { PageTitle } from "@components/atoms/pageTitle";
import { Rack } from "@components/atoms/rack";
import { Search } from "@components/atoms/search";
import Datatables from "@components/molecules/table";
import TableModal from "@components/molecules/TableModal";
import { ButtonList } from "@components/atoms/ButtonList";
import { useDebounce } from "use-debounce";
import { ButtonExpand } from "@components/atoms/ButtonExpand";
import MultiBreadcrumbs from "@components/atoms/MultiBreadcrumbs";
import Filter from "@components/atoms/Filter";
import LoadingBar from "@components/atoms/LoadingBar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoadingCron,
  setLoadingSuccess,
} from "@redux/features/auth/authSlice";

const OpenStack = () => {
  const title = "List Hypervisor (Openstack)";

  const token = window.localStorage.getItem("factory-token");
  const [page, setPage] = useState(0);
  const [openList, setOpenList] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    current: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [dataModal, setDataModal] = useState([]);
  const [rowModal, setRowModal] = useState();
  const [clientName, setClientName] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [regionFilterData, setRegionFilterData] = useState([]);
  const [zoneFilterData, setZoneFilterData] = useState([]);
  const [zoneData, setZoneData] = useState([]);
  const [overview, setOverview] = useState({});
  const [disableButton, setDisableButton] = useState(false);

  const dispatch = useDispatch();

  const handleOpen = () => setOpenList(true);
  const handleClose = () => {
    setOpenList(false);
  };

  const [
    getData,
    { loading: dataLoading, error: dataError, refetch: dataRefetch },
  ] = useLazyQuery(GET_HYPERVISOR, {
    onCompleted: ({ hypervisorsConnection }) => {
      if (hypervisorsConnection.data.length > 0) {
        setDataSource(
          hypervisorsConnection?.data.map((users) => ({
            ...users,
            key: users.id,
          }))
        );

        setPagination((prev) => ({
          ...prev,
          total: hypervisorsConnection.total,
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
    variables: {
      limit: 100,
    },
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

  const handleSearch = (e, skip) => {
    setPage(0);
    getData({
      variables: {
        or: [
          {
            region: {
              name_contains: regionFilter,
            },
            zone: {
              name_contains: zoneFilter,
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
            region: {
              name_contains: regionFilter,
            },
            zone: {
              name_contains: zoneFilter,
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
  }, [page, regionFilter, zoneFilter]);

  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);

  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch(searchTerm, 0);
    } else {
      getData({
        variables: {
          or: [
            {
              region: {
                name_contains: regionFilter,
              },
              zone: {
                name_contains: zoneFilter,
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

  const handleShow = async (data, client, row) => {
    let result = data.reduce(function (r, a) {
      r[a.hostname.slice(0, 8)] = r[a.hostname.slice(0, 8)] || [];
      r[a.hostname.slice(0, 8)].push(a);
      return r;
    }, Object.create(null));

    let array = Object.keys(result).map(function (key) {
      return result[key];
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_OPENSTACK}/os-overview`,
        {
          mgHypervisorId: row.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOverview(response.data.overview);
    } catch (err) {
      console.log(err);
    }

    setDataModal(array);
    setClientName(client);
    setRowModal(row);
    handleOpen();
  };

  const breadcrumbsData = [
    {
      name: "Hypervisor",
      route: "",
    },
    {
      name: "Openstack",
      route: "",
    },
    {
      name: title,
      route: "/hypervisor/openstack/list",
    },
  ];

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
        return row.region?.name;
      },
    },
    {
      key: "zone",
      title: "Zone",
      columnsRender: (row) => {
        return row.zone?.name;
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
      key: "client",
      title: "Client",
      columnsRender: (row) => {
        let client = row.users.map((a, i) =>
          row.users.length === 1
            ? a.firstName
            : row.users.length - 1 !== i
            ? a.firstName + ", "
            : a.firstName
        );
        return client.length > 0 ? client : "Admin MSP";
      },
    },
    {
      key: "cpu",
      title: "CPU",
      columnsRender: (row) => {
        return `${row.cpu} Core`;
      },
    },
    {
      key: "totalmemory",
      title: "Total Memory",
      columnsRender: (row) => {
        return row?.memory >= 1000000
          ? `${(row?.memory / 1000000).toFixed(1)} PB`
          : row?.memory >= 1000
          ? `${(row?.memory / 1000).toFixed(1)} TB`
          : `${row?.memory} GB`;
      },
    },
    {
      key: "totalstorage",
      title: "Total Storage",
      columnsRender: (row) => {
        return row?.storage >= 1000000
          ? `${(row?.storage / 1000000).toFixed(1)} PB`
          : row?.storage >= 1000
          ? `${(row?.storage / 1000).toFixed(1)} TB`
          : `${row?.storage} GB`;
      },
    },
    // {
    //   key: "description",
    //   title: "Description",
    //   columnsRender: (row) => {
    //     return row.description;
    //   },
    // },
    {
      key: "baremetals",
      title: "Baremetals",
      columnsRender: (row) => {
        let client = row.users.map((a) => a.firstName);
        return (
          <div
            onClick={() => {
              handleShow(row.baremetals, client, row);
              setId(row.id);
            }}
          >
            <ButtonList id={row.id} />
          </div>
        );
      },
    },
  ];

  const [id, setId] = useState("");

  const modalColumns = [
    {
      key: "no",
      title: "NO",
      headerAlign: "center",
      contentAlign: "center",
      columnsRender: (_, index) => {
        return <ButtonExpand dataExpand={dataModal[index]} />;
      },
    },
    {
      key: "name",
      title: "Name",
      columnsRender: (row) => {
        // return row[0].hostname.slice(0, 8);
      },
    },
    {
      key: "memory",
      title: "Memory",
      columnsRender: (row) => {
        return row?.ramTotal;
      },
    },
    {
      key: "cpu",
      title: "CPU",
      columnsRender: (row) => {
        return row?.vcpusTotal;
      },
    },
    {
      key: "storagetype",
      title: "Storage Type",
      columnsRender: (row) => {
        return row?.storage;
      },
    },
  ];

  const resetFilter = () => {
    setSearchTerm("");
    setZoneFilter("");
    setRegionFilter("");
    document.getElementById("zero").value = "";
    setPage(0);
  };

  const refresh = async () => {
    let URL_MICROGEN = "https://dev-khayanganjxhpv.microgen.id";
    setDisableButton(true);
    dispatch(
      setLoadingCron({
        data: true,
      })
    );
    try {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_OPENSTACK}/os-cron`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        if (response.status === 200) {
          dispatch(
            setLoadingCron({
              data: false,
            })
          );
          dispatch(
            setLoadingSuccess({
              data: true,
            })
          );
          setTimeout(() => {
            dispatch(
              setLoadingSuccess({
                data: false,
              })
            );
            window.location.reload(true);
          }, 3000);

          setDisableButton(false);
        }
      } catch (err) {
        console.log("os-cron", err);
        dispatch(
          setLoadingCron({
            data: false,
          })
        );
        dispatch(
          setLoadingSuccess({
            data: true,
          })
        );
        setTimeout(() => {
          dispatch(
            setLoadingSuccess({
              data: false,
            })
          );
          window.location.reload(true);
        }, 3000);

        setDisableButton(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {dataLoading ? <LoadingBar /> : null}
      <Box sx={{ px: "1.5rem", boxSizing: "border-box" }}>
        <div style={{ paddingTop: "0.25rem" }}>
          <MultiBreadcrumbs title={title} breadcrumbs={breadcrumbsData} />
        </div>

        <PageTitle
          title={title}
          marginBottom="2rem"
          marginTop="1.5rem"
          fontWeight={500}
        />
        <Box
          sx={{
            display: "flex",
            width: "100%",
            marginTop: "1rem",
            marginBottom: 3,
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
                setFilter={setRegionFilter}
                val={regionFilter}
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
          }}
        >
          <div>
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
                "&:hover": {
                  backgroundColor: "yellow",
                },
              }}
              onClick={resetFilter}
            >
              Reset Filter
            </Button>
          </div>
          <Button
            disabled={disableButton}
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
              "&:hover": {
                backgroundColor: "yellow",
              },
            }}
            onClick={refresh}
          >
            Refresh
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

        <TableModal
          open={openList}
          close={handleClose}
          baremetals={dataModal}
          columns={modalColumns}
          clientName={clientName}
          rowData={rowModal}
          overview={overview}
          refresh={() => {
            dataRefetch();
            if (!dataLoading) {
              setTimeout(() => {
                document.getElementById(`btn-modal-${id}`).click();
              }, 500);
            }
          }}
        />
      </Box>
    </div>
  );
};

export default OpenStack;
