import { Card, Checkbox, Col, Divider, Dropdown, Menu, Row } from "antd"
import React, { useEffect, useState } from "react"
import MainLayout from "../../components/MainLayoout/PageLayout"
import sty from './index.module.scss'
import ReactECharts from 'echarts-for-react';
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { DownOutlined } from "@ant-design/icons";
import { useTypedSelector } from "../../lib/store";


export default function Pagehistory() {
    const globalPic = [sty.global01,sty.global02,sty.global03,sty.global04]
    const [pic,setP] = useState<any>(0)
    const epidemics = useTypedSelector(e=>e.PAGlobalReducer.epidemics)

    const colorPanel = ['#000000','#003399','#cc0033','#cccc00','#336633','#0099cc','#99cc00','#cc6600','#ffcccc']
    const allTempSeties = epidemics?.map((e:any,idx:any)=>({
        name:e.name,
        type:'line',
        data:e.temprature,
        emphasis: {focus: 'series'},
        itemStyle:{
            normal:{
                color:colorPanel[idx%colorPanel.length],
                lineStyle:{
                    color:colorPanel[idx%colorPanel.length]
                }
            }
        }
    }))
    const allHumidSeties = epidemics?.map((e:any,idx:any)=>({
        name:e.name,
        type:'line',
        data:e.humidity?.map((e:any)=>(e*100)),
        emphasis: {focus: 'series'},
        itemStyle:{
            normal:{
                color:colorPanel[idx%colorPanel.length],
                lineStyle:{
                    color:colorPanel[idx%colorPanel.length]
                }
            }
        }
    }))
      

    const getTempOption =()=> {
        let option = {
            legend: {
                data: epidemics?.map((e:any)=>(e.name))
            },
            xAxis:{
                data:Array(30).fill(0).map((v,i) => i+1)
            },
            yAxis:{
                type:'value',
                axisLabel: {
                    formatter: '{value} °C'
                }
            },
            series: allTempSeties
        }
       return option
    }

    const getHumidOption =()=> {
        let option = {
            legend: {
                data: epidemics?.map((e:any)=>(e.name))
            },
            xAxis:{
                data:Array(30).fill(0).map((v,i) => i+1)
            },
            yAxis:{
                type:'value',
                axisLabel: {
                    formatter: '{value} %'
                }
            },
            series: allHumidSeties
        }
       return option
    }
    return (
        <MainLayout>
            <Row style={{height:'925px'}}>
                <Col span={10} className={sty.statistic}>
                    <Card title={<div><span className={sty.iconfont}>&#xe6de;</span>&nbsp;<span style={{fontSize:"20px"}}>温度走势图</span></div>}>
                        <Row>
                            <Col span={24}>
                                <ReactECharts option={getTempOption()}/>
                            </Col>
                        </Row>
                    </Card>
                    <Divider/>
                    <Card title={<div><span className={sty.iconfont}>&#xe918;</span>&nbsp;<span style={{fontSize:"20px"}}>湿度走势图</span></div>}>
                        <Row>
                            <Col span={24}>
                                <ReactECharts option={getHumidOption()}/>
                            </Col>
                        </Row>
                    </Card>

                </Col>
                <Col span={14}>
                    <div className={sty.FrameContainer}>
                        <div style={{display:"flex",flexDirection:"row",alignItems:"start",height:"55%",width:"90%"}}>
                            <div>
                                <Dropdown overlay={(
                                <Menu onClick={(e)=>{setP(e.key)}}> 
                                    <Menu.Item key={0}>
                                        北京顺义区疫情
                                    </Menu.Item>
                                    <Menu.Item key={1}>
                                        北京大兴区疫情
                                    </Menu.Item>
                                    <Menu.Item key={2}>
                                        北京新发地疫情
                                    </Menu.Item>
                                    <Menu.Item key={3}>
                                        河北石家庄疫情
                                    </Menu.Item>
                                </Menu>
                            )} trigger={['click']}>
                                <h2>{pic==0?"北京顺义区":pic==1?"北京大兴区":pic==2?"北京新发地":"河北石家庄"}<DownOutlined/></h2>
                            </Dropdown>
                            </div>
                            <div className={globalPic[pic]}/>
                        </div>
                        <Divider orientation="left" plain>
                            <h2>病毒基因型对比</h2>
                        </Divider>
                        <div className={sty.picture02}></div>
                    </div>
                </Col>
            </Row>
        </MainLayout>
    )
}
