import React, { useState } from "react";

import { Typography, Box, Button } from "@mui/material";
import { FiEdit } from "react-icons/fi";

// component
import BreadCrumbs from "@components/atoms/BreadCrumb";
import LoadingAnim from "@components/atoms/LoadingAnim";
import CreateRegionCard from "@components/molecules/CreateRegionCard";
import CreateZoneCard from "@components/molecules/CreateZoneCard";
import EditRegionCard from "@components/molecules/EditRegionCard";
import EditZoneCard from "@components/molecules/EditZoneCard";
import TestMap from "@components/organism/TestMap";

// hooks
import useRegionHook from "@hooks/useRegionHook";
import DeleteRegion from "@components/molecules/DeleteRegion";
import DeleteZone from "@components/molecules/DeleteZone";

const Dashboard = () => {
  const [createRegion, setCreateRegion] = useState(false);
  const [createZone, setCreateZone] = useState(false);
  const [editRegion, setEditRegion] = useState(false);
  const [editZone, setEditZone] = useState(false);
  const [editRegionData, setEditRegionData] = useState([]);
  const [editZoneData, setEditZoneData] = useState([]);
  const [deleteRegion, setDeleteRegion] = useState(false);
  const [deleteZone, setDeleteZone] = useState(false);

  const { getRegionsData, getRegionsLoading, getRegionsRefetch } =
    useRegionHook();

  return (
    <>
      <BreadCrumbs />
      {/* header of Zone */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          boxSizing: "border-box",
          p: "0 2rem",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "2.5rem",
              margin: 0,
            }}
          >
            Location
          </Typography>
          <Typography
            sx={{
              fontSize: "0.8rem",
              margin: 0,
              color: "#09090A",
            }}
          >
            Let's Get Started
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {/* create region button */}
          <Button
            color="warning"
            sx={{
              bgcolor: "#EEB628",
              ":hover": {
                bgcolor: "yellow",
                color: "black",
              },
              color: "white",
              fontSize: "1rem",
              height: "2.5rem",
              display: "flex",
              alignItems: "center",
              borderRadius: 0,
              padding: "0 1rem",
              gap: 1,
              marginBottom: 1,
            }}
            onClick={() => setCreateRegion(true)}
          >
            <FiEdit style={{ fontSize: 25 }} />{" "}
            <Typography>CREATE REGION</Typography>
          </Button>

          {/* create zone button */}
          <Button
            color="warning"
            sx={{
              bgcolor: "#EEB628",
              ":hover": {
                bgcolor: "yellow",
                color: "black",
              },
              color: "white",
              fontSize: "1rem",
              height: "2.5rem",
              display: "flex",
              alignItems: "center",
              borderRadius: 0,
              padding: "0 1rem",
              gap: 1,
            }}
            onClick={() => setCreateZone(true)}
          >
            <FiEdit style={{ fontSize: 25 }} />{" "}
            <Typography>CREATE ZONE</Typography>
          </Button>
        </Box>
      </Box>

      {/* Location Container */}
      <Box
        sx={{
          width: "100%",
          height: "auto",
          overflow: "auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "start",
          boxSizing: "border-box",
          p: "0.5rem 2.25rem",
          margin: "0 0 0 0",
          gap: "2%",
        }}
      >
        {getRegionsLoading ? (
          <LoadingAnim />
        ) : (
          <>
            {createRegion ? (
              <CreateRegionCard
                close={() => {
                  setCreateRegion(false);
                  getRegionsRefetch();
                }}
                title="Create Region"
              />
            ) : (
              <></>
            )}

            {createZone ? (
              <CreateZoneCard
                close={() => {
                  setCreateZone(false);
                  getRegionsRefetch();
                }}
                title="Create Zone"
              />
            ) : (
              <></>
            )}

            {editRegion ? (
              <EditRegionCard
                close={() => {
                  setEditRegion(false);
                  getRegionsRefetch();
                }}
                title="Edit Region"
                region={editRegionData}
              />
            ) : (
              <></>
            )}

            {editZone ? (
              <EditZoneCard
                close={() => {
                  setEditZone(false);
                  getRegionsRefetch();
                }}
                title="Edit Region"
                zone={editZoneData}
              />
            ) : (
              <></>
            )}

            {deleteRegion ? (
              <DeleteRegion
                close={() => {
                  setDeleteRegion(false);
                  getRegionsRefetch();
                }}
                idDelete={editRegionData.id}
              />
            ) : (
              <></>
            )}

            {deleteZone ? (
              <DeleteZone
                close={() => {
                  setDeleteZone(false);
                  getRegionsRefetch();
                }}
                idDelete={editZoneData.id}
              />
            ) : (
              <></>
            )}

            <Box sx={{ zIndex: 10, width: "100%", marginBottom: "1rem" }}>
              <TestMap
                setEditRegion={setEditRegion}
                setEditZone={setEditZone}
                setEditRegionData={setEditRegionData}
                setEditZoneData={setEditZoneData}
                setDeleteRegion={setDeleteRegion}
                setDeleteZone={setDeleteZone}
              />
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default Dashboard;
