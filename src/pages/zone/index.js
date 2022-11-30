import React, { useState } from "react";
import useRegionHook from "@hooks/useRegionHook";

import { Typography, Box, Button } from "@mui/material";
// component
import BreadCrumbs from "@components/atoms/BreadCrumb";
import ZoneCard from "@components/molecules/ZoneCard";
import LoadingAnim from "@components/atoms/LoadingAnim";
import CreateZoneCard from "@components/molecules/CreateZoneCard";
import ZoneName from "@components/atoms/ZoneName";
import { FiEdit } from "react-icons/fi";
import notfound from "@assets/404.svg";

const Zone = () => {
  const { getRegionsData, getRegionsLoading, getRegionsRefetch } =
    useRegionHook();
  const [createZone, setCreateZone] = useState(false);

  return (
    <>
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
            Zone
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

      {/* Zone Container */}
      <Box
        sx={{
          width: "100%",
          paddingBottom: "3rem",
        }}
      >
        {getRegionsLoading ? (
          <LoadingAnim />
        ) : (
          getRegionsData?.regions?.map((item) => (
            <Box
              key={item.id}
              sx={{
                width: "100%",
                height: "auto",
                overflow: "auto",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "start",
                boxSizing: "border-box",
                p: "0.5rem 2.2rem",
                margin: "0 0 0 0",
                gap: "2%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  flexWrap: "wrap",
                  gap: "2%",
                  boxSizing: "border-box",
                  boxShadow: "0px 2px 8px 0px rgba(99, 99, 99, 0.2)",
                  padding: "1.5rem 2rem 1rem",
                  borderRadius: 5,
                }}
              >
                <ZoneName title={item.name} />
                {item.zones.length !== 0 ? (
                  item.zones?.map((items) => (
                    <ZoneCard
                      item={items}
                      idRegion={item.id}
                      reload={getRegionsRefetch}
                    />
                  ))
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <img
                      src={notfound}
                      alt={notfound}
                      style={{ width: "20%" }}
                    />
                    <Typography
                      sx={{
                        color: "#EEB628",
                        marginTop: 1,
                        fontSize: "1.5rem",
                      }}
                    >
                      No Zones Found
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          ))
        )}
      </Box>
    </>
  );
};

export default Zone;
