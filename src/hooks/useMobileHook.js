import { useMediaQuery } from "react-responsive";

const useIsMobileHook = () => {
  const isMobile = useMediaQuery({
    query: "(max-width: 640px)",
  });

  return isMobile;
};

export default useIsMobileHook;
