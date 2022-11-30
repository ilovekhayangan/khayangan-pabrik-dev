import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import { Formik, Form, Field, useField } from "formik";
import * as Yup from "yup";

import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import oval from "@assets/ovals.svg";
import ovals from "@assets/ovalss.svg";
import LoadingBar from "@components/atoms/LoadingBar";

import { UPDATE_BAREMETAL } from "@utils/gql/instance/constant";
import { useMutation } from "@apollo/client";

function createData(
  hostname,
  ramTotal,
  vcpusTotal,
  storageType,
  localStorageTotal
) {
  return {
    hostname,
    ramTotal,
    vcpusTotal,
    storageType,
    localStorageTotal,
  };
}

function Row(props) {
  const {
    row,
    index,
    rowDatas,
    totalMemory,
    totalCPU,
    totalStorage,
    data,
    refresh,
    close,
  } = props;
  const [open, setOpen] = React.useState(false);

  const simplify = (value) => {
    if (value <= 1000) {
      return `${value} GB`;
    } else {
      return `${(value / 1000).toFixed(2)} TB`;
    }
  };
  const CreateHypervisorSchema = Yup.object().shape({
    name: Yup.string().required(`Domain is required`),
  });

  const [shows, setShows] = React.useState(null);
  const [monitor, setMonitor] = React.useState(null);

  const addDomain = (id, hostname, domain) => {
    let modal = (
      <div
        style={{
          position: "absolute",
          backgroundColor: "white",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "35rem",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          borderRadius: 5,
        }}
      >
        <div style={{ boxSizing: "border-box", padding: "1rem" }}>
          <h2>Add domain for {hostname}</h2>
          <Formik
            initialValues={{
              name: domain || "",
            }}
            validationSchema={CreateHypervisorSchema}
            onSubmit={async (values) => {
              addBaremetal({
                variables: {
                  id,
                  input: { domain: values.name },
                },
              });
              setShows(null);
              refresh();
              close();
            }}
          >
            {({ errors, touched, values }) => (
              <Form>
                <div style={{ width: "100%" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      value={values.name}
                      placeholder="Insert domain"
                      style={{
                        height: "2.5rem",
                        margin: "0.75rem 0 0 0",
                        boxSizing: "border-box",
                        padding: "1rem 0.5rem",
                        border: "solid 1px black",
                        borderRadius: 5,
                      }}
                    />
                    {errors.name && touched.name ? (
                      <Typography
                        sx={{
                          color: "red",
                          fontSize: "0.75rem",
                        }}
                      >
                        {errors.name}
                      </Typography>
                    ) : null}
                  </div>
                </div>
                <div
                  style={{ width: "100%", display: "flex", marginTop: "1rem" }}
                >
                  <button
                    onClick={() => setShows(null)}
                    style={{
                      width: "50%",
                      border: "none",
                      backgroundColor: "red",
                      color: "white",
                      fontSize: "1rem",
                      fontWeight: 900,
                      padding: "0.5rem 0",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      width: "50%",
                      border: "none",
                      backgroundColor: "black",
                      color: "white",
                      fontSize: "1rem",
                      fontWeight: 900,
                      padding: "0.5rem 0",
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );

    setShows(modal);
  };

  const addModal = (id, hostname, domain) => {
    let modal = (
      <div
        style={{
          position: "absolute",
          backgroundColor: "white",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "35rem",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          borderRadius: 5,
        }}
      >
        <div style={{ boxSizing: "border-box", padding: "1rem" }}>
          <h2>Add domain monitoring for {hostname}</h2>
          <Formik
            initialValues={{
              name: domain || "",
            }}
            validationSchema={CreateHypervisorSchema}
            onSubmit={async (values) => {
              addBaremetal({
                variables: {
                  id,
                  input: { domainMonitoring: values.name },
                },
              });
              setMonitor(null);
              refresh();
              close();
            }}
          >
            {({ errors, touched, values }) => (
              <Form>
                <div style={{ width: "100%" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      value={values.name}
                      placeholder="Insert domain"
                      style={{
                        height: "2.5rem",
                        margin: "0.75rem 0 0 0",
                        boxSizing: "border-box",
                        padding: "1rem 0.5rem",
                        border: "solid 1px black",
                        borderRadius: 5,
                      }}
                    />
                    {errors.name && touched.name ? (
                      <Typography
                        sx={{
                          color: "red",
                          fontSize: "0.75rem",
                        }}
                      >
                        {errors.name}
                      </Typography>
                    ) : null}
                  </div>
                </div>
                <div
                  style={{ width: "100%", display: "flex", marginTop: "1rem" }}
                >
                  <button
                    onClick={() => setMonitor(null)}
                    style={{
                      width: "50%",
                      border: "none",
                      backgroundColor: "red",
                      color: "white",
                      fontSize: "1rem",
                      fontWeight: 900,
                      padding: "0.5rem 0",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      width: "50%",
                      border: "none",
                      backgroundColor: "black",
                      color: "white",
                      fontSize: "1rem",
                      fontWeight: 900,
                      padding: "0.5rem 0",
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );

    setMonitor(modal);
  };

  const [addBaremetal, { data: bmData }] = useMutation(UPDATE_BAREMETAL);
  const [load, setLoad] = React.useState(false);

  return (
    <React.Fragment>
      {shows ? shows : null}
      {monitor ? monitor : null}

      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
        }}
      >
        <TableCell
          sx={{
            fontWeight: "bold",
            boxSizing: "border-box",
          }}
        >
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{
            fontWeight: "bold",
          }}
        >
          {row.hostname.slice(0, 8)}
        </TableCell>
        <TableCell
          align="left"
          sx={{
            fontWeight: "bold",
          }}
        >
          {simplify(totalMemory[index])}
        </TableCell>
        <TableCell
          align="left"
          sx={{
            fontWeight: "bold",
          }}
        >
          {data?.vendor === "vmware"
            ? `${Math.ceil(totalCPU[index] / 50)} GHz`
            : `${totalCPU[index]} Core`}
        </TableCell>
        {data?.vendor !== "vmware" ? (
          <>
            <TableCell
              align="left"
              sx={{
                fontWeight: "bold",
              }}
            >
              {row.storageType}
            </TableCell>
            <TableCell
              align="left"
              sx={{
                fontWeight: "bold",
              }}
            >
              {simplify(totalStorage[index])}
            </TableCell>
          </>
        ) : null}
      </TableRow>
      <TableRow id="test">
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0, width: "100%" }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                gap: "2%",
                flexWrap: "wrap",
                alignItems: "center",
                padding: "10px 0",
              }}
            >
              {rowDatas[index].map((expand, i) => (
                <Box
                  sx={{
                    width: "32%",
                    boxSizing: "border-box",
                    padding: "5px",
                    bgcolor: "white",
                    borderRadius: 2,
                    boxShadow:
                      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                    marginBottom: "10px",
                    backgroundImage: `url(${ovals})`,
                    backgroundPosition: "50px 80%",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "80rem",
                  }}
                  key={i}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ width: "35%", fontWeight: 900 }}>Name</Box>
                    <Box sx={{ width: "5%", fontWeight: 900 }}>:</Box>
                    <Box sx={{ width: "60%" }}>{expand.hostname}</Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ width: "35%", fontWeight: 900 }}>Memory</Box>
                    <Box sx={{ width: "5%", fontWeight: 900 }}>:</Box>
                    <Box sx={{ width: "60%" }}>{simplify(expand.ramTotal)}</Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ width: "35%", fontWeight: 900 }}>CPU</Box>
                    <Box sx={{ width: "5%", fontWeight: 900 }}>:</Box>
                    <Box sx={{ width: "60%" }}>
                      {data.vendor === "vmware"
                        ? `${Math.ceil(expand.vcpusTotal / 50)} GHz`
                        : `${expand.vcpusTotal} Core`}
                    </Box>
                  </Box>
                  {data.vendor !== "vmware" ? (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box sx={{ width: "35%", fontWeight: 900 }}>
                          Storage
                        </Box>
                        <Box sx={{ width: "5%", fontWeight: 900 }}>:</Box>
                        <Box sx={{ width: "60%" }}>
                          {simplify(expand.localStorageTotal)}
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box sx={{ width: "35%", fontWeight: 900 }}>
                          Storage Type
                        </Box>
                        <Box sx={{ width: "5%", fontWeight: 900 }}>:</Box>
                        <Box sx={{ width: "60%" }}>{expand.storageType}</Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box sx={{ width: "35%", fontWeight: 900 }}>State</Box>
                        <Box sx={{ width: "5%", fontWeight: 900 }}>:</Box>
                        <Box sx={{ width: "60%" }}>
                          {expand.state.toUpperCase()}
                        </Box>
                      </Box>
                      {/* <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box sx={{ width: "35%", fontWeight: 900 }}>
                          Domain Monitoring
                        </Box>
                        <Box sx={{ width: "5%", fontWeight: 900 }}>:</Box>
                        <Box sx={{ width: "60%" }}>
                          {expand.domainMonitoring ? (
                            <div style={{ display: "flex", gap: 5 }}>
                              {expand.domainMonitoring}{" "}
                              <DriveFileRenameOutlineIcon
                                onClick={() =>
                                  addModal(
                                    expand.id,
                                    expand.hostname,
                                    expand.domainMonitoring
                                  )
                                }
                                style={{ cursor: "pointer" }}
                              />
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                addModal(expand.id, expand.hostname)
                              }
                              style={{
                                border: "none",
                                padding: "3px 7px",
                                borderRadius: 5,
                                backgroundColor: "black",
                                color: "white",
                                cursor: "pointer",
                              }}
                            >
                              Add
                            </button>
                          )}
                        </Box>
                      </Box> */}
                    </>
                  ) : null}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ width: "35%", fontWeight: 900 }}>Domain</Box>
                    <Box sx={{ width: "5%", fontWeight: 900 }}>:</Box>
                    <Box sx={{ width: "60%" }}>
                      {expand.domain ? (
                        <div style={{ display: "flex", gap: 5 }}>
                          {expand.domain}{" "}
                          <DriveFileRenameOutlineIcon
                            onClick={() =>
                              addDomain(
                                expand.id,
                                expand.hostname,
                                expand.domain
                              )
                            }
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => addDomain(expand.id, expand.hostname)}
                          style={{
                            border: "none",
                            padding: "3px 7px",
                            borderRadius: 5,
                            backgroundColor: "black",
                            color: "white",
                            cursor: "pointer",
                          }}
                        >
                          Add
                        </button>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    hostname: PropTypes.string.isRequired,
    ramTotal: PropTypes.number.isRequired,
    vcpusTotal: PropTypes.number.isRequired,
    storageType: PropTypes.string,
    localStorageTotal: PropTypes.number.isRequired,
  }).isRequired,
};

export default function CollapsibleTable({
  baremetals,
  rowData,
  refresh,
  close,
}) {
  const [rows, setRows] = React.useState([]);
  const [totalMemory, setTotalMemory] = React.useState([]);
  const [totalCPU, setTotalCPU] = React.useState([]);
  const [totalStorage, setTotalStorage] = React.useState([]);
  React.useEffect(() => {
    setRows([]);
    setTotalMemory([]);
    setTotalCPU([]);
    setTotalStorage([]);
    baremetals.map((baremetal) => {
      const sum = function (items, prop) {
        return items.reduce(function (a, b) {
          return a + b[prop];
        }, 0);
      };

      let _totalMemory = sum(baremetal, "ramTotal");
      setTotalMemory((old) => [...old, _totalMemory]);

      let _totalCPU = sum(baremetal, "vcpusTotal");
      setTotalCPU((old) => [...old, _totalCPU]);

      let _totalStorage = sum(baremetal, "localStorageTotal");
      setTotalStorage((old) => [...old, _totalStorage]);

      return setRows((old) => [
        ...old,
        createData(
          baremetal[0].hostname,
          baremetal[0].ramTotal,
          baremetal[0].vcpusTotal,
          baremetal[0].storageType,
          baremetal[0].localStorageTotal
        ),
      ]);
    });
  }, []);

  return (
    <TableContainer
      component={Paper}
      style={{
        background: "#FDF7E9",
        borderRadius: 8,
        backgroundImage: `url(${oval})`,
        backgroundPosition: "150px 60%",
        backgroundRepeat: "no-repeat",
        backgroundSize: "300rem",
      }}
    >
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>No</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
            <TableCell align="left" style={{ fontWeight: "bold" }}>
              Memory
            </TableCell>
            <TableCell align="left" style={{ fontWeight: "bold" }}>
              CPU
            </TableCell>
            {rowData.vendor !== "vmware" ? (
              <>
                <TableCell align="left" style={{ fontWeight: "bold" }}>
                  Storage Type
                </TableCell>
                <TableCell align="left" style={{ fontWeight: "bold" }}>
                  Storage
                </TableCell>
              </>
            ) : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <Row
              key={i}
              row={row}
              index={i}
              rowDatas={baremetals}
              totalMemory={totalMemory}
              totalCPU={totalCPU}
              totalStorage={totalStorage}
              data={rowData}
              refresh={refresh}
              close={close}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
