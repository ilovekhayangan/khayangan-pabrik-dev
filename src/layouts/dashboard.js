import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Typography,
  Divider,
  Box,
  Grow,
  Alert,
  CircularProgress,
  Snackbar,
  Paper,
} from "@mui/material";
import { FaCaretDown, FaDatabase } from "react-icons/fa";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { removeUser } from "@redux/features/auth/authSlice";
import "@components/atoms/sidebar/sidebar.css";
import PopUpNotif from "@components/molecules/PopUpNotif";
import { Sidebar } from "@components/organism/Sidebar";
import { makeStyles } from "@mui/styles";
import {
  useMutation,
  useSubscription,
  useLazyQuery,
  useQuery,
} from "@apollo/client";
import {
  POST_MESSAGE,
  GET_MESSAGE,
  SUBCRIPTION_GET_REQUEST,
} from "@utils/gql/subscription/constant";
import { GETNEWREQ } from "@utils/gql/reqOpenstack/constant";

const useStyles = makeStyles({
  loadingAlert: {
    backgroundColor: "black",
  },
});

const DashboardLayout = () => {
  const [expanded, setExpanded] = useState(false);
  const [setting, setSetting] = useState(false);
  const [alert, setAlert] = useState(true);
  const dispatch = useDispatch();
  // const loadingCron = useSelector((state) => state.user)
  const AuthStore = useSelector((state) => state.auth);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  let navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(removeUser());
  };

  const { data: dataSubscription, refetch: subscriptionRefetch } =
    useSubscription(SUBCRIPTION_GET_REQUEST);

  const [postMessage, { loading: loadingPostMessage }] =
    useMutation(POST_MESSAGE);

  const SubmitMessages = async (inputsMessage) => {
    if (inputsMessage) {
      await postMessage({
        variables: {
          inputs: inputsMessage ? inputsMessage : "",
        },
      });

      refetchs();
    }
  };

  const [getMessage, { loading, error, refetch: refetchs }] = useLazyQuery(
    GET_MESSAGE,
    {
      onCompleted: ({ messagesConnection }) => {
        setMesLength(messagesConnection.total);
      },
    }
  );

  const [mesLength, setMesLength] = useState(0);
  if (mesLength > 0) {
    document.title = `(${mesLength}) Khayangan Factory`;
  } else if (mesLength === 0) {
    document.title = `Khayangan Factory`;
  }

  let data = [];

  useEffect(() => {
    const inputsMessage = dataSubscription?.requestHypervisorsAdded.map(
      (item) => ({
        name: `Request Hypervisor ${item.name}`,
        description: item.createdBy.lastName
          ? `from Client ${item.createdBy.firstName} ${item.createdBy.lastName}`
          : `from Client ${item.createdBy.firstName}`,
        statusMessage: "UNREAD",
      })
    );

    SubmitMessages(inputsMessage);
  }, [dataSubscription]);

  useEffect(() => {
    getMessage({
      variables: {
        or: [
          {
            statusMessage: "UNREAD",
            createdBy: {
              role: "ADMINFACTORY",
            },
          },
        ],
      },
    });
  }, []);

  const {
    data: status,
    loading: statusLoad,
    refetch: statusRef,
  } = useQuery(GETNEWREQ);

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState(false);

  useEffect(() => {
    status?.requestHypervisors?.length > 0 ? setInfo(true) : setInfo(false);
  }, [status]);

  console.log(mesLength);

  return AuthStore?.user && AuthStore?.user?.role === "ADMINFACTORY" ? (
    <>
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={10000}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="info"
          sx={{
            width: "100%",
            bgcolor: "#EEB628",
            color: "white",
            fontWeight: 900,
          }}
        >
          New Hypervisor Request Appear
        </Alert>
      </Snackbar>

      <Snackbar
        open={info}
        onClose={() => setInfo(false)}
        style={{ cursor: "pointer" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClick={() => {
            navigate("/request/newReq");
            setInfo(false);
          }}
          severity="info"
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            backgroundColor: "#0F3460",
            color: "white",
            fontWeight: 900,
          }}
        >
          Hypervisor Request Need To Be Finished <br />
          Click Here To Redirect
        </Alert>
      </Snackbar>
      <div
        style={{
          display: "flex",
          height: "100vh",
        }}
      >
        {/* Sidebar Start */}
        <div style={{ height: "100%" }}>
          <Sidebar />
        </div>
        {/* Sidebar End */}

        <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
          {/* Navbar Start */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              boxShadow: "0px 0px 5px 0px gray",
              justifyContent: "flex-end",
              height: "3.75rem",
              width: "100%",
            }}
          >
            {/* User Start */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div>
                <img
                  src={
                    AuthStore?.user?.avatar !== null
                      ? AuthStore.user.avatar
                      : "https://png.pngtree.com/png-vector/20200614/ourlarge/pngtree-businessman-user-avatar-character-vector-illustration-png-image_2242909.jpg"
                  }
                  alt=""
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    objectFit: "cover",
                    objectPosition: "middle",
                    borderRadius: "2rem",
                  }}
                />
              </div>
              <div
                style={{
                  marginLeft: 10,
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: "Bold",
                  }}
                >
                  {AuthStore.user.lastName
                    ? `${AuthStore.user.firstName} ${AuthStore.user.lastName}`
                    : AuthStore.user.firstName}
                </p>
                <p style={{ marginTop: 1, fontSize: 10 }}>Super Admin</p>
              </div>
            </div>
            {/* User End */}

            <Divider
              orientation="vertical"
              flexItem
              sx={{ marginLeft: 5, marginRight: 3 }}
            />

            {/* Notification Start */}
            <div style={{ position: "relative" }}>
              {mesLength > 0 ? (
                <p
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "50%",
                    height: "1.25rem",
                    width: "1.25rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "0.65rem",
                    fontWeight: 900,
                    position: "absolute",
                    top: -10,
                    right: -5,
                  }}
                >
                  {mesLength > 9 ? (
                    <div>
                      9<sup>+</sup>
                    </div>
                  ) : (
                    mesLength
                  )}
                </p>
              ) : null}
              <PopUpNotif
                updateNotif={dataSubscription}
                del={() => {
                  refetchs();
                  subscriptionRefetch();
                }}
              />
            </div>
            {/* Notification End */}

            <Divider orientation="vertical" flexItem sx={{ marginX: 3 }} />

            {/* Setting Start */}
            <div
              onClick={() => setSetting((prev) => !prev)}
              style={{ cursor: "pointer" }}
            >
              <FiSettings style={{ fontSize: 28, paddingRight: 20 }} />
            </div>
            {/* Setting End */}
          </div>
          {/* Navbar End */}

          {/* container for content */}
          <div
            style={{
              width: "auto",
              height: "93%",
              overflow: "auto",
              boxSizing: "border-box",
            }}
          >
            <Outlet />
            {AuthStore.loadingCron ? (
              <Grow in={AuthStore.loadingCron}>
                <Alert
                  severity="info"
                  variant="filled"
                  iconMapping={{
                    info: (
                      <CircularProgress size="1.5rem" sx={{ color: "white" }} />
                    ),
                  }}
                  className={classes.loadingAlert}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "auto",
                    position: "absolute",
                    right: 40,
                    top: 90,
                    color: "white",
                    fontSize: "1rem",
                    fontWeight: 900,
                    zIndex: 50,
                    backgroundColor: "black",
                  }}
                >
                  Please wait updating data
                </Alert>
              </Grow>
            ) : null}

            {AuthStore.loadingSuccess ? (
              <Grow in={AuthStore.loadingSuccess}>
                <Alert
                  severity="success"
                  variant="filled"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "auto",
                    position: "absolute",
                    right: 40,
                    top: 90,
                    color: "white",
                    fontSize: "1rem",
                    fontWeight: 900,
                    zIndex: 50,
                  }}
                >
                  Update Data Complete
                </Alert>
              </Grow>
            ) : null}

            {AuthStore.errorConsole ? (
              <Grow in={AuthStore.errorConsole}>
                <Alert
                  severity="error"
                  variant="filled"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "auto",
                    position: "absolute",
                    right: 40,
                    top: 90,
                    color: "white",
                    fontSize: "1rem",
                    fontWeight: 900,
                    zIndex: 50,
                  }}
                >
                  {AuthStore.errorMessage}
                </Alert>
              </Grow>
            ) : null}

            {setting ? (
              <Snackbar
                open={setting}
                onClose={() => setSetting(false)}
                style={{ cursor: "pointer", width: "15rem" }}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    zIndex: 50,
                    display: "flex",
                    alignItems: "center",
                    position: "absolute",
                    top: 45,
                    fontSize: "1rem",
                    fontWeight: 900,
                  }}
                >
                  <div>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: 2,
                        cursor: "pointer",
                        ":hover": {
                          bgcolor: "#eeeeee",
                        },
                      }}
                      onClick={() => {
                        navigate("/editProfile");
                        setSetting(false);
                      }}
                    >
                      <CgProfile style={{ fontSize: 35, marginRight: 10 }} />
                      <p>Profile Setting</p>
                    </Box>
                  </div>
                </Paper>
              </Snackbar>
            ) : null}
          </div>
        </div>
      </div>
    </>
  ) : (
    <Outlet />
  );
};

export default DashboardLayout;
