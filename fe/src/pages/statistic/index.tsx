import { Card, Checkbox, Col, Divider, Row,Carousel, List, Avatar } from "antd"
import React, { useEffect, useState } from "react"
import MainLayout from "../../components/MainLayoout/PageLayout"
import sty from './index.module.scss'
import ReactECharts from 'echarts-for-react';
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import cloneDeep from 'lodash.clonedeep';
import {Map} from "react-amap"
import { useTypedSelector } from '../../lib/store'
import { heatmapData } from "../../components/AMapCom";
import HeatMap from "../../components/Heatmap/heat";

export default function Statistic() {
    //热力图
    const amap = useTypedSelector(e => e.PAGlobalReducer.amap)
    const visible = true;
    const radius = 30;
    const gradient = {
        '0.4':'rgb(125,255,0)',
        '0.65':'rgb(255,255,7)',
        '0.85':'rgb(255,160,0)',
        '1.0':'rgb(255,0,0)'
    };
    const zooms = [3, 18];
    const dataSet = {
        data: heatmapData,
        max: 100
    }
    const pluginProps = {
        visible,
        radius,
        gradient,
        zooms,
        dataSet
    }

    //折线图
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
    ]
    const getTempOption =()=> {
        let option = {
            title:{
                text:'北京各区病例新增情况'
            },
            legend: {
                top:"20px",
                data: ['北京新发地', '北京顺义', '北京大兴']
            },
            xAxis:{
                data:['1','2','3','4','5','6','7','8','9','10','11','12','13','14']
            },
            yAxis:{
                type:'value',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            series: allTempSeties
        }
        return option
    }

    //柱状图
    const BarOption = {
        title: {
            text: '柱状图'
        },
        tooltip: {},
        legend: {
            data:['销量']
        },
        xAxis: {
            data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    };

    //雷达图
    const RadarOption = {
        title: {
            text: '各区安全系数'
        },
        tooltip: {},
        legend: {
            top:"20px",
            data: ['顺义区', '西城区','海淀区'],
            orient:'vertical',
            left: 'left'
        },
        radar: {
            //shape: 'circle',

            indicator: [
                { name: '疫苗接种率', max: 100},
                { name: '政策执行度', max: 100},
                { name: '信息技术', max: 100},
                { name: '口罩佩戴率', max: 100},
                { name: '健康指数', max: 100},
                { name: '环境卫生', max: 100}
            ]
        },
        series: [{
            name: '顺义区 vs 西城区 vs 海淀',
            type: 'radar',
            // areaStyle: {normal: {}},
            data : [
                {
                    value : [90, 100, 80, 85, 88, 90],
                    name : '顺义区'
                },
                {
                    value : [100, 90, 80, 95, 80, 85],
                    name : '西城区'
                },
                {
                    value : [85, 80, 90, 90, 90, 100],
                    name : '海淀区'
                }
            ]
        }]
    };

    //饼图
    const PieOption = {
        title : {
            text: '各年龄段占比',
            subtext: '',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        /*legend: {
            orient: 'vertical',
            left: 'left',
            data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
        },*/
        series : [
            {
                name: '年龄段',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'0-14岁'},
                    {value:310, name:'15-35岁'},
                    {value:234, name:'35-50岁'},
                    {value:135, name:'50-65岁'},
                    {value:1548, name:'65+岁'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    const PieOption01 = {
        title : {
            text: '北京各区病例占比',
            subtext: '',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        /*legend: {
            orient: 'vertical',
            left: 'left',
            data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
        },*/
        series : [
            {
                name: '各区',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:15, name:'海淀区'},
                    {value:10, name:'大兴区'},
                    {value:5, name:'东城区'},
                    {value:10, name:'西城区'},
                    {value:60, name:'顺义区'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    //动态加载折线图
    const DEFAULT_OPTION = {
        title: {
            text:'动态监测',
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['新增确诊人数', '新增疑似人数']
        },
        toolbox: {
            show: true,
            feature: {
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
            }
        },
        grid: {
            top: 60,
            left: 30,
            right: 60,
            bottom:30
        },
        dataZoom: {
            show: false,
            start: 0,
            end: 100
        },
        visualMap: {
            show: false,
            min: 0,
            max: 1000,
            color: ['#BE002F', '#F20C00', '#F00056', '#FF2D51', '#FF2121', '#FF4C00', '#FF7500',
                '#FF8936', '#FFA400', '#F0C239', '#FFF143', '#FAFF72', '#C9DD22', '#AFDD22',
                '#9ED900', '#00E500', '#0EB83A', '#0AA344', '#0C8918', '#057748', '#177CB0']
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: true,
                data: (function (){
                    let now = new Date();
                    let res = [];
                    let len = 50;
                    while (len--) {
                        res.unshift(now.toLocaleTimeString().replace(/^\D*/,''));
                        now = new Date(now.getFullYear()-2000);
                    }
                    return res;
                })()
            },
            {
                type: 'category',
                boundaryGap: true,
                data: (function (){
                    let res = [];
                    let len = 50;
                    while (len--) {
                        res.push(50 - len + 1);
                    }
                    return res;
                })()
            }
        ],
        yAxis: [
            {
                type: 'value',
                scale: true,
                //name: '人数',
                max: 20,
                min: 0,
                boundaryGap: [0.2, 0.2]
            },
            {
                type: 'value',
                scale: true,
                //name: '预购量',
                max: 1200,
                min: 0,
                boundaryGap: [0.2, 0.2]
            }
        ],
        series: [
            {
                name:'新增确诊人数',
                type:'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        barBorderRadius: 4,
                    }
                },
                animationEasing: 'elasticOut',
                animationDelay: function (idx:number) {
                    return idx * 10;
                },
                animationDelayUpdate: function (idx:number) {
                    return idx * 10;
                },
                data:(function (){
                    let res = [];
                    let len = 50;
                    while (len--) {
                        res.push(Math.round(Math.random() * 1000).toFixed(1));
                    }
                    return res;
                })()
            },
            {
                name:'新增疑似人数',
                type:'line',
                data:(function (){
                    let res = [];
                    let len = 0;
                    while (len < 50) {
                        res.push((Math.random()*10 + 5).toFixed(1));
                        len++;
                    }
                    return res;
                })()
            }
        ]
    };
    const [option, setOption] = useState(DEFAULT_OPTION);
    function fetchNewData() {
        const axisData = (new Date()).toLocaleTimeString().replace(/^\D*/,'');
        const newOption = cloneDeep(option); // immutable
        newOption.title.text = '动态监测'/* + (new Date().getSeconds())*/;
        const data0 = newOption.series[0].data;
        const data1 = newOption.series[1].data;
        data0.shift();
        data0.push(Math.round(Math.random() * 1000).toFixed(1));
        data1.shift();
        data1.push((Math.random() * 10 + 5).toFixed(1));
        newOption.xAxis[0].data.shift();
        newOption.xAxis[0].data.push(axisData);
        newOption.xAxis[1].data.shift();
        setCount(count++);
        newOption.xAxis[1].data.push(count);
        setOption(newOption);
    }
    let [count,setCount]=useState<number>(50);
    useEffect(() => {
        const timer = setInterval(() => {
            fetchNewData();
        }, 10000);
        return () => clearInterval(timer);
    });

    //走马灯
    const listData1 = [
        {
            title: 'Ant Design Title 1',
            description:'1111111111111111',
            url:'https://ant.design',
        },
        {
            title: 'Ant Design Title 2',
            description:'222222222222222222',
            url:'https://ant.design',
        },
        {
            title: 'Ant Design Title 3',
            description:'3333333333333333333',
            url:'https://ant.design',
        },
        {
            title: 'Ant Design Title 4',
            description:'4444444444444444444',
            url:'https://ant.design',
        },
    ];
    const listData2 = [
        {
            title: 'Ant Design Title 11',
            description:'1111111111111111',
            url:'https://www.baidu.com/',
        },
        {
            title: 'Ant Design Title 22',
            description:'222222222222222222',
            url:'https://www.baidu.com/',
        },
        {
            title: 'Ant Design Title 33',
            description:'3333333333333333333',
            url:'https://www.baidu.com/',
        },
        {
            title: 'Ant Design Title 44',
            description:'4444444444444444444',
            url:'https://www.baidu.com/',
        },
    ];
    const listData3 = [
        {
            title: 'Ant Design Title 13',
            description:'1111111111111111',
            url:'http://localhost:3000/statistic',
        },
        {
            title: 'Ant Design Title 23',
            description:'222222222222222222',
            url:'http://localhost:3000/statistic',
        },
        {
            title: 'Ant Design Title 33',
            description:'3333333333333333333',
            url:'http://localhost:3000/statistic',
        },
        {
            title: 'Ant Design Title 43',
            description:'4444444444444444444',
            url:'http://localhost:3000/statistic',
        },
    ];
    const listData4 = [
        {
            title: 'Ant Design Title 14',
            description:'1111111111111111',
            url:'http://localhost:3000/statistic',
        },
        {
            title: 'Ant Design Title 24',
            description:'222222222222222222',
            url:'http://localhost:3000/statistic',
        },
        {
            title: 'Ant Design Title 34',
            description:'3333333333333333333',
            url:'http://localhost:3000/statistic',
        },
        {
            title: 'Ant Design Title 44',
            description:'4444444444444444444',
            url:'http://localhost:3000/statistic',
        },
    ];

    return (
        <MainLayout>
            <Row style={{marginRight:'15px',marginLeft:'15px'}}>
                <Col span={6}>
                    <div className={sty.leftBar}>
                        <ReactECharts
                            option={PieOption}
                            style={{ height: '50%' }}
                        />
                        <div className={sty.bottomPie}>
                            <ReactECharts
                                option={PieOption01}
                                style={{ height: '100%' }}
                            />
                        </div>
                    </div>
                </Col>
                <Col span={12}>
                    <div className={sty.heatMap}>
                        {/*<ReactECharts
                            option={option}
                            style={{ height: '100%' }}
                        />*/}
                        <Map amapkey={"c640403f7b166ffb3490f7d2d4ab954c"}>
                            <HeatMap {...pluginProps}/>
                        </Map>
                    </div>
                </Col>
                <Col span={6}>
                    <div className={sty.rightBar}>
                        <Carousel dotPosition={'right'} autoplay>
                            <div className={sty.play}>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={listData1}
                                    renderItem={item => (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={<a href={item.url}>{item.title}</a>}
                                                description={item.description}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </div>
                            <div className={sty.play}>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={listData2}
                                    renderItem={item => (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={<a href={item.url}>{item.title}</a>}
                                                description={item.description}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </div>
                            <div className={sty.play}>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={listData3}
                                    renderItem={item => (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={<a href={item.url}>{item.title}</a>}
                                                description={item.description}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </div>
                            <div className={sty.play}>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={listData4}
                                    renderItem={item => (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={<a href={item.url}>{item.title}</a>}
                                                description={item.description}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </Carousel>
                    </div>
                </Col>
            </Row>

            <Row style={{marginTop:'5px',marginRight:'15px',marginLeft:'15px'}}>
                <Col span={6}>
                    <div className={sty.bottomLeft}>
                        <ReactECharts option={getTempOption()} style={{ height: '100%' }}/>
                    </div>
                </Col>
                <Col span={12}>
                    <div className={sty.bottomMid}>
                        <ReactECharts
                            option={option}
                            style={{ height: '100%' }}
                        />
                    </div>
                </Col>
                <Col span={6}>
                    <div className={sty.bottomRight}>
                        {/*<ReactECharts
                            option={BarOption}
                            style={{ height: '100%' }}
                            opts={{ renderer: 'svg' }}
                        />*/}
                        <ReactECharts
                            option={RadarOption}
                            style={{ height: '100%' }}
                        />
                    </div>
                </Col>
            </Row>
        </MainLayout>
    )
}
