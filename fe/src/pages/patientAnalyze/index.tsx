import { Col, Divider, Popover, Row, Select, Slider, Table } from "antd";
import React from "react";
import MainLayout from "../../components/MainLayoout/PageLayout";
import Routes from "../../components/Routes";
import sty from './index.module.scss'
import { Card } from "../addroute";
import { UserOutlined } from "@ant-design/icons";
const { Option } = Select;

export default function PatientAnalyze(){
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
          time:'2021-01-01-12:00:00',
          loca: '顺义华联超市',
          no: '病例1',
          asso_time:'2021-01-01-12:20:00',
          asso_loca:'顺义华联超市',
          dist: '100m'
        },
        {
            key: '2',
            name: '杨某某',
            time:'2021-01-04-08:00:00',
            loca: '顺义金马工业园',
            no: '病例10',
            asso_time:'2021-01-01-09:20:00',
            asso_loca:'金马工业园B区',
            dist: '450m'
        },
        {
            key: '3',
            name: '王某某',
            time:'2021-01-08-16:00:00',
            loca: '清华大学',
            no: '病例17',
            asso_time:'2021-01-01-16:30:00',
            asso_loca:'五道口地铁站',
            dist: '1.2km'
          },
    ];
    const state={
        bottom: "None"
    }
    return(
        <MainLayout>
            <Row>
                <Col span={6} className={sty.personCol}>
                    <div className={sty.personHeader}>
                        <UserOutlined/>
                        <div>
                            徐某某
                        </div>
                    </div>
                    <Divider/>
                    <Routes/>
                </Col>
                <Col span={18}>
                    <Col span={24}>
                        <div style={{height:"450px",width:"100%",backgroundColor:"white"}}>
                            <div className={sty.picture}>
                                <Row></Row>
                                <Popover 
                                    content={
                                        <>
                                        <h5>风险系数评估:90</h5>
                                        <h5>到达时间：2021-01-01,12:00:00</h5>
                                        <br/>
                                        <h5>经停时间:60min</h5>
                                        <br/>
                                        <h5>确诊患者经停人次:5</h5>
                                        <br/>
                                        <h5>该时段人流量:大</h5>
                                        <br/>
                                        <h5>行为相似患者:</h5>
                                        <br/>
                                        <h5>病例2-乘坐电梯感染</h5>
                                        <br/>
                                        <h5>病例8-现金交易感染</h5>
                                        <br/>
                                        </>
                                    } 
                                    title={
                                        <h3 style={{color:"red"}}>顺义华联超市</h3>
                                    } 
                                    trigger="click"
                                    placement="bottom"
                                >
                                    <div className={sty.click}></div>
                                </Popover>
                            </div>
                        </div>
                    </Col>
                    <Divider/>
                    <Col span={24}>
                        <Row>
                            <Col span={16}>
                                <Card title={"确诊患者关联地点查询"}>
                                    <div style={{height:"100%",width:"70%"}}>
                                        <Row>
                                            <Col span={3}>时间差:</Col>
                                            <Col span={3}>
                                                <Select defaultValue="01" style={{ width: 70 }}>
                                                    <Option value="01">小于</Option>
                                                    <Option value="02">大于</Option>
                                                    <Option value="03">等于</Option>
                                                </Select>
                                            </Col>
                                            <Col span={3}>
                                                <Slider defaultValue={100}/>
                                            </Col>
                                            <Col span={3}>
                                            <Select defaultValue="01" style={{ width: 70 }}>
                                                    <Option value="01">分钟</Option>
                                                    <Option value="02">小时</Option>
                                                </Select>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={3}>距离差:</Col>
                                            <Col span={3}>
                                                <Select defaultValue="01" style={{ width: 70 }}>
                                                    <Option value="01">小于</Option>
                                                    <Option value="02">大于</Option>
                                                    <Option value="03">等于</Option>
                                                </Select>
                                            </Col>
                                            <Col span={3}>
                                                <Slider defaultValue={100}/>
                                            </Col>
                                            <Col span={3}>
                                            <Select defaultValue="01" style={{ width: 70 }}>
                                                    <Option value="01">米</Option>
                                                    <Option value="02">千米</Option>
                                                </Select>
                                            </Col>
                                        </Row>
                                        <Table pagination={false} dataSource={dataSource} columns={columns} />
                                    </div>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card title={"人物关系图"}>
                                    <div style={{height:"100%",width:"30%"}}>hhh</div>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Col>
            </Row>
        </MainLayout>
    )
}