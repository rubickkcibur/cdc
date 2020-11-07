import { Select, Switch } from "antd"
import React, { useState } from "react"
import MainLayout from "../../components/MainLayoout/PageLayout"
import sty from './index.module.scss'

export default function PageOverview() {
  const [byWhat, setByWhat] = useState("people")
  const urlLoc = 'http://39.105.232.15:2100/neovis.js/examples/ByLocation.html'
  const urlPeo = 'http://39.105.232.15:2100/neovis.js/examples/ByPerson.html'

  return <MainLayout>
    <div className={sty.FrameContainer}>
      <iframe src={byWhat === "people" ? urlPeo : urlLoc}></iframe>
      <div className={sty.Control} >
        <Select value={byWhat} onChange={(e) => setByWhat(e)}>
          <Select.Option value={"people"}> 按人群</Select.Option>
          <Select.Option value={"location"}> 按地点</Select.Option>
        </Select>
      </div>
    </div>
  </MainLayout>
}