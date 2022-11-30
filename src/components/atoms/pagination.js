import * as React from "react";
import Pagination from "@mui/material/Pagination";
import TablePagination from "@mui/material/TablePagination";

import Stack from "@mui/material/Stack";

export const PaginationRounded = () => {
  return (
    <Stack spacing={2}>
      <Pagination count={3} variant="outlined" shape="rounded" />
    </Stack>
  );
};

export const PaginationTable = () => {
  const [page, setPage] = React.useState(2);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0);
  };

  return (
    <TablePagination
      component="div"
      count={18}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
};
