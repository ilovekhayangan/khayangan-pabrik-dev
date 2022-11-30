import icon from "@assets/logo.svg";
import { Box, Typography, Link } from "@mui/material";

const LoginNav = () => {
  return (
    <>
      <Box
        sx={{
          boxSizing: "border-box",
          width: "100%",
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "15px",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          boxShadow: "0 0 1px 0 gray",
        }}
      >
        <Link href="/dashboard" underline="none">
          <img
            src={icon}
            alt={icon}
            style={{
              width: 35,
              height: "auto",
              cursor: "pointer",
            }}
          />
        </Link>
        <Link href="/dashboard" underline="hover" sx={{ color: "black" }}>
          {" "}
          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Khayangan
          </Typography>{" "}
        </Link>
      </Box>
    </>
  );
};
export default LoginNav;
