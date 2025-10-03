import React from "react";
import { Card } from "primereact/card";

export default function CardBase({ title, children }) {
  return (
    <Card title={title} className="mb-3 shadow-2">
      {children}
    </Card>
  );
}