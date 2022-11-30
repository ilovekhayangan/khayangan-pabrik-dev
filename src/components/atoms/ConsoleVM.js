import React from "react";

const ConsoleVM = ({ url }) => {
  return (
    <div>
      <iframe src={url}></iframe>
    </div>
  );
};

export default ConsoleVM;
