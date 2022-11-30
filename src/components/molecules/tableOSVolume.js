import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Pagination, Stack, Skeleton, Typography } from "@mui/material";
import { useEffect } from "react";

const Datatable = ({
  dataSource,
  setPage,
  columns,
  loading,
  pagination,
  page,
  region,
  zone,
  hypervisor,
  proj,
}) => {
  const handleChangePagination = (pageNumber) => {
    setPage(pageNumber - 1);
  };

  return (
    <div>
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          color: "transparent",
          boxShadow: "none",
          minHeight: "60vh",
        }}
      >
        <TableContainer sx={{ width: "100%", border: "none" }}>
          <Table stickyHeader aria-label="sticky table" sx={{ width: "100%" }}>
            <TableHead sx={{ width: "100%" }}>
              <TableRow sx={{ width: "100%" }}>
                {columns.map((item) => (
                  <StyledTableCell
                    align={item.headerAlign ?? "left"}
                    sx={{ fontWeight: "bold", px: "1rem", width: "5rem" }}
                    key={item.key}
                  >
                    {item.title}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            {loading ? (
              <TableLoading columns={columns} dataSource={dataSource} />
            ) : (
              <>
                {region !== "" &&
                zone === "" &&
                hypervisor === "" &&
                proj === "" ? (
                  <TableBody>
                    {dataSource.map((row, index) => {
                      return (
                        <>
                          {row?.openStackInstance?.project?.hypervisor?.region
                            ?.name === region ? (
                            <StyledTableRow key={index}>
                              {columns.map((item, i) => (
                                <StyledTableCell
                                  align={item.contentAlign ?? "left"}
                                  style={{
                                    fontWeight: "bold",
                                    px: "1rem",
                                  }}
                                  key={i}
                                >
                                  {item.columnsRender
                                    ? item.columnsRender(row, index)
                                    : row[item?.key]}
                                </StyledTableCell>
                              ))}
                            </StyledTableRow>
                          ) : null}
                        </>
                      );
                    })}
                  </TableBody>
                ) : region !== "" &&
                  zone !== "" &&
                  hypervisor === "" &&
                  proj === "" ? (
                  <TableBody>
                    {dataSource.map((row, index) => {
                      return (
                        <>
                          {row?.openStackInstance?.project?.hypervisor?.region
                            ?.name === region &&
                          row?.openStackInstance?.project?.hypervisor?.zone
                            ?.name === zone ? (
                            <StyledTableRow key={index}>
                              {columns.map((item, i) => (
                                <StyledTableCell
                                  align={item.contentAlign ?? "left"}
                                  style={{
                                    fontWeight: "bold",
                                    px: "1rem",
                                  }}
                                  key={i}
                                >
                                  {item.columnsRender
                                    ? item.columnsRender(row, index)
                                    : row[item?.key]}
                                </StyledTableCell>
                              ))}
                            </StyledTableRow>
                          ) : null}
                        </>
                      );
                    })}
                  </TableBody>
                ) : region !== "" &&
                  zone !== "" &&
                  hypervisor !== "" &&
                  proj === "" ? (
                  <TableBody>
                    {dataSource.map((row, index) => {
                      return (
                        <>
                          {row?.openStackInstance?.project?.hypervisor?.region
                            ?.name === region &&
                          row?.openStackInstance?.project?.hypervisor?.zone
                            ?.name === zone &&
                          row?.openStackInstance?.project?.hypervisor?.name ===
                            hypervisor ? (
                            <StyledTableRow key={index}>
                              {columns.map((item, i) => (
                                <StyledTableCell
                                  align={item.contentAlign ?? "left"}
                                  style={{
                                    fontWeight: "bold",
                                    px: "1rem",
                                  }}
                                  key={i}
                                >
                                  {item.columnsRender
                                    ? item.columnsRender(row, index)
                                    : row[item?.key]}
                                </StyledTableCell>
                              ))}
                            </StyledTableRow>
                          ) : null}
                        </>
                      );
                    })}
                  </TableBody>
                ) : region !== "" &&
                  zone !== "" &&
                  hypervisor !== "" &&
                  proj !== "" ? (
                  <TableBody>
                    {dataSource.map((row, index) => {
                      return (
                        <>
                          {row?.openStackInstance?.project?.hypervisor?.region
                            ?.name === region &&
                          row?.openStackInstance?.project?.hypervisor?.zone
                            ?.name === zone &&
                          row?.openStackInstance?.project?.hypervisor?.name ===
                            hypervisor &&
                          row?.openStackInstance?.project?.name === proj ? (
                            <StyledTableRow key={index}>
                              {columns.map((item, i) => (
                                <StyledTableCell
                                  align={item.contentAlign ?? "left"}
                                  style={{
                                    fontWeight: "bold",
                                    px: "1rem",
                                  }}
                                  key={i}
                                >
                                  {item.columnsRender
                                    ? item.columnsRender(row, index)
                                    : row[item?.key]}
                                </StyledTableCell>
                              ))}
                            </StyledTableRow>
                          ) : null}
                        </>
                      );
                    })}
                  </TableBody>
                ) : region === "" &&
                  zone !== "" &&
                  hypervisor === "" &&
                  proj === "" ? (
                  <TableBody>
                    {dataSource.map((row, index) => {
                      return (
                        <>
                          {row?.openStackInstance?.project?.hypervisor?.zone
                            ?.name === zone ? (
                            <StyledTableRow key={index}>
                              {columns.map((item, i) => (
                                <StyledTableCell
                                  align={item.contentAlign ?? "left"}
                                  style={{
                                    fontWeight: "bold",
                                    px: "1rem",
                                  }}
                                  key={i}
                                >
                                  {item.columnsRender
                                    ? item.columnsRender(row, index)
                                    : row[item?.key]}
                                </StyledTableCell>
                              ))}
                            </StyledTableRow>
                          ) : null}
                        </>
                      );
                    })}
                  </TableBody>
                ) : region === "" &&
                  zone === "" &&
                  hypervisor !== "" &&
                  proj === "" ? (
                  <TableBody>
                    {dataSource.map((row, index) => {
                      return (
                        <>
                          {row?.openStackInstance?.project?.hypervisor?.name ===
                          hypervisor ? (
                            <StyledTableRow key={index}>
                              {columns.map((item, i) => (
                                <StyledTableCell
                                  align={item.contentAlign ?? "left"}
                                  style={{
                                    fontWeight: "bold",
                                    px: "1rem",
                                  }}
                                  key={i}
                                >
                                  {item.columnsRender
                                    ? item.columnsRender(row, index)
                                    : row[item?.key]}
                                </StyledTableCell>
                              ))}
                            </StyledTableRow>
                          ) : null}
                        </>
                      );
                    })}
                  </TableBody>
                ) : region !== "" &&
                  zone === "" &&
                  hypervisor !== "" &&
                  proj === "" ? (
                  <TableBody>
                    {dataSource.map((row, index) => {
                      return (
                        <>
                          {row?.openStackInstance?.project?.hypervisor?.region
                            ?.name === region &&
                          row?.openStackInstance?.project?.hypervisor?.name ===
                            hypervisor ? (
                            <StyledTableRow key={index}>
                              {columns.map((item, i) => (
                                <StyledTableCell
                                  align={item.contentAlign ?? "left"}
                                  style={{
                                    fontWeight: "bold",
                                    px: "1rem",
                                  }}
                                  key={i}
                                >
                                  {item.columnsRender
                                    ? item.columnsRender(row, index)
                                    : row[item?.key]}
                                </StyledTableCell>
                              ))}
                            </StyledTableRow>
                          ) : null}
                        </>
                      );
                    })}
                  </TableBody>
                ) : region === "" &&
                  zone === "" &&
                  hypervisor === "" &&
                  proj !== "" ? (
                  <TableBody>
                    {dataSource.map((row, index) => {
                      return (
                        <>
                          {row?.openStackInstance?.project?.name === proj ? (
                            <StyledTableRow key={index}>
                              {columns.map((item, i) => (
                                <StyledTableCell
                                  align={item.contentAlign ?? "left"}
                                  style={{
                                    fontWeight: "bold",
                                    px: "1rem",
                                  }}
                                  key={i}
                                >
                                  {item.columnsRender
                                    ? item.columnsRender(row, index)
                                    : row[item?.key]}
                                </StyledTableCell>
                              ))}
                            </StyledTableRow>
                          ) : null}
                        </>
                      );
                    })}
                  </TableBody>
                ) : region !== "" &&
                  zone === "" &&
                  hypervisor === "" &&
                  proj !== "" ? (
                  <TableBody>
                    {dataSource.map((row, index) => {
                      return (
                        <>
                          {row?.openStackInstance?.project?.hypervisor?.region
                            ?.name === region &&
                          row?.openStackInstance?.project?.name === proj ? (
                            <StyledTableRow key={index}>
                              {columns.map((item, i) => (
                                <StyledTableCell
                                  align={item.contentAlign ?? "left"}
                                  style={{
                                    fontWeight: "bold",
                                    px: "1rem",
                                  }}
                                  key={i}
                                >
                                  {item.columnsRender
                                    ? item.columnsRender(row, index)
                                    : row[item?.key]}
                                </StyledTableCell>
                              ))}
                            </StyledTableRow>
                          ) : null}
                        </>
                      );
                    })}
                  </TableBody>
                ) : region !== "" &&
                  zone !== "" &&
                  hypervisor === "" &&
                  proj !== "" ? (
                  <TableBody>
                    {dataSource.map((row, index) => {
                      return (
                        <>
                          {row?.openStackInstance?.project?.hypervisor?.region
                            ?.name === region &&
                          row?.openStackInstance?.project?.hypervisor?.zone
                            ?.name === zone &&
                          row?.openStackInstance?.project?.name === proj ? (
                            <StyledTableRow key={index}>
                              {columns.map((item, i) => (
                                <StyledTableCell
                                  align={item.contentAlign ?? "left"}
                                  style={{
                                    fontWeight: "bold",
                                    px: "1rem",
                                  }}
                                  key={i}
                                >
                                  {item.columnsRender
                                    ? item.columnsRender(row, index)
                                    : row[item?.key]}
                                </StyledTableCell>
                              ))}
                            </StyledTableRow>
                          ) : null}
                        </>
                      );
                    })}
                  </TableBody>
                ) : (
                  <TableBody>
                    {dataSource.map((row, index) => {
                      return (
                        <StyledTableRow key={index}>
                          {row.openStackInstance !== null
                            ? columns.map((item, i) => (
                                <StyledTableCell
                                  align={item.contentAlign ?? "left"}
                                  style={{
                                    fontWeight: "bold",
                                    px: "1rem",
                                  }}
                                  key={i}
                                >
                                  {item.columnsRender
                                    ? item.columnsRender(row, index)
                                    : row[item?.key]}
                                </StyledTableCell>
                              ))
                            : null}
                        </StyledTableRow>
                      );
                    })}
                  </TableBody>
                )}
              </>
            )}
          </Table>
        </TableContainer>
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
            }-${page * pagination.pageSize + dataSource.length} of ${
              pagination.total
            }`}</Typography>
          </div>
          <div>
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(pagination.total / pagination.pageSize)}
                shape="rounded"
                onChange={(event, pageNumber) =>
                  handleChangePagination(pageNumber)
                }
                page={page + 1}
              />
            </Stack>
          </div>
        </div>
      </Paper>
    </div>
  );
};

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
                py: "0.5rem",
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

export default Datatable;
