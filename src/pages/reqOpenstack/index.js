import React, { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import {
  GET_REQ_OPENSTACK,
  UPDATE_STATUS_HYPERVISOR_FROM_REQ_OPENSTACK,
} from "@utils/gql/reqOpenstack/constant";
import { useLazyQuery, useMutation } from "@apollo/client";

import HypervisorBreadcrumbs from "@components/atoms/here";
import { PageTitle } from "@components/atoms/pageTitle";
import { Rack } from "@components/atoms/rack";
import { Search } from "@components/atoms/search";
import Datatables from "@components/molecules/table";
import TableModal from "@components/molecules/TableModal";
import { ButtonList } from "@components/atoms/ButtonList";
import { useDebounce } from "use-debounce";
import { ChangeStatus } from "@components/atoms/changeStatus";
import TableRequestModal from "@components/molecules/TableRequestModal";
import FinishForm from "@components/organism/FinishForm";
import CreateHypervisorCard from "@components/molecules/CreateHypervisorCard";

const ReqOpenStack = () => {
  const title = "List Request Openstack";
  const filterZone = "Zone Location";

  const [page, setPage] = useState(0);
  const [openList, setOpenList] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    current: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [hypervisorData, setHypervisorData] = useState([]);

  const handleOpen = () => setOpenList(true);
  const handleClose = () => {
    setOpenList(false);
  };

  const [
    getData,
    { loading: dataLoading, error: dataError, refetch: dataRefetch },
  ] = useLazyQuery(GET_REQ_OPENSTACK, {
    onCompleted: ({ reqHypervisorsConnection }) => {
      if (reqHypervisorsConnection.data.length > 0) {
        setDataSource(
          reqHypervisorsConnection?.data.map((users) => ({
            ...users,
            key: users.id,
          }))
        );

        setPagination((prev) => ({
          ...prev,
          total: reqHypervisorsConnection.total,
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

  const handleFilter = (value) => {
    if (value === "All Hypervisor") {
      getData({
        variables: {
          skip: pagination.pageSize * page,
          limit: pagination.pageSize,
        },
      });
    } else if (value === "Hypervisor 1") {
      getData({
        variables: {
          where: { name: "OS-Hypervisor01" },
          skip: pagination.pageSize * page,
          limit: pagination.pageSize,
        },
      });
    } else if (value === "Hypervisor 2") {
      getData({
        variables: {
          where: { name: "OS-Hypervisor02" },
          skip: pagination.pageSize * page,
          limit: pagination.pageSize,
        },
      });
    }
  };

  const [updateStatus, { loading: updateProjectLoading }] = useMutation(
    UPDATE_STATUS_HYPERVISOR_FROM_REQ_OPENSTACK,
    {
      refetchQueries: [{ query: GET_REQ_OPENSTACK }],
    }
  );

  const handleChangeStatus = (value, rowData) => {
    if (value === "COMPLETE") {
      setIsFinish(true);
    } else if (value === "CANCEL") {
      updateStatus({
        variables: {
          id: rowData.id,
          input: {
            reqHypervisorStatus: "CANCEL",
          },
        },
        refetchQueries: [{ query: GET_REQ_OPENSTACK }],
      });
    } else if (value === "ONPROGRESS") {
      updateStatus({
        variables: {
          id: rowData.id,
          input: {
            reqHypervisorStatus: "ONPROGRESS",
          },
        },
        refetchQueries: [{ query: GET_REQ_OPENSTACK }],
      });
    }

    setHypervisorData(rowData);
  };

  const handleSearch = (e, skip) => {
    getData({
      variables: {
        // firstName: { firstName_contains: e, hyo },
        // lastName: { lastName_contains: e },
        where: { name_contains: e },
        skip: skip,
        limit: pagination.pageSize,
      },
    });
  };

  useEffect(() => {
    getData({
      variables: {
        // firstName: { firstName_contains: e, hyo },
        // lastName: { lastName_contains: e },
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
          // firstName: { firstName_contains: e, hyo },
          // lastName: { lastName_contains: e },
          where: { name_contains: searchTerm },
          skip: 0,
          limit: pagination.pageSize,
        },
      });
    }
  }, [debouncedSearchTerm]);

  const selectHypervisor = [
    { key: "all", value: "All Hypervisor" },
    {
      key: "hypervisor1",
      value: "Hypervisor 1",
    },
    {
      key: "hypervisor2",
      value: "Hypervisor 2",
    },
  ];

  const [dataModal, setDataModal] = useState([]);

  const handleShow = (data) => {
    setDataModal(data);
    handleOpen();
  };

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
      title: "Client Name",
      columnsRender: (row) => {
        return row.createdBy?.lastName !== null
          ? `${row.createdBy?.firstName} ${row.createdBy?.lastName}`
          : `${row.createdBy?.firstName}`;
      },
    },
    {
      key: "status",
      title: "Status",
      columnsRender: (row) => {
        return (
          <div>
            <ChangeStatus
              handleChange={(value) => handleChangeStatus(value, row)}
              statusReqHypervisor={row.reqHypervisorStatus}
            />
          </div>
        );
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
      key: "cpu",
      title: "CPU",
      columnsRender: (row) => {
        return "";
      },
    },
    {
      key: "memory",
      title: "Memory",
      columnsRender: (row) => {
        return "";
      },
    },
    {
      key: "storage",
      title: "Storage",
      columnsRender: (row) => {
        return "";
      },
    },
    {
      key: "baremetals",
      title: "Baremetals",
      columnsRender: (row) => {
        return (
          <div onClick={() => handleShow(row.reqBaremetals)}>
            <ButtonList />
          </div>
        );
      },
    },
  ];

  const modalColumns = [
    {
      key: "no",
      title: "NO",
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
  ];

  return (
    <div>
      {isFinish ? (
        <CreateHypervisorCard
          close={() => {
            setIsFinish(false);
            dataRefetch();
          }}
          title="Register New Hypervisor"
          hypervisorData={hypervisorData}
        />
      ) : (
        <></>
      )}

      <Box sx={{ px: "1.5rem", boxSizing: "border-box" }}>
        <div style={{ paddingTop: "0.25rem" }}>
          <HypervisorBreadcrumbs />
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
              <Rack
                name={filterZone}
                handleChange={(value) => handleFilter(value)}
                selectData={selectHypervisor}
              />
            </div>
          </div>
          <div style={{ marginRight: 20 }}>
            <Search onChange={(e) => setSearchTerm(e)} />
          </div>
        </Box>
        <Datatables
          dataSource={dataSource}
          columns={columns}
          page={page}
          setPage={setPage}
          loading={dataLoading}
          pagination={pagination}
        />
        <TableRequestModal
          open={openList}
          close={handleClose}
          baremetals={dataModal}
          loading={dataLoading}
          columns={modalColumns}
        />
      </Box>
    </div>
  );
};

export default ReqOpenStack;
