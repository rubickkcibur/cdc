import { Card, Checkbox, Col, Divider, Dropdown, Menu, Row } from "antd"
import React, { useEffect, useState } from "react"
import MainLayout from "../../components/MainLayoout/PageLayout"
import sty from './index.module.scss'
import ReactECharts from 'echarts-for-react';
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { DownOutlined } from "@ant-design/icons";

export default function Pagehistory() {
    const globalPic = [sty.global01,sty.global02,sty.global03,sty.global04]
    const [pic,setP] = useState<any>(0)

    const allTempSeties = [
        {
            name:"北京新发地",
            type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
            data:[22.2,24.7,29,27.3,25.1,25,27.9,29.6,27.2,27,26.6,27.6,28.9,29.5],
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
            data:[1.8,-1,-1.9,-2.4,-1.3,-1.3,-10.2,-10.1,-5.4,-6.2,-5.4,-5.9,-5.4,-7.5],
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
            data:[-3,-2.5,-6.6,-4.7,-2.3,-1.5,-3.1,-1.8,-1,-3.1,-1,-3.8,-5.7,-2.5],
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
            data:[-2.2,-2.9,-3.2,-4.8,-7.8,-9.7,-4.5,-1.7,-1,1.2,5.3,4.9,1.5,1.9],
            itemStyle : {  
                normal : {  
                    color:'#ee6666',  
                    lineStyle:{  
                        color:'#ee6666'  
                    }  
                }  
            },  
        },
        {
            name:"上海黄埔",
            type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
            data:[13.8,10.6,7.5,7.6,11.3,8.5,7.9,6.9,4.1,7.8,11.2,4.9,5.5,3.9],
            itemStyle : {  
                normal : {  
                    color:'#1E1F04',  
                    lineStyle:{  
                        color:'#1E1F04'  
                    }  
                }  
            },  
        },
        {
            name:"英格兰东南",
            type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
            data:[12,12,13,11,10,10,11,14,12,10,10,12,13,13],
            itemStyle : {  
                normal : {  
                    color:'#E31FE2',  
                    lineStyle:{  
                        color:'#E31FE2'  
                    }  
                }  
            },  
        },
        {
            name:"美国科罗拉多",
            type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
            data:[-8,-7,-9,-7,-4.5,-16,-11.5,-6,-5,-8.5,-10.5,-12,-13,-8.5],
            itemStyle : {  
                normal : {  
                    color:'#6EA358',  
                    lineStyle:{  
                        color:'#6EA358'  
                    }  
                }  
            },  
        },
        {
            name:"日本东京",
            type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
            data:[7.5,6.5,7.5,8,6.5,6.5,3.5,4.5,3,4,5.5,7,8.5,7],
            itemStyle : {  
                normal : {  
                    color:'#1bbaff',  
                    lineStyle:{  
                        color:'#1bbaff'  
                    }  
                }  
            },  
        },
    ]
    const allHumidSeties = [
        {
            name:"北京新发地",
            type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
            data:[55,52,49,51,48,53,52,47,52,54,60,50,49,46],
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
            data:[36,42,39,41,35,40,44,37,41,43,38,45,46,43],
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
            data:[40,46,41,47,38,48,50,47,42,48,45,39,48,47],
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
            data:[34,38,44,42,48,40,35,38,43,44,39,38,40,36],
            itemStyle : {  
                normal : {  
                    color:'#ee6666',  
                    lineStyle:{  
                        color:'#ee6666'  
                    }  
                }  
            },  
        },
        {
            name:"上海黄埔",
            type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
            data:[60,55,63,64,62,59,61,58,64,66,61,54,59,62],
            itemStyle : {  
                normal : {  
                    color:'#1E1F04',  
                    lineStyle:{  
                        color:'#1E1F04'  
                    }  
                }  
            },  
        },
        {
            name:"英格兰东南",
            type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
            data:[82,75,80,86,84,85,81,78,82,83,86,83,84,79],
            itemStyle : {  
                normal : {  
                    color:'#E31FE2',  
                    lineStyle:{  
                        color:'#E31FE2'  
                    }  
                }  
            },  
        },
        {
            name:"美国科罗拉多",
            type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
            data:[73,78,75,70,72,74,70,72,68,70,73,76,74,71],
            itemStyle : {  
                normal : {  
                    color:'#6EA358',  
                    lineStyle:{  
                        color:'#6EA358'  
                    }  
                }  
            },  
        },
        {
            name:"日本东京",
            type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
            data:[59,60,63,61,58,55,59,62,58,56,68,57,54,56],
            itemStyle : {  
                normal : {  
                    color:'#1bbaff',  
                    lineStyle:{  
                        color:'#1bbaff'  
                    }  
                }  
            },  
        },
    ]
      

    const getTempOption =()=> {
        let option = {
            legend: {
                data: ['北京新发地', '北京顺义', '北京大兴', '河北石家庄',"上海黄埔","英格兰东南","美国科罗拉多","日本东京"]
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
                data: ['北京新发地', '北京顺义', '北京大兴', '河北石家庄',"上海黄埔","英格兰东南","美国科罗拉多","日本东京"]
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
            <Row style={{height:'925px'}}>
                <Col span={10} className={sty.statistic}>
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
