import { makeStyles, styled } from "@mui/styles";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  sidebarOpen: {
    display: "flex",
    color: "#e1e9fc",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0rem 1rem 0rem 1rem",
    listStyle: "none",
    height: "60px",
    textDecoration: "none",
    fontSize: "18px",
    "&:hover": {
      backgroundColor: "#252831",
      borderLeft: "4px solid #632ce4",
      cursor: "pointer",
    },
  },
  sidebarLabel: {
    marginLeft: "1rem",
  },
  dropdownLink: {
    backgroundColor: "#414757",
    height: "60px",
    paddingLeft: "3rem",
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: "#f5f5f5",
    fontSize: "18px",
    "&:hover": {
      backgroundColor: "#632ce4",
      cursor: "pointer",
    },
  },
});

export default function SidebarItem({ item }) {
  const [open, setOpen] = useState(false);

  if (item.childrens) {
    return (
      <div className={open ? "sidebar-item open" : "sidebar-item"}>
        <div className="sidebar-title">
          <span>
            {item.icon && <i className={item.icon}></i>}
            {item.title}
          </span>
          <i
            className="bi-chevron-down toggle-btn"
            onClick={() => setOpen(!open)}
          ></i>
        </div>
        <div className="sidebar-content">
          {item.childrens.map((child, index) => (
            <SidebarItem key={index} item={child} />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <a href={item.path || "#"} className="sidebar-item plain">
        {item.icon && <i className={item.icon}></i>}
        {item.title}
      </a>
    );
  }
}
