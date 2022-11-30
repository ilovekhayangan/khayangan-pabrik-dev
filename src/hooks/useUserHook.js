import { useEffect, useState } from "react";
import { gql, useMutation, useLazyQuery, useQuery } from "@apollo/react-hooks";
import { POST_LOGIN, UPDATE_USER } from "@utils/gql/auth/constant";
import { useDispatch, useSelector } from "react-redux";
import {
  removeUser,
  setUser,
  setUpdateUser,
} from "@redux/features/auth/authSlice";

const UserHook = () => {
  const dispatch = useDispatch();
  const [email, setemail] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastname, setlastname] = useState("");
  const [successToast, setsuccessToast] = useState(false);
  const auth = useSelector((state) => state.auth);
  const [errorMessage, setErrorMessage] = useState("");

  const [mutationLogin, { data: dataLogin, error, loading }] =
    useMutation(POST_LOGIN);

  const [
    updateUser,
    {
      loading: updateServiceLoading,
      data: updateUserData,
      error: updateUserError,
    },
  ] = useMutation(UPDATE_USER);

  useEffect(() => {
    setemail(auth.user?.email);
    setfirstName(auth.user?.fisrtName);
    setlastname(auth.user?.lastName);
  }, [auth]);

  useEffect(() => {
    if (updateUserData) {
      dispatch(
        setUpdateUser({
          login: { user: updateUserData.updateUser },
        })
      );
      setsuccessToast(true);
    }

    let timeout;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setsuccessToast(false);
    }, 4000);
  }, [updateUserData?.updateUser]);

  const handleErrorMessage = (msg) => {
    setErrorMessage(msg);
    let timeout;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setErrorMessage("");
    }, 2000);
  };

  useEffect(() => {
    if (!updateUserError) return;
    //code untuk menampilkan error, tampilkan pake toast
  }, [updateUserError]);

  const handleUpdateUser = async (id, values) => {
    if (values.avatar) {
      await updateUser({
        variables: {
          id: id,
          input: { avatar: values.avatar },
        },
      });
      return;
    }

    let _input = values;

    if (_input.firstName.length < 3)
      return handleErrorMessage("Firstname min 3 character");
    if (_input.lastName.length < 3)
      return handleErrorMessage("Lastname min 3 character");

    if (_input.oldPassword.length > 0) {
      const { data } = await mutationLogin({
        variables: {
          input: { email: email, password: _input.oldPassword },
        },
      });

      if (data.login == null) return handleErrorMessage("Wrong old password!");

      if (_input.newPassword.length < 6)
        return handleErrorMessage("Password min 6 character");
      if (_input.newPassword != _input.confirmNewPassword)
        return handleErrorMessage("Confirm new password not match!");
      _input = {
        firstName: _input.firstName,
        lastName: _input.lastName,
        password: _input.confirmNewPassword,
        avatar: _input.avatar,
      };
    } else {
      _input = {
        firstName: _input.firstName,
        lastName: _input.lastName,
      };
    }

    try {
      await updateUser({
        variables: {
          id: id,
          input: _input,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const formLoading = updateServiceLoading;
  return {
    handleUpdateUser,
    formLoading,
    updateServiceLoading,
    successToast,
    errorMessage,
  };
};

export default UserHook;
