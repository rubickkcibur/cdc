import React, { useEffect } from "react"
import {
  BarChartOutlined,
  BellOutlined,
  SearchOutlined,
  TeamOutlined,
  NodeIndexOutlined,
  FormOutlined,
  HeatMapOutlined
} from "@ant-design/icons"

import sty from "./index.module.scss"
import { useRouter } from "next/dist/client/router"
import DebouncedAutocomplete from "../AutoComplete"
const MenuItem = [
  // {
  //   title: "流调填报",
  //   icon: <BarChartOutlined />,
  //   url: '/addroute'
  // },
  // {
  //   title: "问卷管理",
  //   icon: <FormOutlined />,
  //   url: '/question'
  // },
  // {
  //   title: "病例信息",
  //   icon: <FormOutlined />,
  //   url: '/'
  // },
  {
    title: "流调分析",
    icon: <TeamOutlined />,
    url: '/overview'
  },
  {
    title: "案例对比",
    icon: <FormOutlined />,
    url: '/patientAnalyze'
  },
  {
    title:"传播分析",
    icon:<NodeIndexOutlined />,
    url:'/analyse'
  },
  // {
  //   title: "疫情对比",
  //   icon: <FormOutlined />,
  //   url: '/history'
  // },
  // {
  //   title: "疫情总览",
  //   icon: <FormOutlined />,
  //   url: '/statistic'
  // },
  // {
  //   title: "疫情分布",
  //   icon:  <HeatMapOutlined/>,
  //   url: '/heatmap'
  // }
]

export default function KashHeader() {
  const router = useRouter()
  useEffect(()=>{
    console.log("render!")
  },[])
  return (
    <div className={sty.Header}>
      <div className={sty.Icon}>数字化智慧流调系统</div>
      <div className={sty.Nav}>
        <div className={sty.Menu}>
          {MenuItem.map((e) => (
            <div key={e.title} className={sty.Item} onClick={() => router.push(e.url)}>
              <div>
                {e.icon}
                <span className={sty.TextArea}>{e.title}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={sty.Control}>
          {/* <div className={sty.search}>
            <DebouncedAutocomplete />
          </div> */}
          <div className={sty.ico}>
            <BellOutlined style={{ width: "100%", height: "100%" }} />
          </div>
          <div className={sty.ava}>
            <div className={sty.img}></div>
            <div>用户名</div>
          </div>
        </div>
      </div>
    </div>
  )
}
