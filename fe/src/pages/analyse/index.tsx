import {Button, Col, Row, Select, Slider, Radio, Popover, AutoComplete, Tabs} from "antd";
import { DownOutlined } from '@ant-design/icons';
import DescriptionsItem from "antd/lib/descriptions/Item";
import React, { useDebugValue, useEffect, useState } from "react";
import MainLayout from "../../components/MainLayoout/PageLayout"
import { useTypedSelector } from "../../lib/store";
import sty from './index.module.scss'
import { ColumnsType } from "antd/lib/table";
import { extracDate } from "../../lib/utils";
import { useDispatch } from "react-redux";
import {ActRemovePauses, ActSetState} from "../../lib/state/global";
import Axios from "axios";
import Constant from '../../lib/constant'
import Search from "antd/lib/input/Search";
import { useRouter } from "next/dist/client/router";
import NewRouteForm from "../../components/NewRoute";
import Routes from "../../components/Routes";
import initialElements from '../../components/drawboard/initial-elements';
import SaveRestore from "../../components/drawboard"
import DeviceGraph from "../../components/JtopoNodes"


export default function Pageanalyse() {
    const { Option } = Select;
    const [isHidden,setIsHidden]=useState(sty.show);
    const router = useRouter()

    const content = (
        <div>
            <div style={{fontSize:'18px',fontWeight:'bold'}}>病例3</div>
            <div><span style={{fontWeight:'bold'}}>张某某</span>，女，31岁</div>
            <div><span style={{fontWeight:'bold'}}>家庭住址:</span>顺义区高丽营镇张喜庄村</div>
            <div><span style={{fontWeight:'bold'}}>工作地点:</span>顶全便利店顺义区货运店</div>
        </div>
    );
    const content1 = (
        <div>
            <div><span style={{fontWeight:'bold'}}>气温:5℃</span></div>
            <div><span style={{fontWeight:'bold'}}>天气:晴</span></div>
            <div><span style={{fontWeight:'bold'}}>风向:东北风四级</span></div>
            <div><span style={{fontWeight:'bold'}}>人流量:大</span></div>
            <div><span style={{fontWeight:'bold'}}>当前时间点患者:</span>
                <Button type="link" danger>
                    病例2
                </Button>
                ，
                <Button type="link" danger>
                    病例8
                </Button>
            </div>
        </div>
    );
    // const [changePic,setChangePic]=useState(sty.picture00);
    const [areaSlider,setAS] = useState<Number>(1000)
    const [timeSlider,setTS] = useState<Number>(60)
    const [cluster_background,setCB] = useState<string>(sty.cluster4)
    useEffect(()=>{
        setCB(
            (areaSlider>750 && timeSlider>50)?sty.cluster4:
            (areaSlider>500 && timeSlider>45)?sty.cluster3:
            (areaSlider>250 && timeSlider>35)?sty.cluster2:sty.cluster1)
    },[areaSlider,timeSlider])

    useEffect(()=>{
        setPict(<div>
            <div className={cluster_background}>
                <Row></Row>
                <Popover content={content} title="病例信息" trigger="click">
                    <div className={sty.click}></div>
                </Popover>
            </div>
        </div>)
    },[cluster_background])
    
    const[pict,setPict]=useState(<div>
        <div className={cluster_background}>
            <Row></Row>
            <Popover content={content} title="病例信息" trigger="click">
                <div className={sty.click}></div>
            </Popover>
        </div>
    </div>);
    const options = [
            { value: '病例1——周某某' },
            { value: '病例7——李某某' },
            { value: '病例15——王某' },
    ];
    const Complete: React.FC = () => (
        <AutoComplete
            style={{ width: 200 }}
            options={options}
            placeholder="请输入患者姓名"
            filterOption={(inputValue, option) =>
                option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
        />
    );
    const marks = {
            0: '12月1日',
            100: '1月19日',
    };
    const { TabPane } = Tabs;
    const onChange = (e:any) => {
        //   setType(e.target.value);
        //画板
        if (e.target.value=="3"){
            setPict(
                <>
                <div className={sty.export}>
                    <Button type="primary"><a href={`${Constant.apihost}/download`}>导出</a></Button>
                </div>
                <div style={{width: "90vw",height: "90vh"}}>
                    <SaveRestore/>
                </div>
                </>
            )
            setIsHidden(sty.hidden)
        }
        //人群聚合
        else if(e.target.value=="1"){
            console.log(cluster_background)
            setPict(
                <div>
                    <div className={cluster_background}>
                        <Row></Row>
                        <Popover content={content} title="病例信息" trigger="click">
                            <div className={sty.click}></div>
                        </Popover>
                    </div>
                </div>
                // <DeviceGraph/>
            )
            setIsHidden(sty.show)
        }
        //时间聚合
        else{
            setPict(
                <div style={{marginTop:'15px',height:'100%',width:'100%'}}>
                    <Row>
                        <Col span={2}></Col>
                        <Col span={6}>
                            <div style={{fontSize:'20px'}}>患者轨迹空间分析</div>
                            <div style={{marginLeft:'25px',marginTop:'10px'}}>
                                请输入患者姓名&nbsp;&nbsp;
                                <Complete/>
                            </div>
                            <div style={{marginTop:'20px',marginLeft:'30px'}}>
                                已选择密接者&nbsp;&nbsp;&nbsp;
                                <Button type="primary" style={{color:'black'}}>周某某</Button>
                                <Button type="primary" danger style={{color:'black',marginLeft:'10px'}}>王某某</Button>
                            </div>
                        </Col>
                        <Col span={6}></Col>
                        <Col span={7}>
                            <div style={{fontSize:'20px'}}>患者轨迹时间分析</div>
                            <div style={{marginLeft:'25px',marginTop:'10px'}}>
                                <Row>
                                    <Col span={6} style={{marginTop:'5px'}}>请选择时间点&nbsp;&nbsp;</Col>
                                    <Col span={18}><Slider marks={marks} defaultValue={100} /></Col>
                                </Row>
                            </div>
                        </Col>
                        <Col span={3}></Col>
                    </Row>
                    <div style={{marginTop:'10px',height:'100%'}}>
                        <Row style={{height:'100%'}}>
                            <Col span={1}></Col>
                            <Col span={11}>
                                <div className={sty.picture01}></div>
                            </Col>
                            <Col span={3}></Col>
                            <Col span={8} style={{marginTop:'0px'}}>
                                <Tabs type={"card"}>
                                    <TabPane tab="地点聚合" key="1">
                                        <div className={sty.picture02}>
                                            <Row></Row>
                                            <Popover content={content1} title="金马工业区" trigger="click">
                                                <div className={sty.click01}></div>
                                            </Popover>
                                        </div>
                                    </TabPane>
                                    <TabPane tab="患者轨迹" key="2">
                                        <div className={sty.picture021}>
                                            <Row></Row>
                                            <Popover content={content1} title="金马工业区" trigger="click">
                                                <div className={sty.click02}></div>
                                            </Popover>
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </Col>
                            <Col span={1}></Col>
                        </Row>
                    </div>
                </div>
            )
            setIsHidden(sty.hidden)
        }
    };
    return(
        <MainLayout>
            <div className={sty.Table}>
            <Row>
                <Col span={4}>
                    <Select defaultValue="1" style={{ width: 180,fontSize:'22px' }} bordered={false}>
                    <Option value="1">北京顺义疫情</Option>
                    <Option value="2">北京大兴疫情</Option>
                    <Option value="3">河北石家庄疫情</Option>
                    <Option value="4">北京新发地疫情</Option>
                    </Select>
                </Col>
                <Col style={{marginTop:'1px'}} span={6}>
                    <Row className={isHidden}>
                        <Col span={5} style={{marginTop:'4px'}}><span style={{fontSize:"18px"}}>聚合距离差:</span></Col>

                        <Col span={4}>
                            <Select defaultValue="01" style={{ width: 70 }}>
                                <Option value="01">小于</Option>
                                <Option value="02">大于</Option>
                                <Option value="03">等于</Option>
                            </Select>
                        </Col>

                        <Col span={1}></Col>

                        <Col span={6}>
                            <Slider max={1000} defaultValue={1000} onChange={(value:any) => setAS(value)}/>
                        </Col>

                        <Col span={1}></Col>

                        <Col span={4}>
                            <Select defaultValue="01" style={{ width: 70 }}>
                                <Option value="01">米</Option>
                                <Option value="02">千米</Option>
                            </Select>
                        </Col>
                        <Col span={3}></Col>
                    </Row>
                </Col>
                <Col style={{marginTop:'1px'}} span={6}>
                    <Row className={isHidden}>
                        <Col span={5} style={{marginTop:'4px'}}><span style={{fontSize:"18px"}}>聚合时间差:</span></Col>

                        <Col span={4}>
                            <Select defaultValue="01" style={{ width: 70 }}>
                                <Option value="01">小于</Option>
                                <Option value="02">大于</Option>
                                <Option value="03">等于</Option>
                            </Select>
                        </Col>

                        <Col span={1}></Col>

                        <Col span={6}>
                            <Slider max={60} defaultValue={60} onChange={(v:any)=>setTS(v)}/>
                        </Col>

                        <Col span={1}></Col>

                        <Col span={4}>
                            <Select defaultValue="01" style={{ width: 70 }}>
                                <Option value="01">分钟</Option>
                                <Option value="02">小时</Option>
                                <Option value="03">日</Option>
                            </Select>
                        </Col>
                        <Col span={3}></Col>
                    </Row>
                </Col>
                <Col span={3}></Col>
                <Col span={5}>
                    <Radio.Group defaultValue="1" onChange={(e)=>onChange(e)}>
                        <Radio.Button value="1">聚合传播关系图</Radio.Button>
                        <Radio.Button value="2">时空传播关系图</Radio.Button>
                        <Radio.Button value="3">手绘画板</Radio.Button>
                    </Radio.Group>
                </Col>
            </Row>

            <div style={{height:'100%'}}>
                {pict}
            </div>

            </div>
        </MainLayout>
    )
}