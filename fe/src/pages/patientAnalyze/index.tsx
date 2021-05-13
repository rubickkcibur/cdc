import { Button, Col, Divider, Input, InputNumber, Popover, Row, Select, Slider, Statistic, Table } from "antd";
import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayoout/PageLayout";
import Routes from "../../components/Routes";
import sty from './index.module.scss'
import { Card } from "../addroute";
import { UserOutlined } from "@ant-design/icons";
import { useTypedSelector } from "../../lib/store";
import Const from "../../lib/constant";
import {Map} from "react-amap"
import { AMapShowedMarker } from "../../components/AMapMarker";
import { ActSetState } from "../../lib/state/global";
import { useDispatch } from "react-redux";
import { generate } from "rxjs";
const { Option } = Select;

export default function PatientAnalyze(){
    const loadedBasic = useTypedSelector(e=>e.PAGlobalReducer.loadedBasic)
    const loadedRelatedInfo = useTypedSelector(e=>e.PAGlobalReducer.loadedRelatedInfo)
    const [timeOp,setTO] = useState<string>("01")
    const [timeValue,setTV] = useState<number>(1)
    const [timeUnit,setTU] = useState<number>(1)
    const [distanceOp,setDO] = useState<string>("01")
    const [distanceValue,setDV] = useState<number>(1)
    const [distanceUnit,setDU] = useState<number>(1)
    const [dataSource,setDS] = useState<any[]>([])
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
    useEffect(() => {
        if (process.browser)
            draw("people")
    }, [loadedBasic])

    useEffect(()=>{
      setDS(generateDataSource())
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
      if (loadedRelatedInfo){
        const filter = loadedRelatedInfo.filter((e:any)=>(
          (timeOp == "01"?(e.time_interval < timeValue*timeUnit*60):
          timeOp == "02"?(e.time_interval > timeValue*timeUnit*60):
          (e.time_interval == timeValue*timeUnit*60))
          &&
          (distanceOp == "01"?(e.distance_interval*1000 < distanceValue*distanceUnit):
          distanceOp == "02"?(e.distance_interval*1000 < distanceValue*distanceUnit):
          (e.distance_interval*1000 == distanceValue*distanceUnit))
        ))
        return filter.map((e:any,idx:any)=>({
          key:String(idx),
          name:e.relate_basic.name,
          time:e.time,
          loca:e.location.name,
          asso_time:e.relate_time,
          asso_loca:e.relate_location.name,
          dist:e.distance_interval + "km"
        }))
      }else{
        return []
      }
    }
    return(
        <MainLayout>
            <Row>
                <Col span={8} className={sty.personCol}>
                    <div className={sty.personHeader}>
                        <UserOutlined style={{marginTop:'10px',marginLeft:'5px',marginRight:'5px',fontSize:'18px'}}/>
                        <div style={{marginTop:'2px',fontSize:'20px'}}>
                            {loadedBasic?.name}
                        </div>
                    </div>
                    <Divider/>
                    <div style={{height: "86vh",overflowY: "auto",overflowX:"auto"}}>
                      <Routes/>
                    </div>
                </Col>
                <Col span={16}>
                    <Col span={24}>
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
                    </Col>
                    <Divider/>
                    <Col span={24}>
                        <Row style={{marginLeft:'1%'}}>
                            <Col span={14}>
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
                            <Col span={10}>
                                <Card title={"人物关系图"} style={{marginLeft:'15px'}}>
                                    <div style={{height:"400px"}}>
                                        <div id={'viz'} className={sty.neovis} style={{ width: "100%", height: "100%" }}></div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Col>
            </Row>
        </MainLayout>
    )
}