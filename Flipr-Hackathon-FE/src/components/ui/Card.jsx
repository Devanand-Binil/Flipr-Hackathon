// src/components/ui/Card.jsx
import React from "react";

export const Card = ({ children, className }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ children, className }) => {
  return <div className={`space-y-2 ${className || ""}`}>{children}</div>;
};
