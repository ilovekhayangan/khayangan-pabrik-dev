import { Typography } from "@mui/material";
import React from "react";

export const PageTitle = ({ title, marginBottom, marginTop, fontWeight }) => {
  return (
    <div>
      <Typography
        sx={{ fontSize: 26 }}
        style={{
          marginBottom: marginBottom,
          marginTop: marginTop,
          fontWeight: fontWeight,
        }}
      >
        {title}
      </Typography>
    </div>
  );
};
