import React from "react";

type AlertProps = {
  type: "warning" | "error";
  message: string;
};

export const PersistentAlert: React.FC<AlertProps> = ({ type, message }) => {
  const alertStyles =
    type === "warning"
      ? "bg-yellow-200 text-yellow-800"
      : "bg-red-200 text-red-800";

  return (
    <div
      className={`p-4 rounded-md shadow-md ${alertStyles} border ${
        type === "warning" ? "border-yellow-500" : "border-red-500"
      }`}
    >
      <p>{message}</p>
    </div>
  );
};
