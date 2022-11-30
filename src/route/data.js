import Login from "@pages/login";
import Register from "@pages/register";
import Dashboard from "@pages/dashboard";
import OpenStack from "@pages/openstack";
import Location from "@pages/location";
import openstackInstance from "@pages/openstackInstance";
import openstackVolume from "@pages/openstackVolume";
import ReqOpenStack from "@pages/reqOpenstack";
import ListClient from "@pages/client";
import ReqProjectOpenstack from "@pages/reqProjectOpenstack";
import OpenstackProject from "@pages/openstackProject";
import Hypervisor from "@pages/hypervisor";
import VmWare from "@pages/vmWare";
import VmWareProject from "@pages/vmWareProject";
import VmwareInstance from "@pages/vmWareInstance";
import VmwareVolume from "@pages/vmWareVolume";
import newReqHypervisor from "@pages/newReqHypervisor";
import EditProfile from "@pages/editProfile";
import ReverseProxy from "@pages/reverseProxy";
import ServerSSH from "@pages/sshServer";
import ElasticSearch from "@pages/elasticSearch";
import WebSSH from "@pages/webSsh";
import BillingSetting from "@pages/billingSetting";
import Auth from "@pages/auth";

const routes = [
  {
    id: 1,
    path: "/",
    component: Login,
  },
  {
    id: 2,
    path: "/register",
    component: Register,
  },
  {
    id: 3,
    path: "/dashboard",
    requireAuth: true,
    component: Dashboard,
  },
  {
    id: 4,
    path: "/hypervisor/openstack/list",
    requireAuth: true,
    component: OpenStack,
  },
  {
    id: 5,
    path: "/location",
    requireAuth: true,
    component: Location,
  },
  {
    id: 6,
    path: "/hypervisor/openstack/instance",
    requireAuth: true,
    component: openstackInstance,
  },
  {
    id: 7,
    path: "/hypervisor/openstack/volume",
    requireAuth: true,
    component: openstackVolume,
  },
  {
    id: 8,
    path: "/request/openstack/list",
    requireAuth: true,
    component: ReqOpenStack,
  },
  {
    id: 9,
    path: "/client",
    requireAuth: true,
    component: ListClient,
  },
  {
    id: 10,
    path: "/request/openstack/project",
    requireAuth: true,
    component: ReqProjectOpenstack,
  },
  {
    id: 11,
    path: "/hypervisor/openstack/project",
    requireAuth: true,
    component: OpenstackProject,
  },
  {
    id: 12,
    path: "/hypervisor/wmWare/list",
    requireAuth: true,
    component: VmWare,
  },
  {
    id: 13,
    path: "/hypervisor/vmware/project",
    requireAuth: true,
    component: VmWareProject,
  },
  {
    id: 14,
    path: "/hypervisor",
    requireAuth: true,
    component: Hypervisor,
  },
  {
    id: 15,
    path: "/hypervisor/vmware/instance",
    requireAuth: true,
    component: VmwareInstance,
  },
  {
    id: 16,
    path: "/hypervisor/vmware/volume",
    requireAuth: true,
    component: VmwareVolume,
  },
  {
    id: 17,
    path: "/request/newReq",
    requireAuth: true,
    component: newReqHypervisor,
  },
  {
    id: 18,
    path: "/editProfile",
    requireAuth: true,
    component: EditProfile,
  },
  {
    id: 19,
    path: "/setting/reverseProxy",
    requireAuth: true,
    component: ReverseProxy,
  },
  {
    id: 20,
    path: "/setting/sshServer",
    requireAuth: true,
    component: ServerSSH,
  },
  {
    id: 21,
    path: "/setting/elasticSearch",
    requireAuth: true,
    component: ElasticSearch,
  },
  {
    id: 22,
    path: "/setting/webSsh",
    requireAuth: true,
    component: WebSSH,
  },
  {
    id: 23,
    path: "/setting/billingSetting",
    requireAuth: true,
    component: BillingSetting,
  },
  {
    id: 24,
    path: "/auth",
    // requireAuth: true,
    component: Auth,
  },
];

export default routes;
