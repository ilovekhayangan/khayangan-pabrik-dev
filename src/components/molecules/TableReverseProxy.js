import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Pagination, Stack, Skeleton, Typography } from "@mui/material";
import { useEffect } from "react";
import LoadingAnim from "@components/atoms/LoadingAnim";
import oval from "@assets/ovals.svg";

const Datatable = ({
  dataSource,
  setPage,
  columns,
  loading,
  pagination,
  page,
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
        <TableContainer
          sx={{
            width: "auto",
            background: "#FDF7E9",
            borderRadius: 2,
            backgroundImage: `url(${oval})`,
            backgroundPosition: "150px 80%",
            backgroundRepeat: "no-repeat",
            backgroundSize: "300rem",
            border: "1px solid #E4E4E4",
          }}
        >
          <Table
            stickyHeader
            aria-label="sticky table"
            sx={{
              width: "100%",
            }}
          >
            <TableHead
              sx={{
                width: "auto",
                color: "black",
              }}
            >
              <TableRow sx={{ width: "auto" }}>
                {columns.map((item) => (
                  <StyledTableCell
                    align={item.headerAlign ?? "left"}
                    sx={{ fontWeight: "bold", px: "1rem" }}
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
              <TableBody>
                {dataSource.map((row, index) => {
                  return (
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
                  );
                })}
              </TableBody>
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
    color: theme.palette.common.black,
    backgroundColor: "transparent",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.common.white,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default Datatable;
