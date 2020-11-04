import React from "react";
import {
  BarChartOutlined,
  BellOutlined,
  SearchOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import sty from "./index.module.scss";
const MenuItem = [
  {
    title: "流调填报",
    icon: <BarChartOutlined />,
  },
  {
    title: "流调总览",
    icon: <TeamOutlined />,
  },
];

export default function KashHeader() {
  return (
    <div className={sty.Header}>
      <div className={sty.Icon}>疫情流调系统</div>
      <div className={sty.Nav}>
        <div className={sty.Menu}>
          {MenuItem.map((e) => (
            <div key={e.title} className={sty.Item}>
              <div>
                {e.icon}
                <span className={sty.TextArea}>{e.title}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={sty.Control}>
          <div className={sty.ico}>
            <SearchOutlined />
          </div>
          <div className={sty.ico}>
            <BellOutlined />
          </div>
          <div className={sty.ava}>
            <div className={sty.img}></div>
            <div>用户名</div>
          </div>
        </div>
      </div>
    </div>
  );
}
