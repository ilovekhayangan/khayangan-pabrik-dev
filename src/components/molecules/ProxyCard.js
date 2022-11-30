import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";

import { Formik, Form, Field, useField } from "formik";
import * as Yup from "yup";

import cssModules from "@assets/style/CreateHypervisor.module.css";
import { useMutation } from "@apollo/client";
import { CREATE_RESERVE_PROXY } from "@utils/gql/reverseProxy/constant";

export default function ProxyCard({ close }) {
  const ProxySchema = Yup.object().shape({
    api: Yup.string().required(`API IP is required`),
    port: Yup.string().required(`Port is required`),
    ip: Yup.string().required(`IP Public is required`),
  });

  const [disableButton, setDisableButton] = useState(false);

  const [addReserveProxy, { data: addData }, loadingSubmit] = useMutation(
    CREATE_RESERVE_PROXY,
    {
      onCompleted: async (data) => {
        setDisableButton(false);
      },
    }
  );

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: 999,
          background: "#00000050",
        }}
        onClick={close}
      ></Box>
      <Box
        sx={{
          width: "40rem",
          display: "flex",
          justifyContent: "space-between",
          boxSizing: "border-box",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
          backgroundColor: "white",
        }}
      >
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Box
            sx={{
              boxSizing: "border-box",
              padding: "1rem",
              fontSize: "1.5rem",
            }}
          >
            Add New IP Public
          </Box>
          <hr />
          <Box sx={{ boxSizing: "border-box", padding: "1rem 1rem 2rem" }}>
            <Formik
              initialValues={{
                api: "",
                port: 0,
                ip: "",
              }}
              validationSchema={ProxySchema}
              onSubmit={async (values) => {
                await setDisableButton(true);

                await addReserveProxy({
                  variables: {
                    input: {
                      ipPublic: values.ip,
                      port: values.port,
                      ipAPI: values.api,
                    },
                  },
                });

                await close();
              }}
            >
              {({ errors, touched, values }) => (
                <Form className={cssModules.form}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <label className={cssModules.label} htmlFor="api">
                      IP API
                    </label>
                    <Field
                      type="text"
                      name="api"
                      id="api"
                      value={values.api}
                      placeholder="e.g. http://10.10.10.10"
                      className={cssModules.input}
                    />
                    {errors.api && touched.api ? (
                      <Typography
                        sx={{
                          color: "red",
                          fontSize: "0.75rem",
                        }}
                      >
                        {errors.api}
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

                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <label className={cssModules.label} htmlFor="ip">
                      IP Public
                    </label>
                    <Field
                      type="text"
                      name="ip"
                      id="ip"
                      value={values.ip}
                      placeholder="e.g. http://10.10.10.10"
                      className={cssModules.input}
                    />
                    {errors.ip && touched.ip ? (
                      <Typography
                        sx={{
                          color: "red",
                          fontSize: "0.75rem",
                        }}
                      >
                        {errors.ip}
                      </Typography>
                    ) : null}
                  </div>

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
                    Add
                  </Button>
                  <Button
                    sx={{
                      backgroundColor: "#fff",
                      ":hover": {
                        border: "solid 1px #EAB737",
                        color: "#EAB737",
                      },
                      width: "100%",
                      height: "2.75rem",
                      border: "solid 1px lightgrey",
                      fontSize: 18,
                      color: "black",
                      fontWeight: 200,
                      marginTop: 2,
                      cursor: "pointer",
                      borderRadius: "2px",
                    }}
                    onClick={close}
                  >
                    Cancel
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>

        {/* <Box
          sx={{
            width: "48%",
            height: "auto",
            position: "relative",
          }}
        >
          <Typography
            style={{
              position: "absolute",
              top: 10,
              right: 15,
              cursor: "pointer",
            }}
            onClick={close}
          >
            X
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 900 }}>
              {" "}
              Lörem ipsum semigt suvis hemissade, faktigt. Astrodonylig egolig i
              her inte dekafagt vaska. Pren fylade. Pappafeminist valiga inte
              baligen rel fal. Spelaras vöhet väledes aktig. Svininfluensa
              uggling. Pneumaception nektig avis, visade. Barriärvård or. Säv
              faskade. Dinyde dett valigt.
              <br />
              <br />
              Plasade autode. Virigen tel. Ande metaskop. Ölig babynas befagon
              och baplavis då varen. Reavis farade ifall larar, analorybel och
              heteror. Öbel ötåktiga eller ågt. Ner nygt äska om rinde prev.
              Selfiepinne motust väpona. Remuda renyktiga nyliga plus speser.
              Anagon transaktiv, rebans reastik din.{" "}
            </Typography>
          </Box>
        </Box> */}
      </Box>
    </>
  );
}
