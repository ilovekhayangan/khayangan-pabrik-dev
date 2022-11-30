import * as base64 from "base-64";
import { useSelector } from "react-redux";

export default function getEndpointAccess(arg) {
  const AuthStore = useSelector((state) => state.auth);

  if (SESSION_ENDPOINT != null) {
    const byte = decodeURIComponent(SESSION_ENDPOINT);
    const endpoint = base64.decode(byte);
    const BASEURL = process.env.NEXT_PUBLIC_PROXY_URL + "/" + endpoint;
    return arg && arg.noProxy ? endpoint : BASEURL;
  } else if (arg && arg?.URL) {
    const byte = decodeURIComponent(arg?.URL);
    const endpoint = base64.decode(byte);
    const BASEURL = process.env.NEXT_PUBLIC_PROXY_URL + "/" + endpoint;
    return arg && arg.noProxy ? endpoint : BASEURL;
  }
}
