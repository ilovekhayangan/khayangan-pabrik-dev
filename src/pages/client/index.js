import React, { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import {
  GET_FILTERED_USER,
  GET_HYPERVISOR,
  GET_SEARCH,
} from "@utils/gql/instance/constant";
import { useLazyQuery } from "@apollo/client";

import HypervisorBreadcrumbs from "@components/atoms/here";
import { PageTitle } from "@components/atoms/pageTitle";
import { Rack } from "@components/atoms/rack";
import { Search } from "@components/atoms/search";
import Datatables from "@components/molecules/tableClient";
import TableModal from "@components/molecules/TableModal";
import { ButtonList } from "@components/atoms/ButtonList";
import { useDebounce } from "use-debounce";
import { ButtonExpand } from "@components/atoms/ButtonExpand";
import { GET_CLIENT } from "@utils/gql/client/constant";
import SingleBreadcrumbs from "@components/atoms/SingleBreadrumb";

const ListClient = () => {
  const title = "List Client";
  const filterHypervisor = "Hypervisor";
  const filterZone = "Zone Location";
  const filterClient = "Select Client";

  const [page, setPage] = useState(0);
  const [openList, setOpenList] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    current: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [
    getData,
    { loading: dataLoading, error: dataError, refetch: dataRefetch },
  ] = useLazyQuery(GET_CLIENT, {
    onCompleted: ({ usersConnection }) => {
      if (usersConnection.data.length > 0) {
        setDataSource(
          usersConnection?.data.map((users) => ({
            ...users,
            key: users.id,
          }))
        );

        setPagination((prev) => ({
          ...prev,
          total: usersConnection.total,
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

  const handleSearch = (e, skip) => {
    getData({
      variables: {
        or: [
          {
            firstName_contains: e,
            role: "ADMINMSP",
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
            firstName_contains: searchTerm,
            role: "ADMINMSP",
          },
        ],
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
          or: [
            {
              firstName_contains: searchTerm,
              role: "ADMINMSP",
            },
          ],
          skip: 0,
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
      key: "client",
      title: "Client Name",
      columnsRender: (row) => {
        return row.lastName !== null
          ? `${row.firstName} ${row.lastName}`
          : `${row.firstName}`;
      },
    },
    {
      key: "email",
      title: "Email",
      columnsRender: (row) => {
        return row.email;
      },
    },
    {
      key: "phoneNumber",
      title: "Phone Number",
      columnsRender: (row) => {
        return row.phoneNumber;
      },
    },
  ];

  return (
    <div>
      <Box sx={{ px: "1.5rem", boxSizing: "border-box" }}>
        <div style={{ paddingTop: "0.25rem" }}>
          <SingleBreadcrumbs title="Client" route="/client" />
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
            <></>
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
      </Box>
    </div>
  );
};

export default ListClient;
