import { useState, useEffect } from "react";

import SingleBreadcrumbs from "@components/atoms/SingleBreadrumb";
import LoadingAnim from "@components/atoms/LoadingAnim";
import { Doughnut } from "react-chartjs-2";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_REGIONS } from "@utils/gql/region/constant";
import { GETZONES, OPVM, VM_VM, REQ } from "@utils/gql/zone/constant";

import cssModules from "./Dashboard.module.css";

export default function Dashboard() {
  let regionName = [];
  let regionZoneLength = [];
  let zoneName = [];
  let zoneHyperLength = [];
  const colorPalette = [
    "#FF7F3F",
    "#F94892",
    "#FBDF07",
    "#89CFFD",
    "#A62349",
    "#D07000",
    "#C55300",
    "#96E5D1",
    "#293462",
    "#1CD6CE",
    "#FEDB39",
    "#100720",
    "#411530",
    "#94B49F",
    "#2C3333",
    "#3CCF4E",
    "#61481C",
    "#94B49F",
  ];

  const {
    data: regionData,
    loading: regionLoading,
    refetch: regionRefetch,
  } = useQuery(GET_REGIONS);

  if (!regionLoading) {
    for (let i = 1; i <= regionData.regions.length; i++) {
      regionName.push(regionData.regions[i - 1].name);
      regionZoneLength.push(regionData.regions[i - 1].zones.length);
    }
  }

  const {
    data: zoneData,
    loading: zoneLoading,
    refetch: zoneRefetch,
  } = useQuery(GETZONES);

  if (!zoneLoading) {
    for (let i = 1; i <= zoneData.zones.length; i++) {
      zoneName.push(zoneData.zones[i - 1].name);
      zoneHyperLength.push(zoneData.zones[i - 1].hypervisors.length);
    }
  }

  const regions = {
    labels: regionName,
    datasets: [
      {
        label: "Region",
        data: regionZoneLength,
        backgroundColor: colorPalette,
        borderColor: colorPalette,
      },
    ],
  };

  const zones = {
    labels: zoneName,
    datasets: [
      {
        label: "Zone",
        data: zoneHyperLength,
        backgroundColor: colorPalette,
        borderColor: colorPalette,
      },
    ],
  };

  const [openOn, setOpenOn] = useState(0);
  const [openOff, setOpenOff] = useState(0);

  const [
    getOpenVM,
    { loading: opLoading, error: opError, refetch: opRefetch },
  ] = useLazyQuery(OPVM, {
    onCompleted: ({ openStackInstancesConnection }) => {
      setOpenOn(openStackInstancesConnection.total);
    },
  });

  const [
    getOpenVMs,
    { loading: opLoadings, error: opErrors, refetch: opRefetchs },
  ] = useLazyQuery(OPVM, {
    onCompleted: ({ openStackInstancesConnection }) => {
      setOpenOff(openStackInstancesConnection.total);
    },
  });

  const [vmOn, setVmOn] = useState(0);
  const [vmOff, setVmOff] = useState(0);

  const [getVM, { loading: vmLoading, error: vmError, refetch: vmRefetch }] =
    useLazyQuery(VM_VM, {
      onCompleted: ({ vMWaresConnection }) => {
        setVmOn(vMWaresConnection.total);
      },
    });

  const [
    getVMs,
    { loading: vmLoadings, error: vmErrors, refetch: vmRefetchs },
  ] = useLazyQuery(VM_VM, {
    onCompleted: ({ vMWaresConnection }) => {
      setVmOff(vMWaresConnection.total);
    },
  });

  const [wait, setWait] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fail, setFail] = useState(0);
  const [finish, setFinish] = useState(0);

  const [statuswait, { loading: waitLoad, error: waitErr, refetch: waitRef }] =
    useLazyQuery(REQ, {
      onCompleted: ({ requestHypervisorsConnection }) => {
        setWait(requestHypervisorsConnection.total);
      },
    });

  const [statusprog, { loading: progLoad, error: progErr, refetch: progRef }] =
    useLazyQuery(REQ, {
      onCompleted: ({ requestHypervisorsConnection }) => {
        setProgress(requestHypervisorsConnection.total);
      },
    });

  const [statusfail, { loading: failLoad, error: failErr, refetch: failRef }] =
    useLazyQuery(REQ, {
      onCompleted: ({ requestHypervisorsConnection }) => {
        setFail(requestHypervisorsConnection.total);
      },
    });

  const [statusfin, { loading: finLoad, error: finErr, refetch: finRef }] =
    useLazyQuery(REQ, {
      onCompleted: ({ requestHypervisorsConnection }) => {
        setFinish(requestHypervisorsConnection.total);
      },
    });

  useEffect(() => {
    getOpenVM({
      variables: {
        or: {
          state: "POWER_ON",
        },
      },
    });
    getOpenVMs({
      variables: {
        or: {
          state: "POWER_OFF",
        },
      },
    });
    getVM({
      variables: {
        or: {
          state: "POWER_ON",
        },
      },
    });
    getVMs({
      variables: {
        or: {
          state: "POWER_OFF",
        },
      },
    });
    statuswait({
      variables: {
        or: {
          status: "WAITING",
        },
      },
    });
    statusprog({
      variables: {
        or: {
          status: "ONPROGRESS",
        },
      },
    });
    statusfail({
      variables: {
        or: {
          status: "CANCEL",
        },
      },
    });
    statusfin({
      variables: {
        or: {
          status: "COMPLETE",
        },
      },
    });
  }, []);

  return (
    <div className={cssModules.body}>
      <SingleBreadcrumbs title="Dashboard" route="dashboard" />

      {regionLoading || zoneLoading ? <LoadingAnim /> : null}

      <div className={cssModules.container}>
        <h1 className={cssModules.h1}>Dashboard</h1>
        <div className={cssModules.wrapper}>
          <div className={cssModules.dough}>
            <div className={cssModules.doughCard}>
              <h1 className={cssModules.doughTitle}>Region</h1>
              <Doughnut data={regions} style={doughstyles} />
            </div>
            <div className={cssModules.doughCard}>
              <h1 className={cssModules.doughTitle}>Zone</h1>
              <Doughnut data={zones} style={doughstyles} />
            </div>
          </div>

          <div className={cssModules.vm}>
            <h2 className={cssModules.vmTitle}>Openstack Virtual Machine</h2>
            <div className={cssModules.vmDesc}>
              <h1>{openOn + openOff}</h1>
              <h3>Total</h3>
            </div>
            <div className={cssModules.vmDesc}>
              <h1>{openOn}</h1>
              <h3>Power On</h3>
            </div>
            <div className={cssModules.vmDesc}>
              <h1>{openOff}</h1>
              <h3>Power Off</h3>
            </div>
          </div>

          <div className={cssModules.vm}>
            <h2 className={cssModules.vmTitle}>VMWare Virtual Machine</h2>
            <div className={cssModules.vmDesc}>
              <h1>{vmOn + vmOff}</h1>
              <h3>Total</h3>
            </div>
            <div className={cssModules.vmDesc}>
              <h1>{vmOn}</h1>
              <h3>Power On</h3>
            </div>
            <div className={cssModules.vmDesc}>
              <h1>{vmOff}</h1>
              <h3>Power Off</h3>
            </div>
          </div>

          <div className={cssModules.vm}>
            <h2 className={cssModules.vmTitle}>Request Datacenter</h2>
            <div className={cssModules.vmDesc}>
              <h1>{wait}</h1>
              <h3>Waiting</h3>
            </div>
            <div className={cssModules.vmDesc}>
              <h1>{progress}</h1>
              <h3>On Progress</h3>
            </div>
            <div className={cssModules.vmDesc}>
              <h1>{fail}</h1>
              <h3>Failed</h3>
            </div>
            <div className={cssModules.vmDesc}>
              <h1>{finish}</h1>
              <h3>Complete</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const doughstyles = {
  maxWidth: "50rem",
  maxHeight: "50rem",
  margin: "auto",
};
