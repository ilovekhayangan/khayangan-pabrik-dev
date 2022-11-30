import { Box, Typography } from "@mui/material";

export default function ErrorLoginMessage() {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          padding: " 1rem 0",
          backgroundColor: "#ffcdd2",
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            color: "red",
          }}
        >
          email or password invalid
        </Typography>
      </Box>
    </>
  );
}
