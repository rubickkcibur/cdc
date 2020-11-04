import React from "react";
import KashHeader from "../Header";

interface IProps {
  children: React.ReactNode;
}
export default function MainLayout({ children }: IProps) {
  return (
    <div>
      <KashHeader />
      <div>{children}</div>
    </div>
  );
}
