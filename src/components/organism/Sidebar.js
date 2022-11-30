import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeUser } from "@redux/features/auth/authSlice";

import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { FiMap, FiLogOut, FiSettings } from "react-icons/fi";
import { BiBuilding, BiGitPullRequest } from "react-icons/bi";
import { BsHddRack } from "react-icons/bs";
import { MdOutlineDashboard } from "react-icons/md";
import { TbHierarchy2, TbUsers } from "react-icons/tb";
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "@assets/logo.svg";
import "react-pro-sidebar/dist/css/styles.css";

export const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(removeUser());
  };

  const [isCollapse, setIsCollapse] = useState(false);

  return (
    <ProSidebar collapsed={isCollapse}>
      {/* Header Start */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "1.25rem",
          boxSizing: "border-box",
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{ cursor: "pointer" }}
          onClick={() => setIsCollapse(false)}
        />
        {!isCollapse ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography
              sx={{
                color: "white",
                fontWeight: "bold",
                marginLeft: 1,
                fontSize: 20,
                cursor: "pointer",
              }}
            >
              Khayangan
            </Typography>

            <GiHamburgerMenu
              size={20}
              style={{ marginLeft: 15, cursor: "pointer" }}
              onClick={() => setIsCollapse(true)}
            />
          </div>
        ) : null}
      </div>
      {/* Header End */}

      <SidebarContent>
        <Menu>
          <MenuItem icon={<MdOutlineDashboard fontSize={20} />}>
            Dashboard
            <Link to={"/dashboard"} />
          </MenuItem>
          <MenuItem icon={<FiMap fontSize={20} />}>
            Location
            <Link to={"/location"} />
          </MenuItem>

          <MenuItem icon={<BsHddRack fontSize={20} />}>
            List Hypervisor
            <Link to={"/hypervisor"} />
          </MenuItem>
          <SubMenu
            title="Manage Hypervisor"
            icon={<TbHierarchy2 fontSize={20} />}
          >
            <SubMenu title="OpenStack">
              <MenuItem>
                Hypervisor
                <Link to="/hypervisor/openstack/list" />
              </MenuItem>
              <MenuItem>
                Project
                <Link to="/hypervisor/openstack/project" />
              </MenuItem>
              <MenuItem>
                Instance
                <Link to="/hypervisor/openstack/instance" />
              </MenuItem>
              <MenuItem>
                Volume
                <Link to="/hypervisor/openstack/volume" />
              </MenuItem>
            </SubMenu>
            <SubMenu title="VMWare">
              <MenuItem>
                Hypervisor
                <Link to="/hypervisor/wmWare/list" />
              </MenuItem>
              <MenuItem>
                Project
                <Link to="/hypervisor/vmware/project" />
              </MenuItem>
              <MenuItem>
                Instance
                <Link to="/hypervisor/vmware/instance" />
              </MenuItem>
              <MenuItem>
                Volume
                <Link to="/hypervisor/vmware/volume" />
              </MenuItem>
            </SubMenu>
          </SubMenu>
          <SubMenu title="Request" icon={<BiGitPullRequest fontSize={20} />}>
            <MenuItem>
              Hypervisor
              <Link to={"/request/newReq"} />
            </MenuItem>
          </SubMenu>
          <MenuItem icon={<TbUsers fontSize={20} />}>
            Client
            <Link to={"/client"} />
          </MenuItem>
          <SubMenu title="Settings Server" icon={<FiSettings fontSize={20} />}>
            <MenuItem>
              Elastic Server
              <Link to={"/setting/elasticSearch"} />
            </MenuItem>
            <MenuItem>
              Reverse Server
              <Link to={"/setting/reverseProxy"} />
            </MenuItem>
            <MenuItem>
              SSH Server
              <Link to={"/setting/sshServer"} />
            </MenuItem>
            <MenuItem>
              Web SSH
              <Link to={"/setting/webSsh"} />
            </MenuItem>
            <MenuItem>
              Billing Setting
              <Link to={"/setting/billingSetting"} />
            </MenuItem>
          </SubMenu>
        </Menu>
      </SidebarContent>

      <SidebarFooter>
        <Menu>
          <MenuItem icon={<FiLogOut fontSize={20} />} onClick={handleLogout}>
            Logout
          </MenuItem>
        </Menu>
      </SidebarFooter>
    </ProSidebar>
  );
};
