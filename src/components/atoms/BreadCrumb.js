import { Typography } from "@mui/material";

export default function BreadCrumbs() {
  return (
    <div
      style={{
        display: "flex",
        marginTop: 5,
        marginBottom: 10,
        marginLeft: "2.25rem",
      }}
    >
      <Typography
        style={{ marginRight: 5, color: "#09090A" }}
      >{`YOU ARE HERE >`}</Typography>
      <Typography style={{ marginRight: 5 }}>{`Location `}</Typography>
    </div>
  );
}
