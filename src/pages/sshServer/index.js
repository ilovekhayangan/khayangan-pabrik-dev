import React, { useState, useEffect } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useLazyQuery } from "@apollo/client";
import notfound from "@assets/404.svg";

import { IoMdAddCircleOutline } from "react-icons/io";
import { PageTitle } from "@components/atoms/pageTitle";
import Datatables from "@components/molecules/TableReverseProxy";
import SingleBreadcrumbs from "@components/atoms/SingleBreadrumb";
import SshCard from "@components/molecules/SshCard";
import LoadingBar from "@components/atoms/LoadingBar";
import { GET_SSH } from "@utils/gql/ssh/constant";
import ActionButton from "@components/atoms/ActionSsh";

const ServerSSH = () => {
  const title = "SSH Server Menu";

  const [page, setPage] = useState(0);
  const [addIpPublic, setAddIpPublic] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    current: 0,
    pageSize: 10,
  });

  const [
    getData,
    { loading: dataLoading, error: dataError, refetch: dataRefetch },
  ] = useLazyQuery(GET_SSH, {
    onCompleted: ({ sshForwardingsConnection }) => {
      if (sshForwardingsConnection?.data.length > 0) {
        setDataSource(
          sshForwardingsConnection?.data.map((ssh) => ({
            ...ssh,
            key: ssh.id,
          }))
        );

        setPagination((prev) => ({
          ...prev,
          total: sshForwardingsConnection?.total,
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

  useEffect(() => {
    getData({
      variables: {
        or: [],
        skip: pagination.pageSize * page,
        limit: pagination.pageSize,
      },
    });
  }, [page]);

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
      key: "sshIP",
      title: "SSH Server IP",
      columnsRender: (row) => {
        return row?.ipAddress;
      },
    },
    {
      key: "username",
      title: "Username",
      columnsRender: (row) => {
        return row?.username;
      },
    },
    {
      key: "password",
      title: "Password",
      columnsRender: (row) => {
        return row?.password;
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
          <SshCard
            close={() => {
              setAddIpPublic(false);
              dataRefetch();
            }}
          />
        ) : (
          <></>
        )}

        <div style={{ paddingTop: "0.25rem" }} id="top">
          <SingleBreadcrumbs title="SSH Server" route="setting/sshServer" />
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
              <Typography>Add SSH Server</Typography>
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

export default ServerSSH;
