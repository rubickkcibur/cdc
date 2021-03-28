import { Button, Col, Divider, Popover, Row, Select, Slider, Table } from "antd";
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
const { Option } = Select;

export default function PatientAnalyze(){
    const loadedBasic = useTypedSelector(e=>e.PAGlobalReducer.loadedBasic)
    const [sliderValue,setSV] = useState<Number>(1)
    const [sliderValue2,setSV2] = useState<Number>(1)
    const amap = useTypedSelector(e=>e.PAGlobalReducer.amap)
    const dispatch = useDispatch()
    function draw(e: string) {
        var config;
        if (e == "location") {
          config = {
            encryption: "ENCRYPTION_OFF",
            encripted: "ENCRYPTION_OFF",
            encrypted: "ENCRYPTION_OFF",
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
            encryption: "ENCRYPTION_OFF",
            encripted: "ENCRYPTION_OFF",
            encrypted: "ENCRYPTION_OFF",
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
          title: '关联病例编号',
          dataIndex: 'no',
          key: 'no',
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
    const dataSource = [
        {
          key: '1',
          name: '刘某',
          time:'2020-12-23-11:00:00',
          loca: '顺义华联超市',
          no: '病例1',
          asso_time:'2020-12-23-11:20:00',
          asso_loca:'顺义华联超市',
          dist: '100m'
        },
        {
            key: '2',
            name: '杨某某',
            time:'2020-12-21-08:50:00',
            loca: '顺义金马工业园',
            no: '病例10',
            asso_time:'2020-12-21-09:20:00',
            asso_loca:'金马工业园B区',
            dist: '450m'
        },
        {
          key: '3',
          name: '王某某',
          time:'2020-12-22-16:00:00',
          loca: '清华大学',
          no: '病例17',
          asso_time:'2020-12-22-16:40:00',
          asso_loca:'五道口地铁站',
          dist: '800m'
        },
    ];
    return(
        <MainLayout>
            <Row>
                <Col span={6} className={sty.personCol}>
                    <div className={sty.personHeader}>
                        <UserOutlined style={{marginTop:'10px',marginLeft:'5px',marginRight:'5px',fontSize:'18px'}}/>
                        <div style={{marginTop:'2px',fontSize:'20px'}}>
                            {loadedBasic?.name}
                        </div>
                    </div>
                    <Divider/>
                    <div style={{height: "86vh"}}>
                      <Routes/>
                    </div>
                </Col>
                <Col span={18}>
                    <Col span={24}>
                        <Row> </Row>
                        <div style={{height:"450px",width:"95%",marginLeft:'5%',backgroundColor:"white"}}>
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
                            {/* <div className={sty.picture}>
                                <Row></Row>
                                <Popover 
                                    content={
                                      <div>
                                        <div style={{display:"flex",flexDirection: "row",alignItems:"center"}}>
                                          <div><span style={{fontWeight:'bold'}}>风险系数评估:</span></div>
                                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                          <div style={{fontSize: "27px",color: "red"}}>90</div>
                                        </div>
                                        <div><span style={{fontWeight:'bold'}}>到&nbsp;&nbsp;达&nbsp;&nbsp;时&nbsp;&nbsp;间： 2021-01-01,12:00:00</span></div>
                                        <div><span style={{fontWeight:'bold'}}>经&nbsp;&nbsp;停&nbsp;&nbsp;时&nbsp;&nbsp;间： 60min</span></div>
                                        <div><span style={{fontWeight:'bold'}}>该时段人流量： 大</span></div>
                                        <div><span style={{fontWeight:'bold'}}>行为相似患者：</span>
                                            <a style={{textDecoration:"underline",color:"blue"}}>病例2-乘坐电梯感染</a>
                                            ，
                                            <a style={{textDecoration:"underline",color:"blue"}}>病例8-现金交易感染</a>
                                        </div>
                                      </div>
                                    } 
                                    title={
                                        <h3 style={{color:"red"}}>顺义华联超市</h3>
                                    } 
                                    trigger="click"
                                    placement="bottom"
                                >
                                    <div className={sty.click}></div>
                                </Popover>
                            </div> */}
                        </div>
                    </Col>
                    <Divider/>
                    <Col span={24}>
                        <Row style={{marginLeft:'5%'}}>
                            <Col span={14}>
                                <Card title={"确诊患者关联地点查询"}>
                                    <div style={{height:"400px"}}>
                                        <Row style={{marginTop:'10px',marginLeft:'15px'}}>
                                            <Col span={2} style={{marginTop:'5px'}}>时间差:</Col>
                                            <Col span={3}>
                                                <Select defaultValue="01" style={{ width: 70 }}>
                                                    <Option value="01">小于</Option>
                                                    <Option value="02">大于</Option>
                                                    <Option value="03">等于</Option>
                                                </Select>
                                            </Col>
                                            <Col span={3}>
                                                <Slider max={60} onChange={(v:any)=>{setSV(v)}} defaultValue={1}/>
                                            </Col>
                                            <Col span={3}>
                                            <Select defaultValue="01" style={{ width: 70,marginLeft:'10px' }}>
                                                    <Option value="01">分钟</Option>
                                                    <Option value="02">小时</Option>
                                                </Select>
                                            </Col>
                                        </Row>
                                        <Row style={{marginTop:'10px',marginLeft:'15px'}}>
                                            <Col span={2} style={{marginTop:'5px'}}>距离差:</Col>
                                            <Col span={3}>
                                                <Select defaultValue="01" style={{ width: 70 }}>
                                                    <Option value="01">小于</Option>
                                                    <Option value="02">大于</Option>
                                                    <Option value="03">等于</Option>
                                                </Select>
                                            </Col>
                                            <Col span={3}>
                                                <Slider max={1000} defaultValue={1} onChange={(v:any)=>{setSV2(v)}}/>
                                            </Col>
                                            <Col span={3}>
                                            <Select defaultValue="01" style={{ width: 70 ,marginLeft:'10px'}}>
                                                    <Option value="01">米</Option>
                                                    <Option value="02">千米</Option>
                                                </Select>
                                            </Col>
                                        </Row>
                                        <Table pagination={false} dataSource={
                                            (sliderValue > 40 && sliderValue2 > 800)?dataSource:
                                            (sliderValue > 30 && sliderValue2 > 450)?dataSource.slice(0,2):
                                            (sliderValue > 20 && sliderValue2 > 100)?dataSource.slice(0,1):[]
                                        } columns={columns} />
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