import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { UPDATE_VM_STATUS } from "@utils/gql/instance/constant";
import { useMutation } from "@apollo/client";
import DeleteInstanceOp from "@components/molecules/DeleteInstanceOp";
import { makeStyles } from "@mui/styles";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  setErrorConsole,
  setErrorMessage,
} from "@redux/features/auth/authSlice";

const useStyles = makeStyles({
  select: {
    "&:before": {
      borderColor: "white",
    },
    "&:after": {
      borderColor: "white",
    },
    "&:not(.Mui-disabled):hover::before": {
      borderColor: "white",
    },
    "&.Mui-disabled": {
      color: "white",
    },
  },
  icon: {
    "&.MuiSelect-icon": {
      fill: "white",
    },
  },
  root: {
    color: "white",
  },
});

export default function ActionButton({ data, refetch, setAlert }) {
  const [actButton, setActButton] = useState(data?.state);
  const [isLoadingOn, setIsLoadingOn] = useState(false);
  const [isLoadingOff, setIsLoadingOff] = useState(false);
  const [isLoadingSoftReboot, setIsLoadingSoftReboot] = useState(false);
  const [isLoadingHardReboot, setIsLoadingHardReboot] = useState(false);
  const [deleteInstance, setDeleteInstance] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setActButton(e.target.value);
    if (e.target.value === "POWER_ON") {
      handlePowerOn();
    } else if (e.target.value === "POWER_OFF") {
      handlePowerOff();
    } else if (e.target.value === "Soft Reboot") {
      handleSoftReboot();
    } else if (e.target.value === "Reboot") {
      handleHardReboot();
    } else if (e.target.value === "Delete") {
      setDeleteInstance(true);
      setActButton(data.state);
    } else if (e.target.value === "Console") {
      setActButton("POWER_ON");
      handleConsole();
    }
  };

  const [updatePowerStatus, { loading }] = useMutation(UPDATE_VM_STATUS);

  const token = window.localStorage.getItem("factory-token");

  const handleConsole = async () => {
    try {
      let response = await axios.post(
        `${process.env.REACT_APP_OPENSTACK}/os-instance-console`,
        {
          mgInstanceId: data.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        window.open(response.data.data.console.url, "_blank");
      }
    } catch (err) {
      console.log(err);
      dispatch(
        setErrorConsole({
          data: true,
        })
      );
      dispatch(
        setErrorMessage({
          data: "Console error",
        })
      );
      setActButton(data.state);
      setTimeout(() => {
        dispatch(
          setErrorConsole({
            data: false,
          })
        );
      }, 3000);
    }
  };

  const handlePowerOn = async () => {
    setIsLoadingOn(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_OPENSTACK}/os-instance-power`,
        {
          mgInstanceId: data.id,
          state: "on",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);

      if (response.status === 200) {
        setIsLoadingOn(false);
        refetch();
      }

      // setTimeout(() => {
      //   setIsLoadingOn(false);
      //   refetch();
      // }, 1000 * 5);
    } catch (error) {
      console.log(error);
      setIsLoadingOn(false);
      dispatch(
        setErrorConsole({
          data: true,
        })
      );
      dispatch(
        setErrorMessage({
          data: error.response.data.message,
        })
      );
      setActButton(data.state);
      setTimeout(() => {
        dispatch(
          setErrorConsole({
            data: false,
          })
        );
      }, 3000);
    }
  };

  const handlePowerOff = async () => {
    setIsLoadingOff(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_OPENSTACK}/os-instance-power`,
        {
          mgInstanceId: data.id,
          state: "off",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);
      if (response.status === 200) {
        setIsLoadingOff(false);
        refetch();
      }

      // setTimeout(() => {
      //   setIsLoadingOff(false);
      //   refetch();
      // }, 1000 * 5);
    } catch (error) {
      console.log(error);
      setIsLoadingOff(false);
      dispatch(
        setErrorConsole({
          data: true,
        })
      );
      dispatch(
        setErrorMessage({
          data: error.response.data.message,
        })
      );
      setActButton(data.state);
      setTimeout(() => {
        dispatch(
          setErrorConsole({
            data: false,
          })
        );
      }, 3000);
    }
  };

  const handleSoftReboot = async () => {
    setIsLoadingSoftReboot(true);
    try {
      let response = await axios.post(
        `${process.env.REACT_APP_OPENSTACK}/os-instance-reboot`,
        {
          mgInstanceId: data.id,
          type: "soft",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);
      if (response) {
        setIsLoadingSoftReboot(false);
      }
      // setTimeout(() => {
      //   setIsLoadingSoftReboot(false);
      //   refetch();
      // }, 1000 * 5);
    } catch (error) {
      console.log(error);
    }
  };

  const handleHardReboot = async () => {
    setIsLoadingHardReboot(true);
    try {
      let response = await axios.post(
        `${process.env.REACT_APP_OPENSTACK}/os-instance-reboot`,
        {
          mgInstanceId: data.id,
          type: "hard",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response) {
        setIsLoadingHardReboot(false);
        refetch();
      }

      // setTimeout(() => {
      //   setIsLoadingHardReboot(false);
      //   refetch();
      // }, 1000 * 5);
    } catch (error) {
      console.log(error);
      setIsLoadingHardReboot(false);
      dispatch(
        setErrorConsole({
          data: true,
        })
      );
      dispatch(
        setErrorMessage({
          data: "Reboot Failed",
        })
      );
      setActButton(data.state);
      setTimeout(() => {
        dispatch(
          setErrorConsole({
            data: false,
          })
        );
      }, 3000);
    }
  };

  const handleDelete = async () => {
    try {
      let response = await axios.post(
        `${process.env.REACT_APP_OPENSTACK}/os-instance-delete`,
        {
          mgInstanceId: data.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      refetch();
    } catch (error) {
      console.log(error);
      dispatch(
        setErrorConsole({
          data: true,
        })
      );
      dispatch(
        setErrorMessage({
          data: "Delete Failed",
        })
      );
      setActButton(data.state);
      setTimeout(() => {
        dispatch(
          setErrorConsole({
            data: false,
          })
        );
      }, 3000);
    }
  };

  const classes = useStyles();

  useEffect(() => {
    setActButton(data?.state);
  }, [data?.state]);

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth size="small">
        {actButton === "POWER_OFF" && data?.deleted === false ? (
          <Select
            value={actButton}
            displayEmpty
            className={classes.select}
            inputProps={{
              "aria-label": "Without label",
              classes: {
                icon: classes.icon,
                root: classes.root,
              },
            }}
            label="Action"
            onChange={handleChange}
            variant="standard"
            disableUnderline
            sx={{
              bgcolor: "black",
              color: "white",
              px: 1,
              borderRadius: 1,
            }}
          >
            <MenuItem value="POWER_OFF" disabled>
              {isLoadingOff ? (
                <div style={{ display: "flex" }}>
                  <CircularProgress size="1.5rem" sx={{ color: "white" }} />
                  <p style={{ marginLeft: "0.5rem", color: "white" }}>
                    Turning Off
                  </p>
                </div>
              ) : (
                "Power Off"
              )}
            </MenuItem>
            <MenuItem value="POWER_ON">
              {isLoadingOn ? (
                <div style={{ display: "flex" }}>
                  <CircularProgress size="1.5rem" sx={{ color: "white" }} />
                  <p style={{ marginLeft: "0.5rem", color: "white" }}>
                    Turning On
                  </p>
                </div>
              ) : (
                "Power On"
              )}
            </MenuItem>
            <MenuItem value="Delete">Delete</MenuItem>
          </Select>
        ) : actButton === "POWER_ON" && data?.deleted === false ? (
          <Select
            value={actButton}
            displayEmpty
            className={classes.select}
            inputProps={{
              "aria-label": "Without label",
              classes: {
                icon: classes.icon,
                root: classes.root,
              },
            }}
            label="Action"
            onChange={handleChange}
            variant="standard"
            disableUnderline
            sx={{ bgcolor: "black", color: "white", px: 1, borderRadius: 1 }}
          >
            <MenuItem value="POWER_ON" disabled>
              {isLoadingOn ? (
                <div style={{ display: "flex" }}>
                  <CircularProgress size="1.5rem" sx={{ color: "white" }} />
                  <p style={{ marginLeft: "0.5rem", color: "white" }}>
                    Turning On
                  </p>
                </div>
              ) : (
                "Power On"
              )}
            </MenuItem>
            <MenuItem value="POWER_OFF">
              {isLoadingOff ? (
                <div style={{ display: "flex" }}>
                  <CircularProgress size="1.5rem" sx={{ color: "white" }} />
                  <p style={{ marginLeft: "0.5rem", color: "white" }}>
                    Turning Off
                  </p>
                </div>
              ) : (
                "Power Off"
              )}
            </MenuItem>
            {/* <MenuItem value="Soft Reboot">
              {isLoadingSoftReboot ? <CircularProgress /> : "Soft Reboot"}
            </MenuItem> */}
            <MenuItem value="Reboot">
              {isLoadingHardReboot ? (
                <div style={{ display: "flex" }}>
                  <CircularProgress size="1.5rem" sx={{ color: "white" }} />
                  <p style={{ marginLeft: "0.5rem", color: "white" }}>
                    Rebooting
                  </p>
                </div>
              ) : (
                "Reboot"
              )}
            </MenuItem>
            <MenuItem value="Delete">Delete</MenuItem>
            <MenuItem value="Console">Console</MenuItem>
          </Select>
        ) : (
          <Select
            value={actButton === "ERROR" ? "Error" : "Deleted"}
            displayEmpty
            className={classes.select}
            inputProps={{
              "aria-label": "Without label",
              classes: {
                icon: classes.icon,
                root: classes.root,
              },
            }}
            label="Action"
            onChange={handleChange}
            variant="standard"
            disableUnderline
            sx={{ bgcolor: "black", color: "white", px: 1, borderRadius: 1 }}
          >
            <MenuItem value="Delete">Delete</MenuItem>
          </Select>
        )}
      </FormControl>
      {deleteInstance ? (
        <DeleteInstanceOp
          handleDelete={handleDelete}
          close={() => {
            setDeleteInstance(false);
          }}
        />
      ) : null}
    </Box>
  );
}
