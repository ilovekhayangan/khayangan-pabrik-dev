import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export const ButtonExpand = ({ dataExpand }) => {
  const [isOpen, setIsOpen] = useState(false);
  //   console.log(
  //     "🚀 ~ file: ButtonExpand.js ~ line 15 ~ ButtonExpand ~ dataExpand",
  //     dataExpand
  //   );

  return (
    <div>
      <IconButton
        aria-label="expand row"
        size="small"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Box sx={{ margin: 1 }}>
          <Table size="small" aria-label="purchases">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>CPU</TableCell>
                <TableCell align="right">Memory</TableCell>
                <TableCell align="right">Storage Type</TableCell>
                <TableCell align="right">Storage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataExpand.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.cpu}</TableCell>
                  <TableCell align="right">{row.memory}</TableCell>
                  <TableCell align="right">{row.storageType}</TableCell>
                  <TableCell align="right">{row.storage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Collapse>
    </div>
  );
};
