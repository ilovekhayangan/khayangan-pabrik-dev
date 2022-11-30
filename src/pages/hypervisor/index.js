import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import useRegionHook from "@hooks/useRegionHook";
import notfound from "@assets/404.svg";

import { Typography, Box, Button } from "@mui/material";

// component
import BreadCrumbs from "@components/atoms/BreadCrumb";
import HypervisorCard from "@components/molecules/HypervisorCard";
import LoadingAnim from "@components/atoms/LoadingAnim";
import CreateHypervisorCard from "@components/molecules/CreateHypervisorCard";
import { FiEdit } from "react-icons/fi";
import ZoneName from "@components/atoms/ZoneName";
import ZoneCard from "@components/molecules/ZoneCard";
import SingleBreadcrumbs from "@components/atoms/SingleBreadrumb";

// query
const QUERY = gql`
  query {
    hypervisors(limit: 100) {
      id
      name
      region {
        id
        name
      }
      zone {
        id
        name
      }
      vendor
      cpu
      memory
      storage
      endpoint
      description
    }
  }
`;

const Hypervisor = () => {
  const [createZone, setCreateZone] = useState(false);
  const { getRegionsData, getRegionsLoading, getRegionsRefetch } =
    useRegionHook();

  const {
    data: getDatas,
    loading: dataLoading,
    refetch: dataRefetch,
  } = useQuery(QUERY);

  return (
    <>
      {createZone ? (
        <CreateHypervisorCard
          close={() => {
            setCreateZone(false);
            getRegionsRefetch();
          }}
          title="Register New Hypervisor"
        />
      ) : (
        <></>
      )}

      <div style={{ paddingTop: "0.25rem", paddingLeft: "2rem" }} id="top">
        <SingleBreadcrumbs title="List Hypervisor" route="openstack/instance" />
      </div>
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
            My Hypervisor
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
      </Box>

      {/* Zone Container */}
      <Box
        sx={{
          width: "100%",
          paddingBottom: "3rem",
        }}
      >
        {dataLoading ? (
          <LoadingAnim />
        ) : (
          getRegionsData?.regions?.map((item, index) => (
            <Box
              key={index}
              sx={{
                width: "100%",
                height: "auto",
                overflow: "auto",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "start",
                boxSizing: "border-box",
                p: "1rem 2.2rem",
                margin: "0 0 1rem 0",
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
                  boxShadow:
                    "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                  padding: "1.5rem 2rem 1rem",
                  borderRadius: 5,
                }}
              >
                <ZoneName title={item.name} />
                {item.hypervisors.length !== 0 ? (
                  item.hypervisors?.map((items) => (
                    <HypervisorCard
                      item={items}
                      reload={getRegionsRefetch}
                      key={index}
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

export default Hypervisor;
