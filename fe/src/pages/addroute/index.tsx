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
import { DownOutlined, ReadOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons"
import { Button, Dropdown, Menu, message, Switch, Tabs } from "antd"
import { FormInstance } from "antd/lib/form"
import Axios from "axios"
import Constant from '../../lib/constant'
import Routes, { RouteForm } from "../../components/Routes"
import NewRouteForm from "../../components/NewRoute"
import { useTypedSelector } from "../../lib/store"
//import { APILoader,Map,Marker, Polyline } from "@uiw/react-amap"
import {Map} from "react-amap"
import { extracLocation } from "../../lib/utils"
import { Markers } from "../../components/AMapCom"
import dynamic from "next/dynamic"
const { TabPane } = Tabs
export const Card = ({
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
  const [mapShow, setMS] = useState<boolean>(true)
  const [epidemic, setE] = useState<string>("北京顺义疫情")
  const [buttonEnable, setBE] = useState<boolean>(false)
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
  }
  const onSave = async () => {
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
  const menuClick = (e:any) => {
    if (e.key == "0"){
      setE("北京顺义疫情")
      console.log("北京顺义疫情")
    }
    if (e.key == "1"){
      setE("北京新发地疫情")
      console.log("北京新发地疫情")
    }
    if (e.key == "2"){
      setE("北京大兴疫情")
      console.log("北京大兴疫情")
    }
    if (e.key == "3"){
      setE("河北石家庄疫情")
      console.log("河北石家庄疫情")
    }
  }

  const menu = (
    <Menu onClick={menuClick}>
      <Menu.Item key="0">
        北京顺义疫情
      </Menu.Item>
      <Menu.Item key="1">
        北京新发地疫情
      </Menu.Item>
      <Menu.Item key="2">
        北京大兴疫情
      </Menu.Item>
      <Menu.Item key="3">
        河北石家庄疫情
      </Menu.Item>
    </Menu>
  )

  const PatientText = () => {
    let info = basicForm?.getFieldsValue()
    return(
      <>
        <h3>
          {info?.name}，{info?.gender}，身份证号{info?.personal_id}，{info?.age}岁，电话{info?.phone}。
        </h3>
        <br/>
        {
          loadedRoutes?.map((e)=>(
            <>
              <h3>
                {e.date}，{e.route.map((n)=>{
                  let contacts = n.pause?.contacts.map((c)=>(c.name+"("+c.pid.substr(12,6)+")")).join(",")
                  return (n.travel?
                    n.pause?.time+"时,经"+n.travel.transform+"抵达"+n.pause?.location?.name+"。接触"+contacts+"。":
                    n.pause?.time+"时,"+"抵达"+n.pause?.location?.name+"。接触"+contacts+"。")
                }).join()}
              </h3>
              <br/>
            </>
          ))
        }
      </>
    )
  }

  return (
    <MainLayout>

      <Row gutter={[14, 14]} style={{ display: "flex", alignItems: "stretch" }} className={sty.RootRow}>
        <Col md={{span:12}}>
          <Col md={{span:24}} className={sty.CdcHeader}>
            <ReadOutlined style={{height: "100px",width: "100px"}}/>
            <div
              style={{
                display:"flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <Dropdown overlay={menu} trigger={['click']}>
                <h1>{epidemic}<DownOutlined/></h1>
              </Dropdown>
              <h3 style={{color: "red"}}>已确诊17例</h3>
              <h4>首例确诊时间: 2021年1月1日</h4>
            </div>

          </Col>
          <Col md={{span:24}}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <Col md={{ span: 12 }} >
                {/* <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                  }}
                > */}
                  {/* <Col span={24} style={{ flex: "0 1 auto", padding: "0" }}> */}
                    <Card title={"基本信息"}>
                      <div className={sty.FormContainer}>
                        <FormBasic onChange={onBasicChange} />
                      </div>
                    </Card>
                  {/* </Col> */}

                  {/* <Col
                    span={24}
                    className={sty.PathContainer}
                    style={{ padding: "0" }}
                  >
                    <div className={sty.UploadButton}>
                      <Button icon={<SaveOutlined />} type={'primary'} onClick={onSave} style={{ marginRight: "8px" }}>新增</Button>
                      <Button icon={<UploadOutlined />} type={'primary'} onClick={onSubmit}>添加</Button>
                    </div>
                    <Card
                      title={"病例新增路径填报"}
                      grid={{ span: 24 }}
                      style={{ height: "100%", position: "absolute", width: "100%" }}
                    >
                      <div className={sty.PathFormContainer}>
                        <NewRouteForm/>
                      </div>
                    </Card>
                  </Col> */}
                {/* </div> */}
              </Col>

              <Col md={{span:12}}>
                <Tabs 
                  type={"card"}
                  tabBarExtraContent={
                    <div className={sty.UploadButton}>
                      <Button disabled={buttonEnable} icon={<SaveOutlined />} type={'primary'} onClick={onSave} style={{ marginRight: "8px" }}>新增</Button>
                      <Button disabled={buttonEnable} icon={<UploadOutlined />} type={'primary'} onClick={onSubmit}>添加</Button>
                    </div>
                  }
                  onChange={(actKey)=>{setBE(actKey=="2")}}
                >
                  <TabPane tab="新增路径" key="1">
                    <div className={sty.PanelContainer}>
                      <NewRouteForm/>
                    </div>
                  </TabPane>
                  <TabPane tab="已记录路径" key="2">
                    <div className={sty.PanelContainer}>
                      <Routes/>
                    </div>
                  </TabPane>
                </Tabs>
                {/* <Col span={24}>
                  <Card
                    title={"病例已记录路径信息"}
                  >
                    <div className={sty.FormContainer}>
                        <Routes/>
                    </div>
                  </Card>
                </Col> */}
              </Col>
            </div>
          </Col>
        </Col>

        <Col md={{ span: 12, }} className={sty.PathContainer}>
          <div className={sty.UploadButton}>
            <Switch defaultChecked onChange={(e)=>{setMS(e)}} />
          </div>
          <Card title={mapShow?"路径可视化":"路径文本"} style={{ height: "100%" }}>
            <div style={{ height: "100%" }}>
              {mapShow?
                <Map
                  amapkey={"c640403f7b166ffb3490f7d2d4ab954c"}
                  events={{
                    created: (ins: any) => {
                      const AMap = (window as any).AMap
                      dispatch(ActSetState({ __map__: ins, amap: (window as any).AMap }))
                      console.log(11122)
                    }
                  }}>
                    <AMapLinkedMarker />
                </Map>:
                <PatientText/>
              }
            </div>
          </Card>
        </Col>

      </Row>
    </MainLayout>
  )
}
