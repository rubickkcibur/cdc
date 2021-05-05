import React, { useEffect, useState } from "react"
import MainLayout from "../../components/MainLayoout/PageLayout"
import sty from "./index.module.scss"
import Col, { ColProps } from "antd/lib/grid/col"
import Row from "antd/lib/grid/row"
import FormBasic from "../../components/BasicForm"
import PathForm from "../../components/PathForm"
import { useDispatch } from "react-redux"
import { ActSetState, PAGlobalReducer } from "../../lib/state/global"
import { DownOutlined, ReadOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons"
import { Button, Dropdown, Menu, message, Radio, Switch, Tabs } from "antd"
import { FormInstance } from "antd/lib/form"
import Axios from "axios"
import Constant from '../../lib/constant'
import Routes, { RouteForm } from "../../components/Routes"
import NewRouteForm from "../../components/NewRoute"
import { useTypedSelector } from "../../lib/store"
//import { APILoader,Map,Marker, Polyline } from "@uiw/react-amap"
import {Map} from "react-amap"
import { extracLocation } from "../../lib/utils"
import dynamic from "next/dynamic"
import { AMapInsertMarker } from "../../components/AMapMarker"
import BasicQues from "../../components/BasicQues"
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
  const [mapShow, setMS] = useState<boolean>(true)
  const [epidemic, setE] = useState<string>("待选择")
  const [buttonEnable, setBE] = useState(sty.hidden)
  const [version,setVer] = useState<string>("2021年04月21日12:30 - 张三")
  const newRouteBuffer = useTypedSelector(e=>e.PAGlobalReducer.newRouteBuffer)
  const loadedRoutes = useTypedSelector(e=>e.PAGlobalReducer.loadedRoutes)
  const loadedEpiKey = useTypedSelector(e=>e.PAGlobalReducer.loadedEpiKey)
  const epidemics = useTypedSelector(e=>e.PAGlobalReducer.epidemics)
  const amap = useTypedSelector(e=>e.PAGlobalReducer.amap)
  const onBasicChange = (values: any, form: FormInstance | undefined) => {
    setBF(form)
    //console.log(basicForm?.validateFields())
  }

  const onSubmit = async () => {
    try{
      Axios.post(`${Constant.apihost}/insertroute`, {
        personal_id:basicForm?.getFieldsValue()?.personal_id,
        data:newRouteBuffer
      })
      .then(()=>message.success("提交成功"))
      .catch(()=>message.error("提交失败"))
    }catch(e){
      console.log(e)
    }
    console.log("for 更新 check")
    console.log(basicForm?.getFieldsValue())
    console.log(newRouteBuffer)
  }
  const onSave = async () => {
    try{
      Axios.post(`${Constant.apihost}/newupload`, {
        basic:basicForm?.getFieldsValue(), //此处有问题
        routes:[newRouteBuffer]
      })
      .then(()=>message.success("提交成功"))
      .catch(()=>message.error("提交失败"))
    }catch(e){
      console.log(e)
    }
    console.log("for 新增 check")
    console.log(basicForm?.getFieldsValue())
    console.log(newRouteBuffer)
  }

  const menuClick = (e:any) => {
    dispatch(ActSetState({loadedEpiKey:e.key}))
  }

  useEffect(()=>{
    if (epidemics && loadedEpiKey)
      setE(epidemics[loadedEpiKey].name)
    else
      setE("待选择")
  },[loadedEpiKey])

  const menu = (
    <Menu onClick={menuClick}>
      {epidemics?.map((e:any,idx:any)=>(
        <Menu.Item key={idx}>
          {e.name}
        </Menu.Item>
      ))}
    </Menu>
  )


  const PatientText = () => {
    let info = basicForm?.getFieldsValue()
    return(
      <>
        <span style={{fontSize:"18px",fontFamily:"cursive"}}>
          {info?.name}，{info?.gender=="male"?"男":"女"}，身份证号{info?.personal_id}，{info?.age}岁，电话{info?.phone}。
          家住{info?.addr1[0] + info?.addr1[1] +info?.addr1[2] + info?.addr2}
        </span>
        <span style={{fontSize:"18px",fontFamily:"cursive"}}>
          {loadedRoutes?.map((e)=>(
            <>
              <span style={{fontSize:"18px",fontFamily:"cursive"}}>
                {e.date}，{e.route.map((n)=>{
                  let contacts = n?.pause?.contacts?.map((c)=>(c.name+"("+c.pid.substr(12,6)+")")).join(",")
                  return (n?.travel?.transform?
                    (n?.pause?.time+"时,经"+n.travel.transform+"抵达"+n.pause?.location?.name+"。"+(contacts?("接触"+contacts+"。"):"")):
                    (n?.pause?.time+"时,"+"抵达"+n.pause?.location?.name+"。"+(contacts?("接触"+contacts+"。"):"")))
                }).join(" ")}
              </span>
           </>
          ))}
        </span>
        <span style={{fontSize:"18px",fontFamily:"cursive"}}>
          {newRouteBuffer?.date}
        </span>
        <br/>
        <span style={{fontSize:"18px",fontFamily:"cursive"}}>
          {newRouteBuffer?.route?.map(
            (n)=>{
              let contacts = n?.pause?.contacts?.map((c)=>(c.name+"("+c.pid.substr(12,6)+")")).join(",")
              return (n?.travel?.transform?
                (n?.pause?.time+"时,经"+n.travel.transform+"抵达"+n.pause?.location?.name+"。"+(contacts?("接触"+contacts+"。"):"")):
                (n?.pause?.time+"时,"+"抵达"+n.pause?.location?.name+"。"+(contacts?("接触"+contacts+"。"):"")))
            }).map((s)=>(<>{s}<br/></>))}
        </span>
      </>
    )
  }

  return (
    <MainLayout>

      <Row gutter={[14, 14]} style={{ display: "flex", alignItems: "stretch",height:'initial' }} className={sty.RootRow}>
        <Col md={{span:12}} style={{height:'100%'}}>
          <Col md={{span:24}} className={sty.CdcHeader}>
            <Row></Row>
            <ReadOutlined style={{fontSize:'20px',marginRight:'10px',marginLeft:'5px',marginTop:'12px'}}/>
            <div
              style={{
                display:"flex",
                flexDirection:"row",
                justifyContent:"space-between",
                alignItems: "center",
                width:"90%"
              }}>
              <div
                style={{
                  display:"flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  marginTop:'3px'
                }}
              >
                <Dropdown overlay={menu} trigger={['click']}>
                  <h1>{epidemic}<DownOutlined/></h1>
                </Dropdown>
                <h3 style={{color: "red",marginTop:'-6px'}}>已确诊{epidemics?epidemics[loadedEpiKey]?.patients:0}例</h3>
                <h4>首例确诊时间: {epidemics?epidemics[loadedEpiKey]?.first_time:"2021-01-01"}</h4>
              </div>
              <div style={{width:"38%"}}>
              <Dropdown overlay={
                <Menu onClick={(e:any)=>setVer(e.key as string)}>
                  <Menu.Item key={"2021年04月21日12:30 - 张三"}>
                    2021年04月21日12:30 - 张三
                  </Menu.Item>
                  <Menu.Item key={"2021年04月22日11:30 - 李四"}>
                    2021年04月22日11:30 - 李四
                  </Menu.Item>
                  <Menu.Item key={"2021年04月20日13:30 - 王五"}>
                    2021年04月20日13:30 - 王五
                  </Menu.Item>
                </Menu>
              } trigger={['click']}>
                <h2>{version}<DownOutlined/></h2>
              </Dropdown>
              </div>
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
              <Col md={{span:24}} style={{height:'100%'}}>
                <Tabs 
                  type={"card"}
                  tabBarExtraContent={
                    <div className={sty.UploadButton}>
                      <Button icon={<SaveOutlined />} size={"large"} type={'primary'} onClick={onSave} className={buttonEnable}>新增</Button>
                      <Button  icon={<UploadOutlined />} size={"large"} type={'primary'} onClick={onSubmit} className={buttonEnable}>更新</Button>
                    </div>
                  }
                  onChange={(actKey)=>{
                    if(actKey=="1"){
                      setBE(sty.hidden)
                    }
                    else{
                      setBE(sty.show)
                    }
                  }}
                >
                  <TabPane tab={<span style={{fontSize:"18px"}}>基本信息</span>} key="1">
                    <div className={sty.PanelContainer}>
                      <FormBasic onChange={onBasicChange} />
                    </div>
                  </TabPane>
                  <TabPane tab={<span style={{fontSize:"18px"}}>流调信息</span>} key="3">
                    <div className={sty.PanelContainer}>
                      <Tabs>
                          <TabPane tab="基本版" key="1">
                              <BasicQues/>
                          </TabPane>
                          <TabPane tab="北京版" key="2">
                              <BasicQues/>
                          </TabPane>
                          <TabPane tab="黑龙江版" key="3">
                              <BasicQues/>
                          </TabPane>
                          <TabPane tab="河北版" key="4">
                              <BasicQues/>
                          </TabPane>
                      </Tabs>
                    </div>
                  </TabPane>
                  <TabPane tab={<span style={{fontSize:"18px"}}>出行轨迹</span>} key="2">
                    <div className={sty.PanelContainer}>
                      <NewRouteForm/>
                    </div>
                  </TabPane>
                </Tabs>
              </Col>
            </div>
          </Col>
        </Col>

        <Col md={{ span: 12, }} className={sty.PathContainer}>
          <div className={sty.UploadButton}>
            <Radio.Group 
              defaultValue={true} 
              onChange={(e)=>setMS(e.target.value)}
              optionType="button"
              buttonStyle="solid"
            >
              <Radio.Button value={true}>地图</Radio.Button>
              <Radio.Button value={false}>简报</Radio.Button>
            </Radio.Group>
          </div>
          <Card title={mapShow?"路径可视化":"流调报告(摘要版)"} style={{ height: "100%" }}>
            <div style={{ height: "85vh" ,overflowX:"auto",overflowY:"auto"}}>
              {mapShow?
                <Map
                  amapkey={"c640403f7b166ffb3490f7d2d4ab954c"}
                  events={{
                    created: (ins: any) => {
                      if(!amap){
                        dispatch(ActSetState({amap: (window as any).AMap }))
                      }
                      console.log(11122)
                    }
                  }}>
                    <AMapInsertMarker />
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
