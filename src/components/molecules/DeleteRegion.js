import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";

import useRegionHook from "@hooks/useRegionHook";

export default function DeleteRegion({ close, idDelete }) {
  const { handleDeleteRegion } = useRegionHook();

  return (
    <>
      {/* Container */}
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          bgcolor: "#00000050",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 88,
        }}
        onClick={close}
      ></Box>

      {/* Card */}
      <Box
        sx={{
          width: "25rem",
          height: "auto",
          bgcolor: "white",
          position: "absolute",
          borderRadius: 1,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 99,
          p: 4,
        }}
      >
        <center>
          <Typography>Are You Sure You want to Delete this Region?</Typography>
        </center>
        <Box
          sx={{
            width: "100%",
            marginTop: 2,
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <Button
            sx={{ bgcolor: "red", color: "white", width: "7rem" }}
            onClick={() => {
              handleDeleteRegion(idDelete);
              close();
            }}
          >
            Yes
          </Button>
          <Button
            style={{
              backgroundColor: "#DCDCDC",
              color: "black",
              width: "7rem",
            }}
            onClick={close}
          >
            No
          </Button>
        </Box>
      </Box>
    </>
  );
}
