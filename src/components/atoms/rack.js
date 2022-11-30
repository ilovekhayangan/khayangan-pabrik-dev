import React, { useState } from "react";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

export const Rack = ({ name, handleChange, selectData, value }) => {
  return (
    <Box sx={{ width: "15rem" }}>
      <FormControl fullWidth size="small">
        <InputLabel
          id="demo-simple-select-label"
          sx={{
            backgroundColor: "white",
            pr: 1,
          }}
        >
          {name}
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label="Location"
          onChange={async (v) => handleChange(v.target.value)}
          sx={{ height: "2.5rem" }}
        >
          <MenuItem value="">All Data</MenuItem>
          {selectData?.map((item, index) => (
            <MenuItem key={index} value={item.name}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export const RackClient = ({ name, handleChange, selectData }) => {
  const [rack, setRack] = useState("");

  return (
    <Box sx={{ width: "15rem" }}>
      <FormControl fullWidth size="small">
        <InputLabel
          id="demo-simple-select-label"
          sx={{
            backgroundColor: "white",
            pr: 1,
          }}
        >
          {name}
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={rack}
          label="Location"
          onChange={(v) => {
            setRack(v.target.value);
            handleChange(v.target.value);
          }}
          sx={{ height: "2.5rem" }}
        >
          <MenuItem value="All Data">All Data</MenuItem>
          {selectData?.map((item, index) => (
            <MenuItem key={index} value={item.firstName}>
              {item.firstName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
