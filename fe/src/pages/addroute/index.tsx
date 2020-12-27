import React, { useState } from "react"
import MainLayout from "../../components/MainLayoout/PageLayout"
import sty from "./index.module.scss"
import Col, { ColProps } from "antd/lib/grid/col"
import Row from "antd/lib/grid/row"
import FormBasic from "../../components/BasicForm"
import PathForm from "../../components/PathForm"
import AMapLinkedMarker from "../../components/AMapLinkedMarker"
import { useDispatch } from "react-redux"
import { ActSetState } from "../../lib/state/global"
import { SaveOutlined, UploadOutlined } from "@ant-design/icons"
import { Button, message } from "antd"
import { FormInstance } from "antd/lib/form"
import Axios from "axios"
import Constant from '../../lib/constant'
import Routes, { RouteForm } from "../../components/Routes"
import NewRouteForm from "../../components/NewRoute"
import { useTypedSelector } from "../../lib/store"
import { APILoader,Map,Marker, Polyline } from "@uiw/react-amap"
import { extracLocation } from "../../lib/utils"
import { Markers } from "../../components/AMapCom"
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
  const [basicForm, setBF] = useState<FormInstance | undefined>(undefined)
  const [pathForm, setPF] = useState<FormInstance | undefined>(undefined)
  const newRouteBuffer = useTypedSelector(e=>e.PAGlobalReducer.newRouteBuffer)
  const loadedBasic = useTypedSelector(e=>e.PAGlobalReducer.loadedBasic)
  const loadedRoutes = useTypedSelector(e=>e.PAGlobalReducer.loadedRoutes)
  const onBasicChange = (values: any, form: FormInstance | undefined) => {
    setBF(form)
    console.log(basicForm?.validateFields())
  }
  const onPathChange = (values: any, form: FormInstance | undefined) => {
    setPF(form)
  }
  const onSubmit = async () => {

    try{
      Axios.post(`${Constant.apihost}/insertroute`, {
        personal_id:(await basicForm?.validateFields())?.personal_id, //此处有问题
        data:newRouteBuffer
      })
      .then(()=>message.success("提交成功"))
      .catch(()=>message.error("提交失败"))
    }catch(e){
      console.log(e)
    }
    // try {
    //   await onSave()
    // } finally {

    //   location && location.reload()
    // }

  }
  const onSave = async () => {
    // try {
    //   const basic = await basicForm?.validateFields()
    //   const path: any = await pathForm?.validateFields()
    //   const t = Object.entries(path)
    //   Axios.post(`${Constant.apihost}/upload`, {
    //     basic,
    //     path: {
    //       nodes: t.map(([, v]: any) => v.node),
    //       edges: t.map(([, v]: any) => v.edge),
    //     },
    //   })
    //     .then(() => message.success("提交成功"))
    //     .catch(() => message.error("提交失败"))
    // } catch (e) {
    //   console.log(e)
    //   message.error("请完善信息")
    // }
    try{
      Axios.post(`${Constant.apihost}/newupload`, {
        basic:await basicForm?.validateFields(), //此处有问题
        routes:[newRouteBuffer]
      })
      .then(()=>message.success("提交成功"))
      .catch(()=>message.error("提交失败"))
    }catch(e){
      console.log(e)
    }

  }

  return (
    <MainLayout>

      <Row gutter={[14, 14]} style={{ display: "flex", alignItems: "stretch" }} className={sty.RootRow}>
        <Col md={{ span: 6 }} >
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
                  <FormBasic onChange={onBasicChange} />
                </div>
              </Card>
            </Col>

            <Col
              span={24}
              className={sty.PathContainer}
              style={{ padding: "0" }}
            >
              <div className={sty.UploadButton}>
                <Button icon={<SaveOutlined />} type={'primary'} onClick={onSave} style={{ marginRight: "8px" }}>新增</Button>
                <Button icon={<UploadOutlined />} type={'primary'} onClick={onSubmit}>添加</Button>
              </div>
              <Card
                title={"路径填报"}
                grid={{ span: 24 }}
                style={{ height: "100%", position: "absolute", width: "100%" }}
              >
                <div className={sty.PathFormContainer}>
                  <NewRouteForm/>
                </div>
              </Card>
            </Col>
          </div>
        </Col>
        <Col md={{ span: 12, }} >
          <div style={{ height: "950px" }}>
            <APILoader akay="c640403f7b166ffb3490f7d2d4ab954c">
                <Map center={[116.397428, 39.90923]} zoom={13}>
                  <Markers/>
                </Map>
            </APILoader>
          </div>
        </Col>
        <Col md={{span:6}}>
          <Routes/>
        </Col>
      </Row>
    </MainLayout>
  )
}
