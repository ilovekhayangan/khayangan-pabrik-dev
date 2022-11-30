import { Box, Button, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { gql, useMutation, useQuery } from "@apollo/client";
import { CREATE_HYPERVISOR } from "@utils/gql/hypervisor/constant";

import { Formik, Form, Field, useField } from "formik";
import * as Yup from "yup";

import Buttons from "@components/atoms/Buttons";
import useRegionHook from "@hooks/useRegionHook";

import cssModules from "@assets/style/CreateHypervisor.module.css";
import { useState, useEffect } from "react";
import openstack from "@assets/openstack2.png";
import vmware from "@assets/vmware2.png";
import {
  CREATE_HYPERVISOR_FROM_REQ_OPENSTACK,
  GET_REQUEST_HYPERVISOR,
  CREATE_NEW_BAREMETAL,
  GET_REQ_OPENSTACK,
  UPDATE_REQUEST_HYPERVISOR,
  UPDATE_STATUS_HYPERVISOR_FROM_REQ_OPENSTACK,
  CREATE_NEW_IMAGE,
} from "@utils/gql/reqOpenstack/constant";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  setLoadingCron,
  setLoadingSuccess,
} from "@redux/features/auth/authSlice";

const MyTextArea = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label className={cssModules.label} htmlFor={props.id || props.name}>
        {label}
      </label>
      <textarea className={cssModules.textArea} {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

export default function CreateHypervisorCard({ close, title, hypervisorData }) {
  const CreateHypervisorSchema = Yup.object().shape({
    endpoint: Yup.string().required(`Endpoint is required`),
    username: Yup.string().required(`Username is required`),
    password: Yup.string().required(`Password is required`),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  let baremetalData = [];
  let imageData = [];

  for (let i = 1; i <= hypervisorData.setBaremetals.length; i++) {
    baremetalData.push(hypervisorData.setBaremetals[i - 1]);
  }

  for (let i = 1; i <= hypervisorData.operatingSystems.length; i++) {
    imageData.push(hypervisorData.operatingSystems[i - 1]);
  }

  const [addBaremetal, { data: bmData }] = useMutation(CREATE_NEW_BAREMETAL);
  const [addImage, { data: imgData }] = useMutation(CREATE_NEW_IMAGE);

  const [mutationAddData, { data: addData }, loadingSubmit] = useMutation(
    CREATE_HYPERVISOR_FROM_REQ_OPENSTACK,
    {
      onCompleted: async (data) => {
        const newBaremetal = baremetalData.map((v) => ({
          ...v,
          hypervisorId: data.createHypervisor.id,
          vendor: hypervisorData.vendor.name,
        }));

        newBaremetal.forEach((obj) => {
          delete obj["__typename"];
          delete obj["id"];
        });

        const newImage = imageData.map((v) => ({
          version: v.version,
          hypervisorId: data.createHypervisor.id,
          operatingSystemId: "62f478eb8f6fee00393b4ccb",
        }));

        newImage.forEach((obj) => {
          delete obj["__typename"];
          delete obj["id"];
        });

        setDisableButton(false);

        // await addBaremetal({
        //   variables: {
        //     inputs: newBaremetal,
        //   },
        // });

        // if (hypervisorData.vendor.name === "vmware") {
        //   await addImage({
        //     variables: {
        //       inputs: newImage,
        //     },
        //   });
        // }
      },
    }
  );

  const dispatch = useDispatch();

  const [updateStatus, { loading: updateProjectLoading }] = useMutation(
    UPDATE_REQUEST_HYPERVISOR,
    {
      refetchQueries: [{ query: GET_REQUEST_HYPERVISOR }],
    }
  );

  function getFields(input, field) {
    let output = [];
    for (let i = 0; i < input.length; ++i) output.push(input[i][field]);
    return output;
  }

  const result = getFields(hypervisorData.setBaremetals, "id");

  const token = window.localStorage.getItem("factory-token");

  // function sleep(num) {
  //   let now = new Date();
  //   let stop = now.getTime() + num;
  //   while (true) {
  //     now = new Date();
  //     if (now.getTime() > stop) return;
  //   }
  // }

  const updateCron = async () => {
    let URL_MICROGEN =
      "https://proxy-cors.carakan.id/https://dev-khayanganjxhpv.microgen.id";
    dispatch(
      setLoadingCron({
        data: true,
      })
    );
    try {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_OPENSTACK}/os-cron`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        if (response.status === 200) {
          dispatch(
            setLoadingCron({
              data: false,
            })
          );
          dispatch(
            setLoadingSuccess({
              data: true,
            })
          );
          setTimeout(() => {
            dispatch(
              setLoadingSuccess({
                data: false,
              })
            );
            window.location.reload(true);
          }, 3000);
        }
      } catch (err) {
        console.log("os-cron", err);
        dispatch(
          setLoadingCron({
            data: false,
          })
        );
        dispatch(
          setLoadingSuccess({
            data: true,
          })
        );
        setTimeout(() => {
          dispatch(
            setLoadingSuccess({
              data: false,
            })
          );
          window.location.reload(true);
        }, 3000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateCronVmware = async () => {
    dispatch(
      setLoadingCron({
        data: true,
      })
    );
    try {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_FUNCTION}/vmwre-upsertbaremtal`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          console.log(response);
        }
      } catch (err) {
        console.log(err);
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_FUNCTION}/vmware-upsertimage`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          console.log(response);
        }
      } catch (err) {
        console.log(err);
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_FUNCTION}/vmware-instancepbrik`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        if (response.status === 200) {
          dispatch(
            setLoadingCron({
              data: false,
            })
          );

          dispatch(
            setLoadingSuccess({
              data: true,
            })
          );

          setTimeout(() => {
            dispatch(
              setLoadingSuccess({
                data: false,
              })
            );
            window.location.reload(true);
          }, 3000);
        }
      } catch (err) {
        console.log(err);
        dispatch(
          setLoadingCron({
            data: false,
          })
        );
        dispatch(
          setLoadingSuccess({
            data: true,
          })
        );
        setTimeout(() => {
          dispatch(
            setLoadingSuccess({
              data: false,
            })
          );
          window.location.reload(true);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const replaceEndpoit = (value) => {
    const except = ["/", "https://", "http://"];
    const expStr = except.join("|");
    const finalValue = value.replace(new RegExp(expStr, "gi"), "");

    return finalValue;
  };

  return (
    <>
      {/* Container */}
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          bgcolor: "#00000050",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 88,
        }}
        onClick={close}
      ></Box>

      {/* Card */}
      <Box
        sx={{
          width: "30rem",
          height: "auto",
          bgcolor: "white",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 150,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #D8D8D8",
            boxSizing: "border-box",
            p: "1rem 1.5rem",
          }}
        >
          <Typography fontSize="1.5rem" style={{ fontWeight: 500 }}>
            {title}
          </Typography>
          <ClearIcon onClick={close} sx={{ cursor: "pointer" }} />
        </Box>

        {/* Form Card */}
        <Box sx={{ boxSizing: "border-box", p: "1rem 1.5rem 1.5rem 1.5rem" }}>
          <Formik
            initialValues={{
              name: hypervisorData.name,
              regionId: hypervisorData.region.id,
              zoneId: hypervisorData.zone.id,
              cpu:
                hypervisorData.selectPackages !== null
                  ? hypervisorData.selectPackages.core
                  : hypervisorData.customCpuCore,
              memory:
                hypervisorData.selectPackages !== null
                  ? hypervisorData.selectPackages.memory
                  : hypervisorData.customMemory,
              storage:
                hypervisorData.selectPackages !== null
                  ? hypervisorData.selectPackages.storage
                  : hypervisorData.customStorageSize,
              vendor: hypervisorData.vendor,
              userIds: hypervisorData.createdBy.id,
              baremetals: result,
              endpoint: "",
              username: "",
              password: "",
              port: 0,
              idProject: "",
              endpointMonitoring: "",
              domainPrometheus: "",
            }}
            validationSchema={CreateHypervisorSchema}
            onSubmit={async (values) => {
              await setDisableButton(true);
              await mutationAddData({
                variables: {
                  input: {
                    name: values.name,
                    regionId: values.regionId,
                    zoneId: values.zoneId,
                    cpu: values.cpu,
                    memory: values.memory,
                    storage: values.storage,
                    endpoint: values.endpoint,
                    vendor: values.vendor,
                    usersIds: values.userIds,
                    baremetalsIds: values.baremetals,
                    auth:
                      values.vendor === "openstack"
                        ? JSON.stringify({
                            auth: {
                              identity: {
                                methods: ["password"],
                                password: {
                                  user: {
                                    name: values.username,
                                    domain: { name: "Default" },
                                    password: values.password,
                                  },
                                },
                              },
                            },
                          })
                        : JSON.stringify({
                            host: replaceEndpoit(values.endpoint),
                            user: values.username,
                            pwd: values.password,
                            port: values.port,
                          }),
                    domainPrometheus: values.domainPrometheus,
                    endpointMonitoring: values.endpointMonitoring,
                  },
                },
              });

              await updateStatus({
                variables: {
                  id: hypervisorData.id,
                  input: {
                    status: "COMPLETE",
                  },
                },
                refetchQueries: [{ query: GET_REQUEST_HYPERVISOR }],
              });
              await close();

              if (values.vendor === "openstack") {
                await updateCron();
              } else {
                await updateCronVmware();
              }
            }}
          >
            {({ errors, touched, values }) => (
              <Form className={cssModules.form}>
                {/* <div style={{ width: "100%" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label className={cssModules.label} htmlFor="name">
                      Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      value={values.name}
                      placeholder="Insert name"
                      className={cssModules.input}
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
                </div> */}

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <label className={cssModules.label} htmlFor="endpoint">
                    Endpoint
                  </label>
                  <Field
                    type="text"
                    name="endpoint"
                    id="endpoint"
                    value={values.endpoint}
                    placeholder="e.g. http://10.10.10.10"
                    className={cssModules.input}
                  />
                  {errors.endpoint && touched.endpoint ? (
                    <Typography
                      sx={{
                        color: "red",
                        fontSize: "0.75rem",
                      }}
                    >
                      {errors.endpoint}
                    </Typography>
                  ) : null}
                </div>

                {hypervisorData.vendor !== "openstack" ? (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <label className={cssModules.label} htmlFor="port">
                      Port
                    </label>
                    <Field
                      type="number"
                      name="port"
                      id="port"
                      value={values.port}
                      placeholder="e.g. 443"
                      className={cssModules.input}
                    />
                    {errors.port && touched.port ? (
                      <Typography
                        sx={{
                          color: "red",
                          fontSize: "0.75rem",
                        }}
                      >
                        {errors.port}
                      </Typography>
                    ) : null}
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <label
                        className={cssModules.label}
                        htmlFor="endpointMonitoring"
                      >
                        Endpoint Monitoring
                      </label>
                      <Field
                        type="text"
                        name="endpointMonitoring"
                        id="endpointMonitoring"
                        value={values.endpointMonitoring}
                        placeholder="e.g. http://10.10.10.10:3000"
                        className={cssModules.input}
                      />
                      {errors.endpointMonitoring &&
                      touched.endpointMonitoring ? (
                        <Typography
                          sx={{
                            color: "red",
                            fontSize: "0.75rem",
                          }}
                        >
                          {errors.endpointMonitoring}
                        </Typography>
                      ) : null}
                    </div>

                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <label
                        className={cssModules.label}
                        htmlFor="domainPrometheus"
                      >
                        Domain Prometheus
                      </label>
                      <Field
                        type="text"
                        name="domainPrometheus"
                        id="domainPrometheus"
                        value={values.domainPrometheus}
                        placeholder="Domain Prometheus"
                        className={cssModules.input}
                      />
                      {errors.domainPrometheus && touched.domainPrometheus ? (
                        <Typography
                          sx={{
                            color: "red",
                            fontSize: "0.75rem",
                          }}
                        >
                          {errors.domainPrometheus}
                        </Typography>
                      ) : null}
                    </div>
                  </>
                )}

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <label className={cssModules.label} htmlFor="username">
                    Username
                  </label>
                  <Field
                    type="text"
                    name="username"
                    id="username"
                    value={values.username}
                    placeholder="Insert Username"
                    className={cssModules.input}
                  />
                  {errors.username && touched.username ? (
                    <Typography
                      sx={{
                        color: "red",
                        fontSize: "0.75rem",
                      }}
                    >
                      {errors.username}
                    </Typography>
                  ) : null}
                </div>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                >
                  <label className={cssModules.label} htmlFor="password">
                    Password
                  </label>
                  <Field
                    type={!showPassword ? "password" : "text"}
                    name="password"
                    id="password"
                    value={values.password}
                    placeholder="Insert Password"
                    className={cssModules.input}
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: 10,
                      top: 45,
                      cursor: "pointer",
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </div>
                  {errors.password && touched.password ? (
                    <Typography
                      sx={{
                        color: "red",
                        fontSize: "0.75rem",
                      }}
                    >
                      {errors.password}
                    </Typography>
                  ) : null}
                </div>

                {/* <Buttons
                  className={cssModules.btnSave}
                  title="Submit"
                  variant="contained"
                  bg="#EAB737"
                  color="white"
                  width="100%"
                  height="2.75rem"
                  fWeight={200}
                  fSize={18}
                  radius="2px"
                  disable={loadingSubmit}
                /> */}
                <Button
                  type="submit"
                  disabled={disableButton}
                  sx={{
                    backgroundColor: "#EAB737",
                    ":hover": {
                      bgcolor: "yellow",
                      color: "black",
                    },
                    width: "100%",
                    height: "2.75rem",
                    border: "none",
                    fontSize: 18,
                    color: "white",
                    fontWeight: 200,
                    marginTop: 2,
                    cursor: "pointer",
                    borderRadius: "2px",
                  }}
                >
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </>
  );
}
