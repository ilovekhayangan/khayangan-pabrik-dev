import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import RequireAuth from "@route/requireAuth";
import RequireNotAuth from "@route/requireNotAuth";
import DashboardLayout from "@layouts/dashboard";

import routes from "@route/data";

const RoutesC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          {routes.map(({ id, path, component: Component, requireAuth }) => {
            let _element = null;

            if (requireAuth) {
              _element = (
                <RequireAuth>
                  <Component />
                </RequireAuth>
              );
            } else {
              _element = (
                <RequireNotAuth>
                  <Component />
                </RequireNotAuth>
              );
            }

            return <Route path={path} element={_element} key={id} />;
          })}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesC;
