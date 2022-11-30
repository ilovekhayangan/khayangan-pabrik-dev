import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
// import getEndpointAccess from "../AccessAPI";

export default function Console(props) {
  const { id } = props;

  const [urlConsole, setUrlConsole] = useState(null);
  const router = useRouter();
  const AuthStore = useSelector((state) => state.auth);
  const URL = getEndpointAccess();

  useEffect(() => {
    const reqConsole = {
      "os-getVNCConsole": {
        type: "novnc",
      },
    };
    axios
      .post(`${URL}:8774/v2.1/servers/${id}/action`, reqConsole, {
        headers: {
          "X-Auth-Token": token,
          "Access-Control-Allow-Headers": "*",
          "Content-Type": "application/json",
        },
      })
      .then((res) => setUrlConsole(res?.data.console))
      .catch((er) =>
        console.log(
          er?.response?.data?.conflictingRequest.message ?? err.message
        )
      );
  }, []);

  return (
    <>
      {/* <div className="bg-green w-full"> */}
      <div className="flex flex-col">
        {urlConsole ? (
          <>
            <div className="border-white/20 text-sm border mb-10 text-white px-4 py-3 w-full bg-yellow-600 rounded">
              <p className="text-zinc-100">
                If console is not responding to keyboard input: click the grey
                status bar below.{" "}
                <a
                  target={"_blank"}
                  href={`${urlConsole.url}`}
                  rel="noopener noreferrer"
                  className="underline text-zinc-200 hover:text-white"
                >
                  Click here to show only console
                </a>
              </p>
              <p>{`To exit the fullscreen mode, click the browser's back button.`}</p>
            </div>
            <div className="w-full flex justify-center mb-5">
              <Iframe
                url={urlConsole?.url}
                width="80%"
                height="600px"
                id={urlConsole?.id}
                className="myClassname"
                display="initial"
                position="initial"
              />
            </div>
          </>
        ) : (
          <div className="border-white/20 border text-white px-4 py-3 w-full bg-gray-400/10">
            <p className="text-zinc-200">
              Unable to load console. Please reload page to try again.
            </p>
          </div>
        )}
      </div>

      {/* </div> */}
      {/* <iframe src={urlConsole?.url} width="80%" height="600px" /> */}
      {/* <br /> */}
    </>
  );
}
