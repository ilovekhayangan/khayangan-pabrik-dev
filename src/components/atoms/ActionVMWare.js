import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { useMutation } from "@apollo/client";
import {
  DELETE_VMWARE_INSTANCE,
  UPDATE_VMWARE_STATUS,
  UPDATE_VMWARE_STATUS_2,
} from "@utils/gql/instance/constant";
import DeleteInstanceVM from "@components/molecules/DeleteInstanceVM";
import { makeStyles } from "@mui/styles";
import ConsoleVM from "./ConsoleVM";
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

export default function ActionVMWare({ data, refetch }) {
  const [actButton, setActButton] = React.useState(data?.state);
  const [isLoadingOn, setIsLoadingOn] = useState(false);
  const [isLoadingOff, setIsLoadingOff] = useState(false);
  const [isLoadingReboot, setIsLoadingReboot] = useState(false);
  const [deleteInstance, setDeleteInstance] = useState(false);
  const [deleteOnly, setDeleteOnly] = useState(false);
  const [cacheUrl, setCacheUrl] = useState("");

  const [deleteVMWareInstance, { loading }] = useMutation(
    DELETE_VMWARE_INSTANCE
  );

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setActButton(e.target.value);
    if (e.target.value === "POWER_ON") {
      handlePowerOn();
    } else if (e.target.value === "POWER_OFF") {
      handlePowerOff();
    } else if (e.target.value === "Reboot") {
      handleReboot();
    } else if (e.target.value === "Delete") {
      setDeleteInstance(true);
      setActButton(data.state);
    } else if (e.target.value === " Delete ") {
      console.log("delete only");
      setDeleteOnly(true);
      setActButton(data.state);
    } else if (e.target.value === "Console") {
      handleConsole();
      setActButton("POWER_ON");
    }
  };

  const token = window.localStorage.getItem("factory-token");

  const handleConsole = () => {
    axios
      .get(
        `${process.env.REACT_APP_FUNCTION}/vmware-tickets?query=${data?.vmId}?query=${data?.hypervisor?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const console = response.data.Data;
        window.open(
          `/view/index.html?host=${console.host}&port=${console.port}&ticket=${console.ticket}`
        );
      })
      .catch((error) => {
        console.log(error);
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
        setTimeout(() => {
          dispatch(
            setErrorConsole({
              data: false,
            })
          );
        }, 3000);
      });
  };

  const [updatePowerStatus, { loadingStatus }] = useMutation(
    UPDATE_VMWARE_STATUS_2
  );

  const handlePowerOn = async () => {
    setIsLoadingOn(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_FUNCTION}/vmware-poweron`,
        {
          name_vm: data?.vmId,
          hypervisor_id: data?.hypervisor?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        setIsLoadingOn(false);
        // updatePowerStatus({
        //   variables: {
        //     id: data.id,
        //     input: {
        //       state: "POWER_ON",
        //     },
        //   },
        // });
        refetch();
      }
      // setTimeout(() => {
      //   setIsLoadingOn(false);
      //   updatePowerStatus({
      //     variables: {
      //       id: data.id,
      //       input: {
      //         state: "POWER_ON",
      //       },
      //     },
      //   });
      //   refetch();
      // }, 1000 * 40);
    } catch (error) {
      console.log(error);
      dispatch(
        setErrorConsole({
          data: true,
        })
      );
      dispatch(
        setErrorMessage({
          data: "Power On Failed",
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
        `${process.env.REACT_APP_FUNCTION}/vmware-poweroff`,
        {
          name_vm: data?.vmId,
          hypervisor_id: data?.hypervisor?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        setIsLoadingOff(false);
        // updatePowerStatus({
        //   variables: {
        //     id: data.id,
        //     input: {
        //       state: "POWER_OFF",
        //     },
        //   },
        // });
        refetch();
      }
      // setTimeout(() => {
      //   setIsLoadingOff(false);
      //   updatePowerStatus({
      //     variables: {
      //       id: data.id,
      //       input: {
      //         state: "POWER_OFF",
      //       },
      //     },
      //   });
      //   refetch();
      // }, 1000 * 5);
    } catch (error) {
      console.log(error);
      dispatch(
        setErrorConsole({
          data: true,
        })
      );
      dispatch(
        setErrorMessage({
          data: "Power Off Failed",
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

  const handleReboot = async () => {
    setIsLoadingReboot(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_FUNCTION}/vmware-reboot`,
        {
          name_vm: data?.vmId,
          hypervisor_id: data?.hypervisor?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response);
      if (response.status == 200) {
        setIsLoadingReboot(false);
        setActButton("POWER_ON");
        refetch();
      }
      // setTimeout(() => {
      //   setIsLoadingReboot(false);
      //   setActButton("POWER_ON");
      // }, 1000 * 40);
    } catch (error) {
      console.log(error);
      dispatch(
        setErrorConsole({
          data: true,
        })
      );
      dispatch(
        setErrorMessage({
          data: "Rebooting Failed",
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
      await axios.post(
        `${process.env.REACT_APP_FUNCTION}/vmware-deletevm`,
        {
          name_vm: data?.vmId,
          hypervisor_id: data?.hypervisor?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      refetch();
    } catch (error) {
      refetch();
      console.log(error);
      setActButton(data.state);
      // dispatch(
      //   setErrorConsole({
      //     data: true,
      //   })
      // );
      // dispatch(
      //   setErrorMessage({
      //     data: "Delete Failed",
      //   })
      // );
      // setTimeout(() => {
      //   dispatch(
      //     setErrorConsole({
      //       data: false,
      //     })
      //   );
      // }, 3000);
    }
  };

  const handleOnlyDeleteMg = async () => {
    try {
      deleteVMWareInstance({
        variables: {
          id: data.id,
        },
      });
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

  const handleDeleteOnly = async () => {
    try {
      deleteVMWareInstance({
        variables: {
          id: data.id,
        },
      });
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
        {actButton === "POWER_OFF" && !data?.delete ? (
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
        ) : actButton === "POWER_ON" && !data?.delete ? (
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
            <MenuItem value="Reboot">
              {isLoadingReboot ? (
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
            onClick={handleOnlyDeleteMg}
            variant="standard"
            disableUnderline
            sx={{ bgcolor: "black", color: "white", px: 1, borderRadius: 1 }}
          >
            <MenuItem value=" Delete ">Delete</MenuItem>
          </Select>
        )}
      </FormControl>
      {deleteInstance ? (
        <DeleteInstanceVM
          close={() => {
            setDeleteInstance(false);
          }}
          handleDelete={handleDelete}
        />
      ) : null}
      {deleteOnly ? (
        <DeleteInstanceVM
          close={() => {
            setDeleteOnly(false);
          }}
          handleDelete={handleDeleteOnly}
        />
      ) : null}
    </Box>
  );
}
