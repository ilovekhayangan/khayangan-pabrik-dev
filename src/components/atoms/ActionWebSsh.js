import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useMutation } from "@apollo/client";
import { makeStyles } from "@mui/styles";
import { useDispatch } from "react-redux";
import EditSsh from "@components/molecules/EditWebSsh";
import { DEL_WEBSSH } from "@utils/gql/webSsh/constant";
import DeleteWebSshModal from "@components/molecules/DeleteWebSsh";

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

export default function ActionWebSsh({ data, refetch }) {
  const [actButton, setActButton] = useState("Action");
  const [deleteInstance, setDeleteInstance] = useState(false);
  const [editProxy, setEditProxy] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setActButton(e.target.value);
    if (e.target.value === "Edit") {
      setEditProxy(true);
      setActButton("Action");
    } else if (e.target.value === "Delete") {
      setDeleteInstance(true);
      setActButton("Action");
    }
  };

  const [deleteWebSsh, { loading: deleteLoading }] = useMutation(DEL_WEBSSH);

  const token = window.localStorage.getItem("factory-token");

  const handleDelete = async () => {
    try {
      await deleteWebSsh({
        variables: {
          id: data.id,
        },
      });

      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const classes = useStyles();

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth size="small">
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
          <MenuItem value="Action" disabled>
            Action
          </MenuItem>
          <MenuItem value="Edit">Edit</MenuItem>
          <MenuItem value="Delete">Delete</MenuItem>
        </Select>
      </FormControl>
      {deleteInstance ? (
        <DeleteWebSshModal
          handleDelete={handleDelete}
          close={() => {
            setDeleteInstance(false);
          }}
          name={data.endpoint}
        />
      ) : null}
      {editProxy ? (
        <EditSsh
          close={() => {
            setEditProxy(false);
            refetch();
          }}
          data={data}
        />
      ) : null}
    </Box>
  );
}
