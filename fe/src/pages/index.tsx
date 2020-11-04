import React from "react";
import MainLayout from "../components/MainLayoout/PageLayout";
import sty from "./index.module.scss";
import Col, { ColProps } from "antd/lib/grid/col";
const Card = ({
  children,
  title,
  grid,
}: {
  children: React.ReactNode;
  title: string;
  grid: ColProps;
}) => {
  return (
    <Col className={sty.KashCard} {...grid}>
      <div className={sty.Title}>{title}</div>
      <div className={sty.Content}>{children}</div>;
    </Col>
  );
};

export default function index() {
  return (
    <MainLayout>
      <div>
        <Card title={"基本信息"}>1</Card>
        <Card title={"路径填报"}>1</Card>
      </div>
      <div>
        <Card title={"路径可视化"}>1</Card>
      </div>
    </MainLayout>
  );
}
