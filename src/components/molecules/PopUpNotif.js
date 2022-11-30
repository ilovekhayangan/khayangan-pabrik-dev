import * as React from "react";
import { Backdrop, Box, Modal, Fade, Typography } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import dateFormat, { masks } from "dateformat";
import { IoNotificationsOutline } from "react-icons/io5";
import { HiDotsHorizontal } from "react-icons/hi";
import { AiTwotoneDelete } from "react-icons/ai";
import { useMutation, useQuery } from "@apollo/client";
import {
  DELETE_ALL_MESSAGE,
  DELETE_MESSAGE,
  GET_MESSAGES,
  UPDATE_MESSAGE,
} from "@utils/gql/subscription/constant";
import { useNavigate } from "react-router-dom";
import notif from "@assets/notif.svg";

const style = {
  position: "absolute",
  top: 52.5,
  right: 0,
  width: 360,
  bgcolor: "#fff",
  border: "1px solid gray",
  boxShadow: 24,
  boxSizing: "border-box",
  p: "1rem 0 0",
  outline: "none",
};

export default function PopUpNotif({ updateNotif, del }) {
  const [open, setOpen] = React.useState(false);
  const [deleteAllMessage, setDeleteAllMessage] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const menus = {
    padding: "0.25rem 1rem",
    cursor: "pointer",
    color: "black",
    backgroundColor: "none",
  };

  const { data, refetch, loading } = useQuery(GET_MESSAGES, {
    variables: {
      or: [
        {
          createdBy: {
            role: "ADMINFACTORY",
          },
        },
      ],
    },
  });

  const [updateMessage, { loading: loadingUpdate }] =
    useMutation(UPDATE_MESSAGE);

  const [deleteMessage, { loading: loadingDelete }] =
    useMutation(DELETE_MESSAGE);

  const [deleteAll, { loading: deleteAllLoading }] =
    useMutation(DELETE_ALL_MESSAGE);

  const unreadMessages = data?.messages?.filter(
    (item) => item.statusMessage == "UNREAD"
  );

  const idMessage = data?.messages?.map((item) => ({
    ["id"]: item.id,
    input: {
      statusMessage: "READ",
    },
  }));

  let getAllId = [];

  let navigate = useNavigate();

  const handleUpdate = async (id) => {
    await updateMessage({
      variables: {
        inputs: {
          id,
          input: {
            statusMessage: "READ",
          },
        },
      },
    });
    navigate("/request/newReq");
    refetch();
    del();
  };

  const handleUpdateAll = async () => {
    await updateMessage({
      variables: {
        inputs: idMessage,
      },
    });
    setMenu(false);
    refetch();
    del();
  };

  const handleDelete = async (id) => {
    await deleteMessage({
      variables: {
        id,
      },
    });
    refetch();
    del();
  };

  const handleDeleteAll = async () => {
    await deleteAll({
      variables: {
        ids: getAllId,
      },
    });
    setMenu(false);
    refetch();
    del();
  };

  React.useEffect(() => {
    refetch();
  }, [updateNotif]);

  if (!loading) {
    for (let i = 1; i <= data.messages.length; i++) {
      getAllId.push(data.messages[i - 1].id);
    }
  }

  const [value, setValue] = React.useState({
    all: true,
    unread: false,
  });

  const [menu, setMenu] = React.useState(false);

  return (
    <div style={{ cursor: "pointer", position: "relative" }}>
      <IoNotificationsOutline
        fontSize={28}
        onClick={() => {
          handleOpen();
          refetch();
        }}
      />

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Box
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                boxSizing: "border-box",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                id="transition-modal-title"
                sx={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                }}
              >
                Notifications
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <HiDotsHorizontal
                  size={23}
                  style={{ cursor: "pointer" }}
                  onClick={() => setMenu(true)}
                />
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  onClick={() => setOpen(!open)}
                >
                  x
                </Typography>
                {menu ? (
                  <div
                    style={{
                      position: "absolute",
                      top: 60,
                      right: 15,
                      backgroundColor: "lightgray",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 5,
                    }}
                  >
                    <p
                      style={{
                        position: "absolute",
                        top: -10,
                        left: -10,
                        backgroundColor: "red",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "1.25rem",
                        width: "1.25rem",
                        borderRadius: "50%",
                        color: "white",
                        margin: 0,
                        padding: 0,
                        cursor: "pointer",
                      }}
                      onClick={() => setMenu(false)}
                    >
                      x
                    </p>
                    <p style={menus} onClick={handleUpdateAll}>
                      Read All
                    </p>
                    <p style={menus} onClick={handleDeleteAll}>
                      Delete All
                    </p>
                  </div>
                ) : null}
              </Box>
            </Box>

            <Box
              style={{
                width: "100%",
                padding: "0.75rem 1rem 0.25rem 1rem",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                gap: 25,
                marginBottom: 5,
              }}
            >
              <Typography
                sx={{
                  width: "4rem",
                  textAlign: "center",
                  fontWeight: 900,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  padding: "3px 5px",
                  backgroundColor: value.all ? "#EEB628" : "lightgrey",
                  color: value.all ? "white" : "black",
                  borderRadius: 5,
                }}
                onClick={() => {
                  setValue({
                    all: true,
                    unread: false,
                  });
                  refetch();
                }}
              >
                All
              </Typography>
              <Typography
                sx={{
                  width: "4rem",
                  textAlign: "center",
                  fontWeight: 900,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  padding: "3px 5px",
                  backgroundColor: value.unread ? "#EEB628" : "lightgrey",
                  color: value.unread ? "white" : "black",
                  borderRadius: 5,
                }}
                onClick={() => {
                  setValue({
                    all: false,
                    unread: true,
                  });
                  refetch();
                }}
              >
                Unread
              </Typography>
            </Box>

            {value.all ? (
              <div
                style={{
                  maxHeight: "50vh",
                  overflowY: "auto",
                }}
              >
                {/* unread notif card */}
                {data?.messages?.length !== 0 ? (
                  <>
                    {data?.messages?.map((item, index) => (
                      <>
                        {item.statusMessage === "READ" ? (
                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              backgroundColor: "#E0E0E0",
                              boxSizing: "border-box",
                              padding: "0.5rem 0.8rem",
                              gap: 2,
                              cursor: "pointer",
                              borderBottom: "1px solid #cccccc",
                            }}
                            key={index}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                alignItems: "flex-start",
                              }}
                              onClick={() => {
                                handleUpdate(item.id);
                              }}
                            >
                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: "0.8rem",
                                    color: "#7C7C7C",
                                  }}
                                >
                                  {`${item.name} ${item.description}`}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "0.8rem",
                                    color: "#7C7C7C",
                                  }}
                                >
                                  {dateFormat(
                                    item.createdAt,
                                    "yyyy-mm-dd HH:MM"
                                  )}
                                </Typography>
                              </Box>
                            </Box>
                            <AiTwotoneDelete
                              size={30}
                              color="#7C7C7C"
                              onClick={() => handleDelete(item.id)}
                            />
                          </div>
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              backgroundColor: "#fff",
                              boxSizing: "border-box",
                              padding: "0.5rem 0.8rem",
                              gap: 2,
                              cursor: "pointer",
                              borderBottom: "1px solid #cccccc",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                alignItems: "flex-start",
                              }}
                              onClick={() => handleUpdate(item.id)}
                            >
                              <FiberManualRecordIcon
                                fontSize="1"
                                sx={{
                                  fontWeight: 100,
                                  color: "#7C7C7C",
                                }}
                              />
                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: "0.8rem",
                                    color: "#7C7C7C",
                                  }}
                                >
                                  {`${item.name} ${item.description}`}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "0.8rem",
                                    color: "#7C7C7C",
                                  }}
                                >
                                  {dateFormat(
                                    item.createdAt,
                                    "yyyy-mm-dd HH:MM"
                                  )}
                                </Typography>
                              </Box>
                            </Box>
                            <AiTwotoneDelete
                              size={30}
                              color="#7C7C7C"
                              onClick={() => handleDelete(item.id)}
                            />
                          </div>
                        )}
                      </>
                    ))}
                  </>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 5,
                      padding: "1rem 0",
                    }}
                  >
                    <img src={notif} alt={notif} style={{ width: "50%" }} />
                    <p
                      style={{
                        color: "#EEB628",
                        fontSize: "1.25rem",
                        fontWeight: 900,
                      }}
                    >
                      No Notification Found
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  maxHeight: "50vh",
                  overflowY: "auto",
                }}
              >
                {/* unread notif card */}
                {unreadMessages?.length !== 0 ? (
                  <>
                    {unreadMessages?.map((item, index) => (
                      <>
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: "#fff",
                            boxSizing: "border-box",
                            padding: "0.5rem 0.8rem",
                            gap: 2,
                            cursor: "pointer",
                            borderBottom: "1px solid #cccccc",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "flex-start",
                            }}
                            onClick={() => {
                              handleUpdate(item.id);
                            }}
                          >
                            <FiberManualRecordIcon
                              fontSize="1"
                              sx={{
                                fontWeight: 100,
                                color: "#7C7C7C",
                              }}
                            />
                            <Box>
                              <Typography
                                sx={{
                                  fontSize: "0.8rem",
                                  color: "#7C7C7C",
                                }}
                              >
                                {`${item.name} ${item.description}`}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: "0.8rem",
                                  color: "#7C7C7C",
                                }}
                              >
                                {dateFormat(item.createdAt, "yyyy-mm-dd HH:MM")}
                              </Typography>
                            </Box>
                          </Box>
                          <AiTwotoneDelete
                            size={30}
                            color="#7C7C7C"
                            onClick={() => handleDelete(item.id)}
                          />
                        </div>
                      </>
                    ))}
                  </>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 5,
                      padding: "1rem 0",
                    }}
                  >
                    <img src={notif} alt={notif} style={{ width: "50%" }} />
                    <p
                      style={{
                        color: "#EEB628",
                        fontSize: "1.25rem",
                        fontWeight: 900,
                      }}
                    >
                      No Notification Found
                    </p>
                  </div>
                )}
              </div>
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
