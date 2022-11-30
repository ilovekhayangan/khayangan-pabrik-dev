import { Box, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

import { gql, useMutation, useQuery } from "@apollo/client";
import { UPDATE_HYPERVISOR } from "@utils/gql/hypervisor/constant";
import { GET_REGIONS } from "@utils/gql/region/constant";

import { Formik, Form, Field, useField } from "formik";
import * as Yup from "yup";

import Buttons from "@components/atoms/Buttons";

import cssModules from "@assets/style/CreateHypervisor.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

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

export default function EditHypervisorCard({ close, title, data }) {
  console.log(data);
  const CreateHypervisorSchema = Yup.object().shape({
    name: Yup.string().required(`Name is required`),
    regionId: Yup.string().required(`Region is required`),
    zoneId: Yup.string().required(`Zone is required`),
    cpu: Yup.number().required(`CPU is required`),
    memory: Yup.number().required(`Memory is required`),
    storage: Yup.number().required(`Storage is required`),
    endpoint: Yup.string().required(`Endpoint is required`),
  });

  const [mutationAddData, addData] = useMutation(UPDATE_HYPERVISOR);
  const [showPassword, setShowPassword] = useState(false);

  const { data: getRegionsData } = useQuery(GET_REGIONS);

  const GET_SPECIFIC = gql`
    query {
      zones {
        id
        name
        region {
          id
        }
      }
    }
  `;
  const { data: getSpecificZone } = useQuery(GET_SPECIFIC);
  const auth = JSON.parse(data.auth.replace(/'/g, `"`));

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
          width: "50rem",
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
              name: data.name,
              regionId: data?.region?.id,
              zoneId: data?.zone?.id,
              cpu: data.cpu,
              memory: data.memory,
              storage: data.storage,
              endpoint: data.endpoint,
              endpointMonitoring: data?.endpointMonitoring,
              domainPrometheus: data?.domainPrometheus,
              port: data?.vendor === "vmware" ? auth.port : 0,
              username:
                data.vendor === "openstack"
                  ? auth.auth.identity.password.user.name
                  : auth.user,
              password:
                data.vendor === "openstack"
                  ? auth.auth.identity.password.user.password
                  : auth.pwd,
            }}
            validationSchema={CreateHypervisorSchema}
            onSubmit={async (values) => {
              await mutationAddData({
                variables: {
                  id: data?.id,
                  input: {
                    name: values.name,
                    regionId: values.regionId,
                    zoneId: values.zoneId,
                    cpu: values.cpu,
                    memory: values.memory,
                    storage: values.storage,
                    endpoint: values.endpoint,
                    endpointMonitoring: values.endpointMonitoring,
                    domainPrometheus: values.domainPrometheus,
                    auth:
                      data.vendor === "openstack"
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
                  },
                },
              });
              close();
            }}
          >
            {({ errors, touched, values }) => (
              <Form className={cssModules.form}>
                <div style={{ width: "48%" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label className={cssModules.label} htmlFor="name">
                      Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      placeholder="e.g. Indonesia"
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

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label className={cssModules.label} htmlFor="regionId">
                      Region
                    </label>
                    <Field
                      className={cssModules.input}
                      as="select"
                      name="regionId"
                    >
                      <option
                        className={cssModules.select}
                        style={{ color: "gray" }}
                      >
                        Please, Select Region.{" "}
                      </option>
                      {getRegionsData?.regions?.map((item) => (
                        <option
                          className={cssModules.select}
                          value={item?.id}
                          key={item?.id}
                        >
                          {item.name}
                        </option>
                      ))}
                    </Field>

                    {errors.regionId && touched.regionId ? (
                      <Typography
                        sx={{
                          color: "red",
                          fontSize: "0.75rem",
                        }}
                      >
                        {errors.regionId}
                      </Typography>
                    ) : null}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label className={cssModules.label} htmlFor="zoneId">
                      Zone
                    </label>
                    <Field
                      className={cssModules.input}
                      as="select"
                      name="zoneId"
                    >
                      <option
                        className={cssModules.select}
                        style={{ color: "gray" }}
                      >
                        Please, Select Zone.{" "}
                      </option>
                      {getSpecificZone?.zones?.map((item) => (
                        <>
                          {item?.region?.id === values.regionId ? (
                            <option
                              className={cssModules.select}
                              value={item?.id}
                              key={item?.id}
                            >
                              {item.name}
                            </option>
                          ) : null}
                        </>
                      ))}
                    </Field>

                    {errors.zoneId && touched.zoneId ? (
                      <Typography
                        sx={{
                          color: "red",
                          fontSize: "0.75rem",
                        }}
                      >
                        {errors.zoneId}
                      </Typography>
                    ) : null}
                  </div>
                </div>

                <div style={{ width: "48%" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label className={cssModules.label} htmlFor="cpu">
                      CPU {data.vendor === "vmware" ? "(Ghz)" : "(Core)"}
                    </label>
                    <Field
                      type="number"
                      name="cpu"
                      id="cpu"
                      placeholder="e.g. 100"
                      className={cssModules.input}
                    />
                    {errors.cpu && touched.cpu ? (
                      <Typography
                        sx={{
                          color: "red",
                          fontSize: "0.75rem",
                        }}
                      >
                        {errors.cpu}
                      </Typography>
                    ) : null}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label className={cssModules.label} htmlFor="memory">
                      Memory (GB)
                    </label>
                    <Field
                      type="number"
                      name="memory"
                      id="memory"
                      placeholder="e.g. 100"
                      className={cssModules.input}
                    />
                    {errors.memory && touched.memory ? (
                      <Typography
                        sx={{
                          color: "red",
                          fontSize: "0.75rem",
                        }}
                      >
                        {errors.memory}
                      </Typography>
                    ) : null}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label className={cssModules.label} htmlFor="storage">
                      Storage (GB)
                    </label>
                    <Field
                      type="number"
                      name="storage"
                      id="storage"
                      placeholder="e.g. 100"
                      className={cssModules.input}
                    />
                    {errors.storage && touched.storage ? (
                      <Typography
                        sx={{
                          color: "red",
                          fontSize: "0.75rem",
                        }}
                      >
                        {errors.storage}
                      </Typography>
                    ) : null}
                  </div>
                </div>

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

                {data.vendor === "openstack" ? (
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
                ) : (
                  <>
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

                {/* <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <MyTextArea
                    label="Description"
                    name="description"
                    id="description"
                    rows="4"
                    placeholder="e.g. Located in Surabaya, has 5 Racks, etc."
                  />
                </div> */}

                <Buttons
                  className={cssModules.btnSave}
                  title="Update"
                  variant="contained"
                  bg="#EAB737"
                  color="white"
                  width="100%"
                  height="2.75rem"
                  fWeight={200}
                  fSize={18}
                  radius="2px"
                />
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </>
  );
}
