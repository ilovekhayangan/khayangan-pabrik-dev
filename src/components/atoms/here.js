import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { AiOutlineRight } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export default function HypervisorBreadcrumbs() {
  const navigate = useNavigate();

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      onClick={() => navigate("/")}
      style={{
        fontSize: "0.625rem",
        color: "#09090A",
        cursor: "pointer",
      }}
    >
      YOU ARE HERE
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="inherit"
      onClick={() => navigate("/zone")}
      style={{
        fontSize: "0.625rem",
        color: "#09090A",
        cursor: "pointer",
      }}
    >
      Zone
    </Link>,
    <label
      key="3"
      style={{
        fontSize: "0.625rem",
        fontWeight: "bold",
        color: "black",
      }}
    >
      Openstack
    </label>,
  ];

  return (
    <Stack spacing={2}>
      <Breadcrumbs
        separator={
          <AiOutlineRight
            size={10}
            style={{
              marginTop: "3px",
            }}
          />
        }
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
    </Stack>
  );
}
