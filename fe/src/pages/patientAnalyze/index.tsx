import { Button, Col, Descriptions, Divider, Input, InputNumber, Popover, Row, Select, Slider, Statistic, Table, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayoout/PageLayout";
import Routes from "../../components/Routes";
import RelationMap from "../../components/RelationMap"
import sty from './index.module.scss'
import { Card } from "../addroute";
import { SortAscendingOutlined, UserOutlined } from "@ant-design/icons";
import { useTypedSelector } from "../../lib/store";
import Const from "../../lib/constant";
import {Map} from "react-amap"
import { AMapShowedMarker } from "../../components/AMapMarker";
import { ActSetState } from "../../lib/state/global";
import { useDispatch } from "react-redux";
import { generate } from "rxjs";
import axios from 'axios';
import {Modal} from 'antd'
import { number } from "echarts";
const { Option } = Select;
const { TabPane } = Tabs;

export default function PatientAnalyze(){
    const loadedBasic = useTypedSelector(e=>e.PAGlobalReducer.loadedBasic)
    const loadedRelatedInfo = useTypedSelector(e=>e.PAGlobalReducer.loadedRelatedInfo)
    const allPatients = useTypedSelector(e=>e.PAGlobalReducer.all_patients)
    const patientRoute = useTypedSelector(e=>e.PAGlobalReducer.patient_route)
    const relatedMap = useTypedSelector(e=>e.PAGlobalReducer.relatedMap)

    const [isModalVisible,setIMV] = useState(false)
    const [patient,setNewPatient]  = useState(null)

    const [timeOp,setTO] = useState<string>("01")
    const [timeValue,setTV] = useState<number>(1)
    const [timeUnit,setTU] = useState<number>(1)
    const [distanceOp,setDO] = useState<string>("01")
    const [distanceValue,setDV] = useState<number>(1)
    const [distanceUnit,setDU] = useState<number>(1)

    const [dataSource,setDS] = useState<any[]>([])
    const [rmap,setrmap] = useState(<RelationMap/>);

    const amap = useTypedSelector(e=>e.PAGlobalReducer.amap)
    const dispatch = useDispatch()
    function draw(e: string) {
        var config;
        if (e == "location") {
          config = {
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
                "color": "#FFFFFF"
              },
              "Contact": {
                "size": "count",
                "caption": "name",
                "color": "#FFFFFF"
              },
              "Patient": {
                "size": "count",
                "caption": "name",
                "color": "#FFFFFF"
              },
            },
            relationships: {
              "contact": {
                "caption": true,
                "thickness": "count"
              },
              "To": {
                "caption": "traffic",
                "thickness": "count",
                "color": "pink"
              },
              "TravelTo": {
                "caption": "到访",
                "thickness": "count",
                "color": "blue"
              }
            },
            initial_cypher: "MATCH p=(a:Patient)-[r:TravelTo]-()-[]-() WHERE a.name=\"" + loadedBasic?.name+"\" RETURN p"
            // initial_cypher: "MATCH p=()-[r:With]->() RETURN p"
            // initial_cypher: "MATCH p=()-[]->() RETURN p"
          };
        }
    
        const NeoVis = require('neovis.js/dist/neovis')
        const viz = new NeoVis.default(config)
        viz.render();
    }
    const selectPerson=(pid="0")=>{
      axios.get(`${Const.testserver}/get_all_patients`)
      .then(e=>{
        dispatch(ActSetState({
          all_patients:e.data
        }))
      })
      .then(e=>{
        setIMV(true)
      })
    }

    const setTarget=(epid,timeValue,timeUnit,distanceValue,distanceUnit)=>{
      axios.post(`${Const.testserver}/get_patient_route`,{
        pid:epid,
      })
      .then(e=>{dispatch(ActSetState({patient_route:e.data}))})
      console.log("setTarget")
      console.log(patientRoute)
      console.log("timeValue")
      console.log(timeValue)
      axios.post(`${Const.testserver}/get_patientmap_d_t`,{
        pid:epid,
        timeValue:timeValue,
        timeUnit:timeUnit,
        distanceValue:distanceValue,
        distanceUnit:distanceUnit
      })
      .then(e=>{dispatch(ActSetState({loadedRelatedInfo:e.data}))})
      console.log("loadedRealtedInfo")
      console.log(loadedRelatedInfo)

      axios.post(`${Const.testserver}/get_patientmap_d_t_sel`,{
        pid:epid,
      })
      .then(e=>{dispatch(ActSetState({relatedMap:e.data}))})
      console.log("relatedmap")
      console.log(relatedMap)
    }
    useEffect(() => {
        if (process.browser)
            draw("people")
    }, [loadedBasic])

    useEffect(()=>{
      setDS(generateDataSource())
      console.log("datasource")
      console.log(generateDataSource())
    },[loadedRelatedInfo,timeOp,timeUnit,timeValue,distanceUnit,distanceOp,distanceValue])

    const columns = [
        {
          title: '时间',
          dataIndex: 'time',
          key: 'time',
        },
        {
          title: '途径地点',
          dataIndex: 'loca',
          key: 'loca',
        },
        {
            title: '关联病例姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '关联时间',
            dataIndex: 'asso_time',
            key: 'asso_time',
        },
        {
            title: '关联地点',
            dataIndex: 'asso_loca',
            key: 'asso_loca',
        },
        {
            title: '直线距离',
            dataIndex: 'dist',
            key: 'dist',
        },
    ];

    const generateDataSource = ()=>{
      console.log("generateDataSource")
      console.log(loadedRelatedInfo)
      if (loadedRelatedInfo){
        console.log( loadedRelatedInfo[0].edge_relation)
        const filter = loadedRelatedInfo[0].edge_relation.filter((e:any)=>(
          (timeOp == "01"?(e.time_interval*60 < timeValue*timeUnit):
          timeOp == "02"?(e.time_interval*60 > timeValue*timeUnit):
          timeOp == "03"?(e.time_interval*60 == timeValue*timeUnit):
          (e.time_interval*60 == timeValue*timeUnit))
          &&
          (distanceOp == "01"?(e.distance*1000 < distanceValue*distanceUnit):
          distanceOp == "02"?(e.distance*1000 > distanceValue*distanceUnit):
          distanceOp == "03"?(e.distance*1000 == distanceValue*distanceUnit):
          (e.distance*1000 == distanceValue*distanceUnit))
        ))
        return filter.map((e:any,idx:any)=>({
          key:String(idx),
          name:e.pid2_name,
          time:e.crushdate,
          loca:e.crushlocationname,
          asso_time:e.crushtime,
          asso_loca:e.crushlocationname2,
          dist:parseInt(e.distance*1000+"") + "m"
        }))
      }else{
        return []
      }
    }
    return(
        <MainLayout>
            <Row>
                <Col span={10} >
                    <button className={sty.Btn} onClick={()=>{selectPerson()}}>选择病人</button>
                    <Modal title="选择病人" visible={isModalVisible} onOk={()=>{setIMV(false)}} onCancel={()=>{setIMV(false)}}>
                      <Select style={{ width: 120 }} onChange={(value)=>{
                        let p = allPatients.find(e=>e.pid===value)
                        console.log("选择的人是："+p)
                        console.log("他的pid "+p.pid)
                        console.log(timeValue)
                        setTarget(p.pid,timeValue,timeUnit,distanceValue,distanceUnit)
                      }}>
                        {
                          allPatients?
                          allPatients.map((e,i)=>(
                            <Option value={e.pid}>{e.name}</Option>
                          )):
                          null
                        }
                      </Select>
                    </Modal>
                    <Descriptions title="病者信息"  bordered={true} size={"small"}>
                      <Descriptions.Item label="姓名" span={2}>{patientRoute? patientRoute[0].name : ""}</Descriptions.Item>
                      <Descriptions.Item label="性别" span={2}>{patientRoute? patientRoute[0].gender : ""}</Descriptions.Item>
                      <Descriptions.Item label="确诊时间" span={2}>{patientRoute? patientRoute[0].diagnosedTime : ""}</Descriptions.Item>
                      <Descriptions.Item label="手机号" span={2}>{patientRoute? patientRoute[0].phone : ""}</Descriptions.Item>
                      <Descriptions.Item label="疫苗" span={10}>{patientRoute? patientRoute[0].vaccine : ""}</Descriptions.Item>
                      <Descriptions.Item label="职业" span={10}>{patientRoute? patientRoute[0].vocation : ""}</Descriptions.Item>
                      <Descriptions.Item label="备注" span={10}>
                      {patientRoute? patientRoute[0].note : ""}
                      </Descriptions.Item>
                    </Descriptions>
                    <Divider orientation="left">行程</Divider>
                    {console.log("行程")}
                    {console.log(patientRoute)}
                    <Tabs defaultActiveKey="1" tabPosition={"top"} >
                      {/* {[...Array.from({ length: 30 }, (_, i) => i)].map(i => (
                        <TabPane tab={`Tab-${i}`} key={i} disabled={i === 28}>
                          Content of tab {i}
                        </TabPane>
                      ))} */}
                      { patientRoute?
                        patientRoute[0].route.map((e,i)=>(
                          <TabPane tab={e[0]} key={i} disabled={i === 28}>
                            <Descriptions title=""  bordered>
                            {e.map((r,j)=>(
                              j==0? "":(
                                <Descriptions.Item label={r[2]} span={10}>{r[0]}</Descriptions.Item>
                              )
                            ))}
                            </Descriptions>
                          </TabPane>
                        ))  :""
                      }
                    </Tabs>
                </Col>
                <Col span={14}>
                    {/* <Col span={24}>
                        <Row> </Row>
                        <div style={{height:"450px",width:"100%",marginLeft:'1%',backgroundColor:"white"}}>
                            <Row></Row>
                            <Map 
                              amapkey={"c640403f7b166ffb3490f7d2d4ab954c"}
                              events={{
                                created: (ins: any) => {
                                  if(!amap)
                                    dispatch(ActSetState({amap: (window as any).AMap }))
                                  console.log(11122)
                                }
                              }}>
                              <AMapShowedMarker/>
                            </Map>
                        </div>
                    </Col> */}
                    <Col span={24}>
                        <Row style={{marginLeft:'1%'}}>
                            <Col span={24}>
                                <Card title={"确诊患者关联地点查询"}>
                                    <div className={sty.tableContainer}>
                                        <Row style={{marginTop:'10px',marginLeft:'15px'}} gutter={4}>
                                            <Col span={1.5} style={{marginTop:'5px'}}>时间差:</Col>
                                            <Col span={2.5}>
                                                <Select defaultValue="01" style={{ width: 70 }} onSelect={(value)=>setTO(value)}>
                                                    <Option value="01">小于</Option>
                                                    <Option value="02">大于</Option>
                                                    <Option value="03">等于</Option>
                                                </Select>
                                            </Col>
                                            <Col span={2}>
                                                <Slider max={60} value={timeValue} onChange={(v:any)=>{setTV(v)}} defaultValue={1} />
                                            </Col>
                                            <Col span={2}>
                                              <InputNumber value={timeValue} style={{ width:60 }} onChange={(e)=>setTV(e as number)}/>
                                            </Col>
                                            <Col span={3}>
                                              <Select defaultValue={1} style={{ width: 70,marginLeft:'10px' }} onSelect={(value)=>setTU(value)}>
                                                    <Option value={1}>分钟</Option>
                                                    <Option value={60}>小时</Option>
                                              </Select>
                                            </Col>
                                            <Col span={1}></Col>
                                            <Col span={1.5} style={{marginTop:'5px'}}>距离差:</Col>
                                            <Col span={2.5}>
                                                <Select defaultValue="01" style={{ width: 70 }} onSelect={(value)=>setDO(value)}>
                                                    <Option value="01">小于</Option>
                                                    <Option value="02">大于</Option>
                                                    <Option value="03">等于</Option>
                                                </Select>
                                            </Col>
                                            <Col span={2}>
                                                <Slider max={1000} value={distanceValue} defaultValue={1} onChange={(v:any)=>{setDV(v)}} />
                                            </Col>
                                            <Col span={2}>
                                              <InputNumber value={distanceValue} style={{ width:60}} onChange={(v)=>setDV(v as number)}/>
                                            </Col>
                                            <Col span={3}>
                                              <Select defaultValue={1} style={{ width: 70 ,marginLeft:'10px'}} onSelect={(value)=>setDU(value)}>
                                                    <Option value={1}>米</Option>
                                                    <Option value={1000}>千米</Option>
                                              </Select>
                                            </Col>
                                        </Row>
                                        <Table pagination={false} dataSource={dataSource} columns={columns} />
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    <Divider/>
                    <Col span={24}>
                        <Card title={"人物关系图"} style={{marginLeft:'15px'}}>
                          <div style={{height:"500px"}}>
                             <div id={'viz'} className={sty.neovis} style={{ width: "100%", height: "100%" }}>
                              {rmap}
                             </div>
                          </div>
                        </Card>
                    </Col>
                </Col>
            </Row>
        </MainLayout>
    )
}