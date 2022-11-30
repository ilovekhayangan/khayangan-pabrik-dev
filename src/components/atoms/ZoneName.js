import { Typography } from "@mui/material";

export default function ZoneName({ title }) {
  return (
    <Typography
      sx={{
        width: "100%",
        fontSize: "1.5rem",
        marginBottom: "0.75rem",
        fontWeight: "bold",
      }}
    >
      {`Region ${title}`}
    </Typography>
  );
}
