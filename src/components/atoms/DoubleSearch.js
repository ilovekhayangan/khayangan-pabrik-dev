import { Box, Input } from "@mui/material";
import React from "react";
import { BiSearch } from "react-icons/bi";

export const DoubleSearch = ({ onChange }) => {
  return (
    <div>
      <Box
        sx={{
          height: "2.5rem",
          width: "15rem",
          px: "1.25rem",
          borderRadius: "0.25rem",
          border: "1px solid #E0E0E0",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Input
            disableUnderline={true}
            placeholder="Search"
            sx={{ borderBottom: "none" }}
            onChange={(e) => onChange(e.target.value)}
          />
          <BiSearch style={{ fontSize: 24, color: "#4F4F4F" }} />
        </Box>
      </Box>
    </div>
  );
};
