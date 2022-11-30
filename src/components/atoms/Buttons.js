import { Button } from "@mui/material";

export default function Buttons({
  title,
  action,
  bg,
  color,
  width,
  height,
  fSize,
  radius,
  fWeight,
}) {
  return (
    <>
      <Button
        type="submit"
        onClick={action}
        sx={{
          backgroundColor: bg,
          ":hover": {
            bgcolor: "yellow",
            color: "black",
          },
          width: width,
          height: height,
          border: "none",
          fontSize: fSize,
          color: color,
          fontWeight: fWeight,
          marginTop: 2,
          cursor: "pointer",
          borderRadius: radius,
        }}
      >
        {title}
      </Button>
    </>
  );
}
