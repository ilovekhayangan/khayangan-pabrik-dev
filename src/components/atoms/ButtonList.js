import React from "react";
import { Button, Typography } from "@mui/material";
import { AiOutlineZoomIn } from "react-icons/ai";

export const ButtonList = ({ id }) => {
  return (
    <Button
      id={`btn-modal-${id}`}
      sx={{
        bgcolor: "black",
        display: "flex",
        justifyContent: "space-between",
        py: 0,
        px: "0.5rem",
        ":hover": {
          bgcolor: "gray",
        },
      }}
    >
      <AiOutlineZoomIn style={{ color: "white", fontSize: "1rem" }} />
      <Typography
        sx={{ color: "white", textDecoration: "none", textTransform: "none" }}
      >
        List
      </Typography>
    </Button>
  );
};
