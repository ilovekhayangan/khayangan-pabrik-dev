import React, { useState, useEffect } from "react";
import { PageTitle } from "@components/atoms/pageTitle";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { Button } from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Pagination, Stack, Skeleton, Typography } from "@mui/material";
import CollapsibleTable from "./ExpandTable";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  width: "80%",
  boxShadow: "1.25rem",
  p: 4,
};

export default function TableModal({
  open,
  close,
  baremetals,
  clientName,
  loading,
  columns,
  expand,
  rowData,
  refresh,
  overview,
}) {
  const title = `List Baremetals from Zone ${rowData?.zone?.name} Hypervisor ${rowData?.name}`;

  const [page, setPage] = useState(0);
  const [pagination, setPagination] = useState({
    total: baremetals.length,
    current: 0,
    pageSize: 10,
  });

  const handleChangePagination = (pageNumber) => {
    setPage(pageNumber - 1);
  };

  const vcpu = {
    labels: ["Used", "Available"],
    datasets: [
      {
        label: `VCPU total ${overview?.vcpus?.total}`,
        data: [overview?.vcpus?.used, overview?.vcpus?.free],
        backgroundColor: ["#EAB737", "#000000"],
        borderColor: ["#EAB737", "#000000"],
      },
    ],
  };

  const cpuVmware = {
    labels: ["Used", "Available"],
    datasets: [
      {
        label: `VCPU total ${overview?.cpuTotal}`,
        data: [overview?.cpuUsed, overview?.cpuTotal - overview?.cpuUsed],
        backgroundColor: ["#EAB737", "#000000"],
        borderColor: ["#EAB737", "#000000"],
      },
    ],
  };

  const memory = {
    labels: ["Used", "Available"],
    datasets: [
      {
        label: `Memory total ${overview?.memory?.total}`,
        data: [
          (overview?.memory?.used / 1024).toFixed(0),
          (overview?.memory?.free / 1024).toFixed(0),
        ],
        backgroundColor: ["#EAB737", "#000000"],
        borderColor: ["#EAB737", "#000000"],
      },
    ],
  };

  const memoryVmware = {
    labels: ["Used", "Available"],
    datasets: [
      {
        label: `Memory total ${overview?.ramTotal}`,
        data: [overview?.ramUsed, overview?.ramTotal - overview?.ramUsed],
        backgroundColor: ["#EAB737", "#000000"],
        borderColor: ["#EAB737", "#000000"],
      },
    ],
  };

  const disk = {
    labels: ["Used", "Available"],
    datasets: [
      {
        label: `Storage total ${overview?.disk?.total}`,
        data: [overview?.disk?.used, overview?.disk?.available],
        backgroundColor: ["#EAB737", "#000000"],
        borderColor: ["#EAB737", "#000000"],
      },
    ],
  };

  const diskVmware = {
    labels: ["Used", "Available"],
    datasets: [
      {
        label: `Storage total ${overview?.storageTotal}`,
        data: [
          overview?.storageUsed,
          overview?.storageTotal - overview?.storageUsed,
        ],
        backgroundColor: ["#EAB737", "#000000"],
        borderColor: ["#EAB737", "#000000"],
      },
    ],
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={close}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                sx={{
                  ":hover": {
                    bgcolor: "white",
                  },
                }}
                onClick={close}
              >
                <AiOutlineClose style={{ fontSize: "1.5rem" }} color="black" />
              </Button>
            </div>
            <PageTitle
              title={title}
              marginTop="1rem"
              marginBottom="1rem"
              fontWeight={600}
            />

            {/* pie chart container */}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: "15rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Pie
                  data={rowData?.vendor === "openstack" ? vcpu : cpuVmware}
                  style={{ maxWidth: "15rem", maxHeight: "15rem" }}
                />
                <p style={{ textAlign: "center" }}>
                  VCPU total{" "}
                  {rowData?.vendor === "openstack"
                    ? `${overview?.vcpus?.total} Core`
                    : `${overview?.cpuTotal} GHz`}
                </p>
              </div>

              <div
                style={{
                  width: "15rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Pie
                  data={rowData?.vendor === "openstack" ? memory : memoryVmware}
                  style={{ maxWidth: "15rem", maxHeight: "15rem" }}
                />
                {rowData?.vendor === "openstack" ? (
                  <p style={{ textAlign: "center" }}>
                    Memory total{" "}
                    {overview?.memory?.total > 1000000
                      ? (overview?.memory?.total / 1000000).toFixed(1) + " TB"
                      : overview?.memory?.total > 1000
                      ? (overview?.memory?.total / 1000).toFixed(1) + " GB"
                      : (overview?.memory?.total).toFixed(1) + " MB"}
                  </p>
                ) : (
                  <p style={{ textAlign: "center" }}>
                    Memory total{" "}
                    {overview?.ramTotal >= 1024
                      ? (overview?.ramTotal / 1024).toFixed(0) + " TB"
                      : overview?.ramTotal + " GB"}
                  </p>
                )}
              </div>

              <div
                style={{
                  width: "15rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Pie
                  data={rowData?.vendor === "openstack" ? disk : diskVmware}
                  style={{ maxWidth: "15rem", maxHeight: "15rem" }}
                />
                {rowData?.vendor === "openstack" ? (
                  <p style={{ textAlign: "center" }}>
                    Disk total{" "}
                    {overview?.disk?.total >= 1000
                      ? (overview?.disk?.total / 1000).toFixed(1) + " TB"
                      : overview?.disk?.total + " GB"}
                  </p>
                ) : (
                  <p style={{ textAlign: "center" }}>
                    Disk total{" "}
                    {overview?.storageTotal >= 1024
                      ? (overview?.storageTotal / 1024).toFixed(0) + " TB"
                      : overview?.storageTotal + " GB"}
                  </p>
                )}
              </div>
            </div>
            {/* end of pie chart container */}

            <div style={{ maxHeight: "37.5vh", overflowY: "auto" }}>
              <CollapsibleTable
                baremetals={baremetals}
                rowData={rowData}
                refresh={refresh}
                close={close}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "1.25rem",
                paddingBottom: "1.25rem",
              }}
            >
              <div>
                <Typography sx={{ color: "black" }}>{`${
                  page * pagination.pageSize + 1
                }-${page * pagination.pageSize + baremetals.length} of ${
                  baremetals.length
                }`}</Typography>
              </div>
              <div>
                <Stack spacing={2}>
                  <Pagination
                    count={Math.ceil(baremetals.length / pagination.pageSize)}
                    shape="rounded"
                    onChange={(event, pageNumber) =>
                      handleChangePagination(pageNumber)
                    }
                    page={page + 1}
                  />
                </Stack>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

const TableLoading = ({ columns, dataSource }) => (
  <TableBody>
    {[...new Array(dataSource.length)].map((row, index) => {
      return (
        <StyledTableRow key={index}>
          {[...new Array(columns?.length ?? 5)].map((item, i) => (
            <StyledTableCell
              key={i}
              align="center"
              style={{
                fontWeight: "bold",
                px: "1rem",
                py: "1rem",
              }}
            >
              <Skeleton width="100%" />
            </StyledTableCell>
          ))}
        </StyledTableRow>
      );
    })}
  </TableBody>
);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
