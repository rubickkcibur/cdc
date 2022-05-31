import { Card, Checkbox, Col, Divider, Row,Carousel,Progress, List, Avatar,Select } from "antd"
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
import { DownOutlined } from "@ant-design/icons"
import dataFilter from "echarts/types/src/processor/dataFilter";

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
            data:[2,1,2,2,1,1,10,10,5,6,5,6,5,8],
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
            data:[3,3,7,5,2,2,3,2,1,3,1,4,6,3],
            itemStyle : {
                normal : {
                    color:'#fac858',
                    lineStyle:{
                        color:'#fac858'
                    }
                }
            },
        },
        /*{
            name:"W1",
            type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
            data:[43,42,32,38,27,65,58,34,55],
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
            name:"W2",
            type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
            data:[46,38,28,40,33,62,63,32,44],
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
            name:"W3",
            type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
            data:[51,42,34,40,35,66,63,33,40],
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
            name:"W4",
            type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
            data:[41,46,33,48,32,67,63,33,40],
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
            name:"首次交付时间",
            type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
            data:[190,98,56,47,31,33,27,32,24],
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
            name:"项目验收时间",
            type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
            data:[190,121,82,85,59,95,85,61,63],
            itemStyle : {
                normal : {
                    color:'#E31FE2',
                    lineStyle:{
                        color:'#E31FE2'
                    }
                }
            },
        }*/
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
        /*let option = {
            title:{
                text:'各轮次工作情况分析'
            },
            legend: {
                top:"20px",
                data: ['W1', 'W2', 'W3','W4','首次交付时间','项目验收时间']
            },
            xAxis:{
                data:['2','3','4','5','6','7','8','9','11']
            },
            yAxis:{
                type:'value',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            series: allTempSeties
        }*/
        return option
    }

    //柱状图
    const BarOption01 = {
        title: {
            text: '具体位置TOP5',
            subtext: ''
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['病例人数']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: ['**餐厅', '**公园', '**医院', '**小区', '**工厂']
        },
        series: [
            {
                name: '病例人数',
                type: 'bar',
                data: [3, 4, 7, 10, 11]
            }
        ]
    };
    const BarOption02 = {
        title: {
            text: '交通工具TOP5',
            subtext: ''
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['使用人数']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: ['出租车', '轮船', '飞机', '地铁', '公交车']
        },
        series: [
            {
                name: '使用人数',
                type: 'bar',
                data: [2,5,9,10,13]
            }
        ]
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
    const { Option } = Select;
    const [whichType,setWhichType]=useState<string>("1")
    function handleChange(value:string) {
        console.log(`selected ${value}`);
        setWhichType(value);
    }
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
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['0-14岁','15-35岁','35-50岁','50-65岁','65+岁']
        },
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
            text: '各职业病例占比',
            subtext: '',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['司机','工厂员工','餐厅员工','物流员工','外贸人员']
        },
        series : [
            {
                name: '各职业',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:15, name:'司机'},
                    {value:10, name:'工厂员工'},
                    {value:5, name:'餐厅员工'},
                    {value:10, name:'物流员工'},
                    {value:60, name:'外贸人员'}
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
    const PieOption02 = {
        title : {
            text: '各类地点病患出现',
            subtext: '',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['超市','宾馆','医院','公园','餐厅']
        },
        series : [
            {
                name: '地点',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'超市'},
                    {value:310, name:'宾馆'},
                    {value:234, name:'医院'},
                    {value:135, name:'公园'},
                    {value:1548, name:'餐厅'}
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
    const PieOption03 = {
        title : {
            text: '北京各区病例占比',
            subtext: '',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['海淀区','大兴区','东城区','西城区','顺义区']
        },
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
            title: '·北京4月13日无新增新冠肺炎确诊病例 2021-04-14',
            description:'',
            url:'http://wjw.beijing.gov.cn/xwzx_20031/wnxw/202104/t20210414_2354783.html',
        },
        {
            title: '·市卫生健康委召开儿童口腔保健服务工作会议 2021-04-13',
            description:'',
            url:'http://wjw.beijing.gov.cn/xwzx_20031/wnxw/202104/t20210413_2353391.html',
        },
        {
            title: '·北京4月12日无新增新冠肺炎确诊病例 2021-04-13',
            description:'',
            url:'http://wjw.beijing.gov.cn/xwzx_20031/wnxw/202104/t20210413_2353260.html',
        },
        {
            title: '·北京4月11日新增1例境外输入确诊病例 2021-04-12',
            description:'',
            url:'http://wjw.beijing.gov.cn/xwzx_20031/wnxw/202104/t20210412_2351703.html',
        },
        {
            title: '·北京4月10日新增1例境外输入确诊病例 2021-04-11',
            description:'',
            url:'http://wjw.beijing.gov.cn/xwzx_20031/wnxw/202104/t20210411_2351624.html',
        },
        {
            title: '·北京4月9日新增1例境外输入确诊病例2021-04-10',
            description:'',
            url:'http://wjw.beijing.gov.cn/xwzx_20031/wnxw/202104/t20210410_2351523.html',
        },
    ];
    const listData2 = [
        {
            title: '·重温党史，回望过往的奋斗路眺望前方的奋进路',
            description:'',
            url:'http://wjw.beijing.gov.cn/xwzx_20031/jcdt/202104/t20210414_2355743.html',
        },
        {
            title: '·优化流程，佑安医院满足群众对新冠核酸检测的多种需求',
            description:'',
            url:'http://wjw.beijing.gov.cn/xwzx_20031/jcdt/202104/t20210414_2355726.html',
        },
        {
            title: '·真情讲述，那一年我在抗击“非典”一线入党',
            description:'',
            url:'http://wjw.beijing.gov.cn/xwzx_20031/jcdt/202104/t20210414_2355712.html',
        },
        {
            title: '·北京妇产医院保健党支部开展学习党史活动',
            description:'',
            url:'http://wjw.beijing.gov.cn/xwzx_20031/jcdt/202104/t20210414_2355661.html',
        },
        {
            title: '·北京市首家互联网医院正式获批',
            description:'',
            url:'http://www.stdaily.com/index/kejixinwen/2021-03/26/content_1097143.shtml',
        },
        {
            title: '·北京已安全有序实施1000多万人次新冠疫苗接种',
            description:'',
            url:'https://proapi.jingjiribao.cn/detail.html?id=331486&user_id=e6b7d9ee1ae649f0b10111c2cbd8f2f8&source=wechat_friend',
        },
    ];
    const listData3 = [
        {
            title: '病例13',
            description:'',
            url:'http://localhost:3000/statistic',
        },
        {
            title: '病例23',
            description:'',
            url:'http://localhost:3000/statistic',
        },
        {
            title: '病例31',
            description:'',
            url:'http://localhost:3000/statistic',
        },
        {
            title: '病例43',
            description:'',
            url:'http://localhost:3000/statistic',
        },
    ];
    const listData4 = [
        {
            title: '病例14',
            description:'',
            url:'http://localhost:3000/statistic',
        },
        {
            title: '病例24',
            description:'',
            url:'http://localhost:3000/statistic',
        },
        {
            title: '病例34',
            description:'',
            url:'http://localhost:3000/statistic',
        },
        {
            title: '病例44',
            description:'',
            url:'http://localhost:3000/statistic',
        },
    ];

    //时间天气
    function formateDate() {
        var a=new Date();
        var b=a.toLocaleDateString();
        var c=a.toLocaleTimeString();
        return(
            <div>
                <h3>{c}</h3>
            </div>
        );
    }
    useEffect(()=>{
        const timer01=setInterval(()=>{
            formateDate();
        },1000);
        return () => clearInterval(timer01);
    });

    return (
        <MainLayout>
            <Row style={{marginRight:'15px',marginLeft:'15px'}}>
                <Col span={6}>
                    <div className={sty.leftBar}>
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
                            {/*<div className={sty.play}>
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
                            </div>*/}
                        </Carousel>
                    </div>
                </Col>
                <Col span={12}>
                    <div className={sty.mid}>
                        {/*<Row>
                            <Col span={8} style={{marginLeft:'40px'}}>
                                {formateDate()}
                            </Col>
                            <Col span={16}>
                                <iframe name="weather_inc"
                                        src="http://i.tianqi.com/index.php?c=code&id=7"
                                        className={sty.weather}>
                                </iframe>
                            </Col>
                        </Row>*/}
                        <Row>
                            <Col span={10}>
                                <Row style={{marginTop:'10px'}}>
                                    <Col span={12}>
                                        <div className={sty.box1}>
                                            <div className={sty.number}>52</div>
                                            <div className={sty.name}>患者活动指数</div>
                                        </div>
                                    </Col>
                                    <Col span={12}><div className={sty.box2}>
                                        <div className={sty.number}>70</div>
                                        <div className={sty.name}>传播范围指数</div>
                                    </div></Col>
                                </Row>
                                <Row style={{marginTop:'15px'}}>
                                    <Col span={12}>
                                        <div className={sty.box3}>
                                            <div className={sty.number}>42</div>
                                            <div className={sty.name}>疫情趋势指数</div>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div className={sty.box4}>
                                            <div className={sty.number}>66</div>
                                            <div className={sty.name}>疫苗普及指数</div>
                                        </div>
                                    </Col>

                                </Row>
                            </Col>
                            <Col span={14}>
                                <Row style={{marginTop:'25px'}}>
                                    <Col span={12} style={{textAlign:'center'}}>
                                        <Row className={sty.process}>
                                            <Progress type="circle" percent={75} width={100} />
                                        </Row>
                                        <Row style={{marginLeft:'10%'}}>
                                            <div>疑似病例调查完成度</div>
                                        </Row>
                                    </Col>
                                    <Col span={12}>
                                        <Row className={sty.process}>
                                            <Progress strokeColor={{
                                                '0%': '#108ee9',
                                                '100%': '#87d068',
                                            }} type="circle" percent={70} width={100}/>
                                        </Row>
                                        <Row>
                                            <div style={{marginLeft:'10%'}}>病例信息填报完成度</div>
                                        </Row>
                                    </Col>
                                </Row>
                                {/*<ReactECharts
                                    option={option}
                                    style={{ height: '100%' }}
                                />*/}
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col span={6}>
                    <div className={sty.rightBar}>
                        <Select defaultValue="1" style={{ width: 200 }} onChange={handleChange}>
                            <Option value="1">患者各年龄段占比</Option>
                            <Option value="3">各类地点病患出现人数</Option>
                            <Option value="4">各职业病例占比</Option>
                            <Option value="2">具体位置TOP5</Option>
                            <Option value="5">交通工具TOP5</Option>
                        </Select>
                        {whichType==="1"?
                            <ReactECharts
                                option={PieOption}
                                style={{ height: '100%' }}/>:<div/>
                        }
                        {whichType==="2"?
                            <ReactECharts
                                option={BarOption01}
                                style={{ height: '100%' }}/>:<div/>
                        }
                        {whichType==="3"?
                            <ReactECharts
                                option={PieOption02}
                                style={{ height: '100%' }}/>:<div/>
                        }
                        {whichType==="4"?
                            <ReactECharts
                                option={PieOption01}
                                style={{ height: '100%' }}/>:<div/>
                        }
                        {whichType==="5"?
                            <ReactECharts
                                option={BarOption02}
                                style={{ height: '100%' }}/>:<div/>
                        }
                    </div>
                </Col>
            </Row>

            <Row style={{marginTop:'5px',marginRight:'15px',marginLeft:'15px'}}>
                <Col span={6}>
                    <div className={sty.bottomLeft}>
                        <ReactECharts
                            option={RadarOption}
                            style={{ height: '100%' }}
                        />
                    </div>
                </Col>
                <Col span={12}>
                    <div className={sty.bottomMid}>
                        <Map amapkey={"c640403f7b166ffb3490f7d2d4ab954c"}>
                            <HeatMap {...pluginProps}/>
                        </Map>
                    </div>
                </Col>
                <Col span={6}>
                    <div className={sty.bottomRight}>
                        {/*<ReactECharts
                            option={BarOption}
                            style={{ height: '100%' }}
                            opts={{ renderer: 'svg' }}
                        />*/}
                        <ReactECharts option={getTempOption()} style={{ height: '100%' }}/>
                    </div>
                </Col>
            </Row>
        </MainLayout>

    )
}
