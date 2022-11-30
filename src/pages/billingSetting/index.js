import React, { useState, useEffect } from "react";
import { Alert, Box, Container, FormControlLabel, FormGroup, Stack, Switch, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useLazyQuery, useMutation, useQuery } from "@apollo/client";

import { PageTitle } from "@components/atoms/pageTitle";
import SingleBreadcrumbs from "@components/atoms/SingleBreadrumb";
import { GET_BILL_SET, UPDATE_BILLING_SETTING } from "@utils/gql/billingSetting/constant";

const BillingSetting = () => {
  const title = "Billing Setting";
  const [onSwitch, setOnSwitch] = useState();

  const { data: getBill, refetch } = useQuery(GET_BILL_SET);

  // const [onSwitch, setOnSwitch] = useState(
  //   !getBill?.billingSettings[0]?.isActive ? false : true
  // );

  const [updtBill, { data: addData }, loadingSubmit] = useMutation(UPDATE_BILLING_SETTING);

  useEffect(() => {
    if (onSwitch === true) {
      updtBill({
        variables: {
          id: getBill?.billingSettings[0]?.id,
          input: {
            isActive: true,
          },
        },
      });
    } else if (onSwitch === false) {
      updtBill({
        variables: {
          id: getBill?.billingSettings[0]?.id,
          input: {
            isActive: false,
          },
        },
      });
    }
  }, [onSwitch]);

  const SwitchButton = styled((props) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple checked={getBill?.billingSettings[0]?.isActive} {...props} onChange={(e) => setOnSwitch(e.target.checked)} />)(({ theme }) => ({
    width: 42 * 3,
    height: 23.5 * 3,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(57px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22 * 3,
      height: 22 * 3,
    },
    "& .MuiSwitch-track": {
      borderRadius: (26 * 3) / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  }));
  console.log(onSwitch);
  return (
    <div>
      <Box sx={{ px: "1.5rem", boxSizing: "border-box" }}>
        <div style={{ paddingTop: "0.25rem" }}>
          <SingleBreadcrumbs title="Billing Setting" route="/client" />
        </div>

        <PageTitle title={title} marginBottom="2rem" marginTop="1.5rem" fontWeight={500} />
        <div>
          {getBill?.billingSettings[0]?.isActive ? (
            <Alert severity="warning">This is a warning alert — when the button is deactivated all billing calculations are stopped </Alert>
          ) : (
            <Alert severity="warning">This is a warning alert — when the button is actived all billing calculations are start </Alert>
          )}
        </div>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "50vh",
            marginTop: "1rem",
            marginBottom: 3,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormGroup>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontSize: "3rem" }}>Disable</Typography>
              <FormControlLabel control={<SwitchButton sx={{ m: 1 }} defaultChecked />} />
              <Typography sx={{ fontSize: "3rem" }}>Enable</Typography>
            </Stack>
          </FormGroup>
        </Box>
      </Box>
    </div>
  );
};

export default BillingSetting;
