import {Button, Col, Row, Select, Slider, Radio, Popover, AutoComplete, Tabs, DatePicker, Checkbox, Drawer, Divider} from "antd";
import React, { useDebugValue, useEffect, useState } from "react";
import MainLayout from "../../components/MainLayoout/PageLayout"
import sty from "./index.module.scss"
import { useDispatch } from "react-redux";
import {ActRemovePauses, ActSetAggr, ActSetState, PAGlobalReducer, SendData2Store} from "../../lib/state/global";
import Axios from "axios";
import Constant from '../../lib/constant'
import { useRouter } from "next/dist/client/router";
import SaveRestore from "../../components/drawboard"
import ClusterGraph from "../../components/ClusterGraph";
import axios from "axios";
import { useTypedSelector } from "../../lib/store";
import moment from "moment";
import { format } from "path";
import ContactTable from "../../components/ContactTable";

const {RangePicker} = DatePicker
const { Option } = Select;


export default function Pageanalyse() {
    const { Option } = Select;
    const [isHidden,setIsHidden]=useState(sty.show);
    const dispatch = useDispatch()
    const handleReason = (pid:any)=>{
        axios.post(`${Constant.testserver}/get_chain`,{
            pid:pid,
            version:"origin"
        })
        .then(e=>{dispatch(ActSetState({chain:e.data}))})
        setVisible(true)
    }
    const aggrGraph_fewer = useTypedSelector(e=>e.PAGlobalReducer.aggrGraph_fewer)
    const aggrGraph_more = useTypedSelector(e=>e.PAGlobalReducer.aggrGraph_more)
    const all_patients = useTypedSelector(e=>e.PAGlobalReducer.all_patients)
    const [dist,setD] = useState(500)
    const [distUnit,setDU] = useState(0.001)
    const [time,setT] = useState(60)
    const [timeUnit,setTU] = useState(1)
    const [startTime,setST] = useState("2021-11-01")
    const [endTime,setET] = useState("2021-12-31")
    const [district,setDT] = useState(["陕西省"])
    const [peopleFewer,setPF] = useState([])
    const [peopleMore,setPM] = useState([])
    const [omitSingle,setOS] = useState(true)
    const [visible,setVisible] = useState(false)
    const [visible2,setVisible2] = useState(false)
    const [contactData,setCD] = useState([])
    

    useEffect(()=>{
        if (!aggrGraph_fewer){
            axios.post(`${Constant.testserver}/get_clusters2`,{
                dist:dist*distUnit,
                time:time*timeUnit,
                startTime:startTime,
                endTime:endTime,
                district:district,
                filter:omitSingle?1:0,
                people:peopleFewer
            }).then(e=>{
                dispatch(ActSetState({aggrGraph_fewer:e.data}))
            })
        }
        if (!aggrGraph_more){
            axios.post(`${Constant.testserver}/get_clusters2`,{
                dist:dist*distUnit,
                time:time*timeUnit,
                startTime:startTime,
                endTime:endTime,
                district:district,
                filter:omitSingle?1:0,
                people:peopleMore
            }).then(e=>{
                dispatch(ActSetState({aggrGraph_more:e.data}))
            })
        }
        if (!all_patients){
            axios.get(`${Constant.testserver}/get_all_patients`)
            .then(e=>{
                dispatch(ActSetState({
                    all_patients:e.data
                }))
            })
        }
    },[aggrGraph_fewer,aggrGraph_more,all_patients])

    const differAggreate = (idx) => {
        console.log(all_patients[idx].pid)
        dispatch(ActSetState({
            focus_id:all_patients[idx].pid
        }))
        setPF(all_patients.slice(0,idx))
        setPM(all_patients.slice(0,idx+1))
    }

    const getContactData = ()=>{
        axios.get(`${Constant.testserver}/get_contacts_table`)
        .then((e)=>{
            setCD(e.data)
        })
        setVisible2(true)
    }
    return(
        <MainLayout>
            <div className={sty.Table}>
            <Row>
                <Col style={{margin:'0'}} span={4}>
                    <Row className={isHidden}>
                        <Col span={8} style={{marginTop:'4px'}}><span style={{fontSize:"18px"}}>聚合距离差:</span></Col>
                        <Col span={6}>
                            <Slider max={1000} defaultValue={500} onChange={(value:any) => setD(value)}/>
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
                            <Slider max={1000} defaultValue={60} onChange={(value:any) => setT(value)}/>
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
                            <RangePicker 
                                defaultValue={[
                                    moment("2021-11-01",'YYYY-MM-DD'),
                                    moment("2021-12-31",'YYYY-MM-DD')
                                ]}
                                onChange={(v,s)=>{setST(s[0]),setET(s[1])}}
                            />
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
                            axios.post(`${Constant.testserver}/get_clusters2`,{
                                dist:dist*distUnit,
                                time:time*timeUnit,
                                startTime:startTime,
                                endTime:endTime,
                                district:district,
                                filter:omitSingle?1:0,
                                people:peopleFewer.map((e)=>(e.pid))
                            }).then(e=>{
                                dispatch(ActSetState({aggrGraph_fewer:e.data}))
                            })
                            axios.post(`${Constant.testserver}/get_clusters2`,{
                                dist:dist*distUnit,
                                time:time*timeUnit,
                                startTime:startTime,
                                endTime:endTime,
                                district:district,
                                filter:omitSingle?1:0,
                                people:peopleMore.map((e)=>(e.pid))
                            }).then(e=>{
                                dispatch(ActSetState({aggrGraph_more:e.data}))
                            })
                        }}>获取数据</Button>
                    </Row>
                </Col>
                <Col span={3}>
                    {/* <Radio.Group value={radioValue} onChange={(e)=>onChange(e)}>
                        <Radio.Button value="1">聚合传播关系图</Radio.Button>
                        <Radio.Button value="3">手绘画板</Radio.Button>
                    </Radio.Group> */}
                    <Button onClick={()=>{setVisible(true)}}>打开画板</Button>
                    <Button ><a href={`${Constant.testserver}/download_cluster_csv`}>下载文档</a></Button>
                </Col>
            </Row>
            <Drawer
                title={"手绘画板"}
                placement="right"
                width={1000}
                onClose={()=>{setVisible(false)}}
                visible={visible}
            >
                <div style={{width: "95%",height: "100%"}}>
                    <SaveRestore/>
                </div>
            </Drawer>
            <Drawer
                title={"密接表"}
                placement="left"
                width={800}
                onClose={()=>{setVisible2(false)}}
                visible={visible2}
            >
                <div style={{width: "95%",height: "100%"}}>
                    <ContactTable dataSource={contactData}/>
                </div>
            </Drawer>
            <Row>
                <Col span={11}>
                    <ClusterGraph handleReason={handleReason} container_id={"container"} aggrGraph={aggrGraph_fewer}/>
                </Col>
                <Col span={2}>
                    <h3>选择差异分析对象</h3>
                    <Select style={{width:"100%"}} defaultValue={0} onChange={(e)=>{differAggreate(e)}}>
                        {
                            all_patients?
                            all_patients.map((e,idx)=>(
                                <Option value={idx}>{e.name}</Option>
                            ))
                            :null
                        }
                    </Select>
                    <Button onClick={getContactData}>密接表</Button>
                </Col>
                <Col span={11}>
                    <ClusterGraph handleReason={handleReason} container_id={"container_2"} aggrGraph={aggrGraph_more} focused={true}/>
                </Col>
            </Row>
        </div>
        </MainLayout>
    )
}