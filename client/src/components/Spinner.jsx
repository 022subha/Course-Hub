import React from "react";
import { BounceLoader } from "react-spinners";

export default function Spinner() {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <BounceLoader size={200} loading={true} color="#e70b53" />
    </div>
  );
}
