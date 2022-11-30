import React, { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { ref } from "yup";

export const ChangeStatus = ({ handleChange, statusReqHypervisor }) => {
  return (
    <div>
      <FormControl
        sx={{
          minWidth: 150,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        {statusReqHypervisor === "COMPLETE" ? (
          <Select
            value={statusReqHypervisor}
            onChange={(v) => {
              handleChange(v.target.value);
            }}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            style={
              statusReqHypervisor === "COMPLETE"
                ? { backgroundColor: "#21C51D" }
                : null
            }
            sx={{
              color: "white",
              fontWeight: "bold",
              height: "3rem",
              fontSize: "1.25rem",
              px: "0.5rem",
              borderRadius: "0.25rem",
            }}
            variant="standard"
            disableUnderline
          >
            <MenuItem value="COMPLETE" disabled>
              Finish
            </MenuItem>
            <MenuItem value="Delete">Delete</MenuItem>
          </Select>
        ) : (
          <Select
            value={statusReqHypervisor}
            onChange={(v) => {
              handleChange(v.target.value);
            }}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            style={
              statusReqHypervisor === "COMPLETE"
                ? { backgroundColor: "#21C51D" }
                : statusReqHypervisor === "ONPROGRESS"
                ? { backgroundColor: "#FFB800" }
                : statusReqHypervisor === "WAITING"
                ? { backgroundColor: "#828282" }
                : statusReqHypervisor === "CANCEL"
                ? { backgroundColor: "#FF0000" }
                : null
            }
            sx={{
              color: "white",
              fontWeight: "bold",
              height: "3rem",
              fontSize: "1.25rem",
              px: "0.5rem",
              borderRadius: "0.25rem",
            }}
            variant="standard"
            disableUnderline
          >
            <MenuItem value="WAITING">Waiting</MenuItem>
            <MenuItem value="ONPROGRESS">On Progress</MenuItem>
            <MenuItem value="CANCEL">Failed</MenuItem>
            <MenuItem value="COMPLETE">Finish</MenuItem>
          </Select>
        )}
      </FormControl>
    </div>
  );
};
