import {Button, Col, Row, Select, Slider, Radio, Popover, AutoComplete, Tabs, DatePicker, Checkbox} from "antd";
import React, { useDebugValue, useEffect, useState } from "react";
import MainLayout from "../../components/MainLayoout/PageLayout"
import sty from "./index.module.scss"
import { useDispatch } from "react-redux";
import {ActRemovePauses, ActSetAggr, ActSetState, SendData2Store} from "../../lib/state/global";
import Axios from "axios";
import Constant from '../../lib/constant'
import { useRouter } from "next/dist/client/router";
import SaveRestore from "../../components/drawboard"
import ClusterGraph from "../../components/ClusterGraph";
import axios from "axios";
import { useTypedSelector } from "../../lib/store";

const {RangePicker} = DatePicker
const { Option } = Select;


export default function Pageanalyse() {
    const { Option } = Select;
    const [isHidden,setIsHidden]=useState(sty.show);
    const [radioValue,setRadioValue] = useState("1")
    const dispatch = useDispatch()
    const handleReason = (pid:any)=>{
        setRadioValue("3")
        axios.post(`${Constant.testserver}/get_chain`,{
            pid:pid,
            version:"origin"
        })
        .then(e=>{dispatch(ActSetState({chain:e.data}))})
        setPict(
            <>
            {/* <div className={sty.export}>
                <Button type="primary"><a href={`${Constant.apihost}/download`}>导出</a></Button>
            </div> */}
            <div style={{width: "90vw",height: "90vh"}}>
                <SaveRestore/>
            </div>
            </>
        )
        setIsHidden(sty.hidden)
    }
    const aggrGraph = useTypedSelector(e=>e.PAGlobalReducer.aggrGraph)
    const [dist,setD] = useState(100)
    const [distUnit,setDU] = useState(0.001)
    const [time,setT] = useState(100)
    const [timeUnit,setTU] = useState(1)
    const [startTime,setST] = useState("2022-04-22")
    const [endTime,setET] = useState("2022-05-16")
    const [district,setDT] = useState(["陕西省"])
    const [omitSingle,setOS] = useState(true)
    
    const[pict,setPict]=useState(
        <ClusterGraph handleReason={handleReason}/>
    );

    useEffect(()=>{
        if (!aggrGraph){
            axios.post(`${Constant.testserver}/get_clusters2`,{
                dist:dist*distUnit,
                time:time*timeUnit,
                startTime:startTime,
                endTime:endTime,
                district:district,
                filter:omitSingle?1:0
            }).then(e=>{
                dispatch(ActSetState({aggrGraph:e.data}))
            })
        }
    },[aggrGraph])

    const onChange = (e:any) => {
        if (e.target.value=="3"){
            setRadioValue("3")
            setPict(
                <>
                {/* <div className={sty.export}>
                    <Button type="primary"><a href={`${Constant.apihost}/download`}>导出</a></Button>
                </div> */}
                <div style={{width: "90vw",height: "90vh"}}>
                    <SaveRestore/>
                </div>
                </>
            )
            setIsHidden(sty.hidden)
        }
        //人群聚合
        else if(e.target.value=="1"){
            setRadioValue("1")
            setPict(
                <ClusterGraph handleReason={handleReason}/>
            )
            setIsHidden(sty.show)
        }
        //时间聚合
    };
    return(
        <MainLayout>
            <div className={sty.Table}>
            <Row>
                <Col style={{margin:'0'}} span={4}>
                    <Row className={isHidden}>
                        <Col span={8} style={{marginTop:'4px'}}><span style={{fontSize:"18px"}}>聚合距离差:</span></Col>
                        <Col span={6}>
                            <Slider max={1000} defaultValue={1000} onChange={(value:any) => setD(value)}/>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={6}>
                            <Select defaultValue="01" onChange={(value:any)=>setDU(value==="01"?0.001:1)}>
                                <Option value="01">米</Option>
                                <Option value="02">千米</Option>
                            </Select>
                        </Col>
                        <Col span={1}></Col>
                    </Row>
                </Col>
                <Col style={{margin:'0'}} span={4}>
                    <Row className={isHidden}>
                        <Col span={8} style={{marginTop:'4px'}}><span style={{fontSize:"18px"}}>聚合时间差:</span></Col>
                        <Col span={6}>
                            <Slider max={1000} defaultValue={1000} onChange={(value:any) => setT(value)}/>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={6}>
                            <Select defaultValue="01" onChange={(value:any)=>setTU(value==="01"?1:60)}>
                                <Option value="01">分钟</Option>
                                <Option value="02">小时</Option>
                            </Select>
                        </Col>
                        <Col span={1}></Col>
                    </Row>
                </Col>
                <Col style={{margin:'0'}} span={5}>
                    <Row className={isHidden}>
                        <Col span={7} style={{marginTop:'4px'}}><span style={{fontSize:"18px"}}>聚合日期:</span></Col>
                        <Col span={17}>
                            <RangePicker onChange={(v,s)=>{setST(s[0]),setET(s[1])}}/>
                        </Col>
                    </Row>
                </Col>
                <Col span={4}>
                    <Row className={isHidden}>
                        <Col span={2}></Col>
                        <Col span={20}>
                            <Select style={{width:"200px"}} mode="multiple" defaultValue={"陕西省"} onChange={(value:any)=>{console.log(value),setDT(value)}}>
                                <Option value="东城区">东城区</Option>
                                <Option value="西城区">西城区</Option>
                                <Option value="朝阳区">朝阳区</Option>
                                <Option value="海淀区">海淀区</Option>
                                <Option value="房山区">房山区</Option>
                                <Option value="丰台区">丰台区</Option>
                                <Option value="昌平区">昌平区</Option>
                                <Option value="密云区">密云区</Option>
                                <Option value="通州区">通州区</Option>
                                <Option value="顺义区">顺义区</Option>
                                <Option value="大兴区">大兴区</Option>
                                <Option value="延庆区">延庆区</Option>
                                <Option value="陕西省">陕西省</Option>
                            </Select>
                        </Col>
                        <Col span={2}></Col>
                    </Row>
                </Col>
                <Col span={2}>
                    <Row className={isHidden}>
                    <Col span={2}></Col>
                        <Col span={20}>
                            <Checkbox checked={omitSingle} onChange={(e)=>{setOS(e.target.checked)}}>过滤单人点位</Checkbox>
                        </Col>
                        <Col span={2}></Col>
                    </Row>
                </Col>
                <Col span={2}>
                    <Row className={isHidden}>
                        <Button type="primary" onClick={()=>{
                            console.log(dist,startTime,endTime,district)
                            axios.post(`${Constant.testserver}/get_clusters2`,{
                                dist:dist*distUnit,
                                time:time*timeUnit,
                                startTime:startTime,
                                endTime:endTime,
                                district:district,
                                filter:omitSingle?1:0
                            }).then(e=>{
                                dispatch(ActSetState({aggrGraph:e.data}))
                                console.log(e.data)
                            })
                            // axios.get(`${Constant.testserver}/get_clusters`).then(e=>{
                            //     dispatch(ActSetState({aggrGraph:e.data}))
                            // })
                        }}>获取数据</Button>
                    </Row>
                </Col>
                <Col span={3}>
                    <Radio.Group value={radioValue} onChange={(e)=>onChange(e)}>
                        <Radio.Button value="1">聚合传播关系图</Radio.Button>
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