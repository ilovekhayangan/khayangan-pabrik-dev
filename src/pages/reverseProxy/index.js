import React, { useState, useEffect } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useLazyQuery } from "@apollo/client";
import notfound from "@assets/404.svg";

import { IoMdAddCircleOutline } from "react-icons/io";
import HypervisorBreadcrumbs from "@components/atoms/here";
import { PageTitle } from "@components/atoms/pageTitle";
import { Rack } from "@components/atoms/rack";
import { Search } from "@components/atoms/search";
import Datatables from "@components/molecules/TableReverseProxy";
import TableModal from "@components/molecules/TableModal";
import { ButtonList } from "@components/atoms/ButtonList";
import { useDebounce } from "use-debounce";
import { ButtonExpand } from "@components/atoms/ButtonExpand";
import { GET_CLIENT } from "@utils/gql/client/constant";
import SingleBreadcrumbs from "@components/atoms/SingleBreadrumb";
import ProxyCard from "@components/molecules/ProxyCard";
import LoadingBar from "@components/atoms/LoadingBar";
import { GET_REVERSE_PROXY } from "@utils/gql/reverseProxy/constant";
import ActionButton from "@components/atoms/ActionReverseProxy";

const ReverseProxy = () => {
  const title = "Reverse Proxy Menu";
  const filterHypervisor = "Hypervisor";
  const filterZone = "Zone Location";
  const filterClient = "Select Client";

  const [page, setPage] = useState(0);
  const [addIpPublic, setAddIpPublic] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    current: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");

  //   const [
  //     getData,
  //     { loading: dataLoading, error: dataError, refetch: dataRefetch },
  //   ] = useLazyQuery(GET_CLIENT, {
  //     onCompleted: ({ usersConnection }) => {
  //       if (usersConnection.data.length > 0) {
  //         setDataSource(
  //           usersConnection?.data.map((users) => ({
  //             ...users,
  //             key: users.id,
  //           }))
  //         );

  //         setPagination((prev) => ({
  //           ...prev,
  //           total: usersConnection.total,
  //           current: page,
  //         }));
  //       } else {
  //         setDataSource([]);
  //         setPagination((prev) => ({
  //           ...prev,
  //           total: 0,
  //           current: 0,
  //         }));
  //       }
  //     },
  //   });

  const [
    getData,
    { loading: dataLoading, error: dataError, refetch: dataRefetch },
  ] = useLazyQuery(GET_REVERSE_PROXY, {
    onCompleted: ({ reverseProxiesConnection }) => {
      if (reverseProxiesConnection?.data.length > 0) {
        setDataSource(
          reverseProxiesConnection?.data.map((proxy) => ({
            ...proxy,
            key: proxy.id,
          }))
        );

        setPagination((prev) => ({
          ...prev,
          total: reverseProxiesConnection?.total,
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
        or: [],
        skip: skip,
        limit: pagination.pageSize,
      },
    });
  };

  useEffect(() => {
    getData({
      variables: {
        or: [],
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
          or: [],
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
      key: "ipPublic",
      title: "IP Public",
      columnsRender: (row) => {
        return row?.ipPublic;
      },
    },
    {
      key: "port",
      title: "Port",
      columnsRender: (row) => {
        return row?.port;
      },
    },
    {
      key: "ipAPI",
      title: "IP API",
      columnsRender: (row) => {
        return row?.ipAPI;
      },
    },
    {
      key: "action",
      title: "Action",
      columnsRender: (row) => {
        return (
          <div style={{ width: "5rem" }}>
            <ActionButton data={row} refetch={dataRefetch} />
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {dataLoading ? <LoadingBar /> : null}
      <Box sx={{ px: "1.5rem", boxSizing: "border-box" }}>
        {addIpPublic ? (
          <ProxyCard
            close={() => {
              setAddIpPublic(false);
              dataRefetch();
            }}
          />
        ) : (
          <></>
        )}

        <div style={{ paddingTop: "0.25rem" }} id="top">
          <SingleBreadcrumbs title="Reverse Proxy" route="openstack/instance" />
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
            <Button
              color="warning"
              sx={{
                bgcolor: "black",
                ":hover": {
                  bgcolor: "white",
                  color: "black",
                  border: "black",
                },
                color: "white",
                fontSize: "1rem",
                height: "2.5rem",
                display: "flex",
                alignItems: "center",
                borderRadius: 0,
                padding: "0 2rem",
                gap: 1,
                marginBottom: 1,
              }}
              onClick={() => setAddIpPublic(true)}
            >
              <IoMdAddCircleOutline style={{ fontSize: 25 }} />{" "}
              <Typography>Add IP Public</Typography>
            </Button>
          </div>
        </Box>
        {dataLoading ? (
          <></>
        ) : dataSource?.length !== 0 ? (
          <Datatables
            dataSource={dataSource}
            columns={columns}
            page={page}
            setPage={setPage}
            loading={dataLoading}
            pagination={pagination}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <img src={notfound} alt={notfound} style={{ width: "50%" }} />
            <Typography
              sx={{
                color: "#EEB628",
                marginTop: 1,
                fontSize: "3rem",
              }}
            >
              No Data Found
            </Typography>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default ReverseProxy;
