import React from "react"
import MainLayout from "../components/MainLayoout/PageLayout"
import sty from "./index.module.scss"
import Col, { ColProps } from "antd/lib/grid/col"
import Row from "antd/lib/grid/row"
import FormBasic from "../components/BasicForm"
import PathForm from "../components/PathForm"
import { Map } from 'react-amap'
import AMapLinkedMarker from "../components/AMapLinkedMarker"
import { useDispatch } from "react-redux"
import { ActSetState } from "../lib/state/global"
const Card = ({
  children,
  title,
  grid,
  style,
}: {
  style?: React.CSSProperties
  children: React.ReactNode
  title: string
  grid?: ColProps
}) => {
  return (
    <Col className={sty.KashCard} {...grid} style={style}>
      <div className={sty.Title}>{title}</div>
      <div className={sty.Content}>{children}</div>
    </Col>
  )
}

export default function index() {
  const dispatch = useDispatch()
  return (
    <MainLayout>
      <Row gutter={[14, 14]} style={{ display: "flex", alignItems: "stretch" }} className={sty.RootRow}>
        <Col md={{ span: 7 }} >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <Col span={24} style={{ flex: "0 1 auto", padding: "0" }}>
              <Card title={"基本信息"}>
                <div className={sty.FormContainer}>
                  <FormBasic />
                </div>
              </Card>
            </Col>

            <Col
              span={24}
              className={sty.PathContainer}
              style={{ padding: "0" }}
            >
              <Card
                title={"路径填报"}
                grid={{ span: 24 }}
                style={{ height: "100%", position: "absolute", width: "100%" }}
              >
                <div className={sty.PathFormContainer}>
                  <PathForm />
                </div>
              </Card>
            </Col>
          </div>
        </Col>
        <Col md={{ span: 17, }} >
          <Card title={"路径可视化"} style={{ height: "100%" }}>
            <div style={{ height: "100%" }}>
              <Map
                version={'1.4.0'}
                amapkey={"d5c6e14e597ee8af84b8a4fcfbb1807f"}
                events={{
                  created: (ins: any) => {
                    const AMap = (window as any).AMap
                    dispatch(ActSetState({ __map__: ins, amap: (window as any).AMap }))
                    console.log(11122)
                    var auto
                    AMap.plugin('AMap.Autocomplete', () => {
                      try {

                        auto = new AMap.Autocomplete({
                          input: "tipinput"
                        });
                        console.log('auto')
                      } catch (e) {
                        console.log(e)

                      }
                    })
                  }
                }}>
                <AMapLinkedMarker />
              </Map>
            </div>
          </Card>
        </Col>
      </Row>
    </MainLayout>
  )
}
