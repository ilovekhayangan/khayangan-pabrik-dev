import { useState } from "react";
import { Box, Grow, Paper, Snackbar, Typography } from "@mui/material";
import { FiEdit } from "react-icons/fi";
import { BiDotsVertical } from "react-icons/bi";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { GrTechnology } from "react-icons/gr";
import Openstack from "@assets/openstack.svg";
import VMware from "@assets/vmware.svg";

// component
import graph from "@assets/graph.svg";
import EditHypervisorCard from "./EditHypervisorCard";
import oval from "@assets/oval.svg";
import { DELETE_HYPERVISOR } from "@utils/gql/hypervisor/constant";
import DeleteHypervisor from "./DeleteHypervisor";
import { useMutation } from "@apollo/client";

export default function RegionCard({ item, reload }) {
  const [editZone, setEditZone] = useState(false);
  const [del, setDel] = useState(false);
  const [popup, setPopup] = useState(false);

  const [deleteHypervisor, { loading: deleteLoading }] =
    useMutation(DELETE_HYPERVISOR);

  const handleDelete = async () => {
    try {
      await deleteHypervisor({
        variables: {
          id: item.id,
        },
      });

      reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {editZone ? (
        <EditHypervisorCard
          close={() => {
            setEditZone(false);
            reload();
          }}
          title="Edit Hypervisor"
          data={item}
        />
      ) : (
        <></>
      )}

      {del ? (
        <DeleteHypervisor
          handleDelete={handleDelete}
          close={() => {
            setDel(false);
          }}
          name={item.name}
        />
      ) : null}

      <div
        style={{
          width: "23.5%",
          border: "solid 1px #E0E0E0",
          borderRadius: "5px",
          backgroundColor: "rgba(238, 182, 40, 0.15)",
          backgroundImage: `url(${oval})`,
          backgroundPosition: "100px 50%",
          backgroundRepeat: "no-repeat",
          backgroundSize: "20rem",
          boxSizing: "border-box",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          padding: "1rem",
          marginBottom: "1rem",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        {popup ? (
          <Grow in={popup}>
            <Paper
              elevation={3}
              sx={{
                zIndex: 50,
                display: "flex",
                alignItems: "center",
                position: "absolute",
                top: 35,
                right: 15,
                fontSize: "1rem",
                fontWeight: 900,
              }}
            >
              <div
                style={{
                  borderRadius: "50%",
                  backgroundColor: "red",
                  color: "white",
                  display: "flex",
                  width: "1.25rem",
                  height: "1.25rem",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  position: "absolute",
                  top: -5,
                  right: -5,
                }}
                onClick={() => setPopup(!popup)}
              >
                X
              </div>
              <div>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "7px 10px",
                    cursor: "pointer",
                    ":hover": {
                      bgcolor: "#eeeeee",
                    },
                  }}
                  onClick={() => {
                    setPopup(false);
                    setEditZone(true);
                  }}
                >
                  <p>Edit</p>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "7px 10px",
                    cursor: "pointer",
                    ":hover": {
                      bgcolor: "#eeeeee",
                    },
                  }}
                  onClick={() => {
                    setPopup(false);
                    setDel(true);
                  }}
                >
                  <p>Delete</p>
                </Box>
              </div>
            </Paper>
          </Grow>
        ) : null}

        <BiDotsVertical
          onClick={() => setPopup(!popup)}
          style={{
            fontSize: "1.25rem",
            cursor: "pointer",
            position: "absolute",
            top: 5,
            right: 8,
          }}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <img
            src={graph}
            alt={graph}
            style={{
              height: "1.75rem",
            }}
          />
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            {item.name}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <MapOutlinedIcon
            sx={{
              fontSize: "1.75rem",
            }}
          />
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            {`Zone : ${item.zone.name}`}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            marginTop: "0.25rem",
            marginBottom: "0.5rem",
          }}
        >
          {item.vendor === "vmware" ? (
            <img
              src={VMware}
              alt={VMware}
              style={{
                height: "1.5rem",
              }}
            />
          ) : (
            <img
              src={Openstack}
              alt={Openstack}
              style={{
                height: "2rem",
              }}
            />
          )}
        </Box>
      </div>
    </>
  );
}
