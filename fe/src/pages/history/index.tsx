import { Card, Checkbox, Col, Divider, Row } from "antd"
import React, { useEffect, useState } from "react"
import MainLayout from "../../components/MainLayoout/PageLayout"
import sty from './index.module.scss'
import ReactECharts from 'echarts-for-react';
import { CheckboxValueType } from "antd/lib/checkbox/Group";

export default function Pagehistory() {
    const allTempSeties = [
        {
            name:"北京新发地",
            type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
            data:[-1.2,-3,-5.4,-2,-9,-11.5,-12.3,-3.6,0.1,1.1,0.3,-0.5,-1.6,-2.3],
            itemStyle : {  
                normal : {  
                    color:'#5470c6',  
                    lineStyle:{  
                        color:'#5470c6'  
                    }  
                }  
            },  
        },
        {
            name:"北京顺义",
            type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
            data:[-2.1,-3.3,-0.4,-2.9,-11.2,-9,-11.3,0.1,0.5,3.2,0.3,-0.9,-2.6,-4.3],
            itemStyle : {  
                normal : {  
                    color:'#91cc75',  
                    lineStyle:{  
                        color:'#91cc75'  
                    }  
                }  
            },  
        },
        {
            name:"北京大兴",
            type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
            data:[-2.1,-3.6,-4.5,2,4.5,-5.5,-11.3,-1.6,5.1,2.1,6.3,-1.5,-6.6,-3.3],
            itemStyle : {  
                normal : {  
                    color:'#fac858',  
                    lineStyle:{  
                        color:'#fac858'  
                    }  
                }  
            },  
        },
        {
            name:"河北石家庄",
            type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
            data:[-1.2,-11.5,4.5,-2,-4.5,6.5,11.3,1.6,-5.1,6.1,1.3,1.5,-7.6,-2.3],
            itemStyle : {  
                normal : {  
                    color:'#ee6666',  
                    lineStyle:{  
                        color:'#ee6666'  
                    }  
                }  
            },  
        },
    ]
    const allHumidSeties = [
        {
            name:"北京新发地",
            type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
            data:[60,61,66,70,72,75,70,56,57,59,63,61,59,50],
            itemStyle : {  
                normal : {  
                    color:'#5470c6',  
                    lineStyle:{  
                        color:'#5470c6'  
                    }  
                }  
            },  
        },
        {
            name:"北京顺义",
            type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
            data:[40,41,46,40,42,55,50,51,53,56,53,71,79,50],
            itemStyle : {  
                normal : {  
                    color:'#91cc75',  
                    lineStyle:{  
                        color:'#91cc75'  
                    }  
                }  
            },  
        },
        {
            name:"北京大兴",
            type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
            data:[70,61,66,50,32,55,54,57,51,52,51,61,59,70],
            itemStyle : {  
                normal : {  
                    color:'#fac858',  
                    lineStyle:{  
                        color:'#fac858'  
                    }  
                }  
            },  
        },
        {
            name:"河北石家庄",
            type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
            data:[60,51,46,59,42,65,64,52,59,51,53,71,69,50],
            itemStyle : {  
                normal : {  
                    color:'#ee6666',  
                    lineStyle:{  
                        color:'#ee6666'  
                    }  
                }  
            },  
        },
    ]
      

    const getTempOption =()=> {
        let option = {
            legend: {
                data: ['北京新发地', '北京顺义', '北京大兴', '河北石家庄']
            },
            xAxis:{
                data:['1','2','3','4','5','6','7','8','9','10','11','12','13','14']
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
                data: ['北京新发地', '北京顺义', '北京大兴', '河北石家庄']
            },
            xAxis:{
                data:['1','2','3','4','5','6','7','8','9','10','11','12','13','14']
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
            <Row>
                <Col span={12} className={sty.statistic}>
                    <Card title={"温度变化图"}>
                        <Row>
                            <Col span={24}>
                                <ReactECharts option={getTempOption()}/>
                            </Col>
                        </Row>
                    </Card>
                    <Divider/>
                    <Card title={"湿度变化图"}>
                        <Row>
                            <Col span={24}>
                                <ReactECharts option={getHumidOption()}/>
                            </Col>
                        </Row>
                    </Card>

                </Col>
                <Col span={12}>
                    <div className={sty.FrameContainer}>
                        <div className={sty.picture01}>
                            <div className={sty.picture02}>
                                </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </MainLayout>
    )
}
