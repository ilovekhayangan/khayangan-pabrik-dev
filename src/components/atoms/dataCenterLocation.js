import React, { useState } from "react";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

export const DataCenterLocation = () => {
  const [location, setLocation] = useState("");

  const handleChange = (event) => {
    setLocation(event.target.value);
  };

  return (
    <div>
      <Box sx={{ minWidth: 220, border: "transparent" }}>
        <FormControl fullWidth size="small">
          <InputLabel
            id="demo-simple-select-label"
            sx={{
              backgroundColor: "white",
              pr: 1,
            }}
          >
            Zone Location
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={location}
            label="Location"
            onChange={handleChange}
            sx={{ height: "2.5rem", borderColor: "red" }}
            // variant="standard"
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </div>
  );
};
