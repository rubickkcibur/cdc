import { Select, Switch } from "antd"
import React, { useEffect, useState } from "react"
import MainLayout from "../../components/MainLayoout/PageLayout"
import Const from "../../lib/constant"
import sty from './index.module.scss'

export default function PageOverview() {
  const [byWhat, setByWhat] = useState("people")
  function draw(e: string) {
    var config;
    setByWhat(e);
    if (e == "location") {
      config = {
        encryption: "ENCRYPTION_ON",
        encripted: "ENCRYPTION_ON",
        encrypted: "ENCRYPTION_ON",
        trust: "TRUST_SYSTEM_CA_SIGNED_CERTIFICATES",
        container_id: "viz",
        server_url: Const.boltserver,
        server_user: "neo4j",
        server_password: "123456",
        labels: {
          "Location": {
            "caption": "name",
            "size": "count",
            "color": "red"
          }
        },
        relationships: {
          "To": {
            "caption": "traffic",
            "thickness": "count",
            "color": "pink"
          }
        },
        initial_cypher: "MATCH p=()-[r:To]->() RETURN p "
      };
    }
    else {
      config = {
        encryption: "ENCRYPTION_ON",
        encripted: "ENCRYPTION_ON",
        encrypted: "ENCRYPTION_ON",
        trust: "TRUST_SYSTEM_CA_SIGNED_CERTIFICATES",
        container_id: "viz",
        server_url: Const.boltserver,
        server_user: "neo4j",
        server_password: "123456",
        labels: {
          "Patient": {
            "size": "count",
            "caption": "name",
          },
          "Contact": {
            "size": "count",
            "caption": "name"
          }
        },
        relationships: {
          "contact": {
            "caption": true,
            "thickness": "count"
          }
        },
        initial_cypher: "MATCH p=()-[r:With]->() RETURN p LIMIT 25"
      };
    }

    const NeoVis = require('neovis.js/dist/neovis')
    const viz = new NeoVis.default(config)
    viz.render();
  }
  useEffect(() => {
    if (process.browser)
      draw("people")
  }, [])

  return <MainLayout>
    <div className={sty.FrameContainer}>
      <div id={'viz'} className={sty.neovis} style={{ width: "100%", height: "100%" }}></div>
      <div className={sty.Control} >
        <Select value={byWhat} onChange={(e) => draw(e)}>
          <Select.Option value={"people"}> 按人群</Select.Option>
          <Select.Option value={"location"}> 按地点</Select.Option>
        </Select>
      </div>
    </div>
  </MainLayout>
}