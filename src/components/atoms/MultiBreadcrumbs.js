import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Stack from "@mui/material/Stack";
import { AiOutlineRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";

export default function MultiBreadcrumbs({ title, breadcrumbs }) {
  return (
    <Stack spacing={2}>
      <Breadcrumbs
        separator={<AiOutlineRight size={10} />}
        aria-label="breadcrumb"
      >
        <Typography style={{ fontSize: "0.8rem", color: "black" }}>
          YOU ARE HERE
        </Typography>
        {breadcrumbs?.map((item, index) => (
          <Link
            key={index}
            to={item.route}
            style={{ textDecoration: "none", color: "black" }}
          >
            <Typography style={{ fontSize: "0.8rem" }}>{item.name}</Typography>
          </Link>
        ))}
      </Breadcrumbs>
    </Stack>
  );
}
