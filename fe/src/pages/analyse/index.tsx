import {Button, Col, Row, Select, Slider, Radio, Popover, AutoComplete, Tabs} from "antd";
import { DownOutlined } from '@ant-design/icons';
import DescriptionsItem from "antd/lib/descriptions/Item";
import React, { useDebugValue, useEffect, useState } from "react";
import MainLayout from "../../components/MainLayoout/PageLayout"
import { useTypedSelector } from "../../lib/store";
import sty from "./index.module.scss"
import { ColumnsType } from "antd/lib/table";
import { extracDate } from "../../lib/utils";
import { useDispatch } from "react-redux";
import {ActRemovePauses, ActSetAggr, ActSetState, SendData2Store} from "../../lib/state/global";
import Axios from "axios";
import Constant from '../../lib/constant'
import Search from "antd/lib/input/Search";
import { useRouter } from "next/dist/client/router";
import NewRouteForm from "../../components/NewRoute";
import Routes from "../../components/Routes";
import initialElements from '../../components/drawboard/initial-elements';
import SaveRestore from "../../components/drawboard"
import DeviceGraph from "../../components/JtopoNodes"
import ClusterGraph from "../../components/ClusterGraph";
import { dispatch } from "rxjs/internal/observable/pairs";


export default function Pageanalyse() {
    const { Option } = Select;
    const [isHidden,setIsHidden]=useState(sty.show);
    const router = useRouter()
    const [radioValue,setRadioValue] = useState("1")
    const handleReason = (pid:any)=>{
        setRadioValue("3")
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
    const [areaSlider,setAS] = useState<Number>(1000)
    const [timeSlider,setTS] = useState<Number>(60)
    
    const[pict,setPict]=useState(
        <ClusterGraph handleReason={handleReason}/>
    );
    // const dispatch = useDispatch()
    // const clickSlider =()=>{
    //     dispatch(SendData2Store(areaSlider[0],timeSlider[0]))
    //     Axios.post(`${Constant.apihost}/getAggr`,{area:areaSlider[0],time:timeSlider[0]})
    //     .then(e=>{
    //       dispatch(ActSetAggr({e}))
    //     })
    // }

    const onChange = (e:any) => {
        if (e.target.value=="3"){
            setRadioValue("3")
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
                <Col span={2}></Col>
                <Col style={{marginTop:'1px'}} span={6}>
                    <Row className={isHidden}>
                        <Col span={7} style={{marginTop:'4px'}}><span style={{fontSize:"18px"}}>聚合距离差:</span></Col>
                 
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
                        <Col span={7} style={{marginTop:'4px'}}><span style={{fontSize:"18px"}}>聚合时间差:</span></Col>
                 
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
           
                <Col span={1}></Col>
                <Button type="primary" onClick={()=>{console.log("待实现")}}>获取数据</Button>
                <Col span={1}></Col>
           
                <Col span={5}>
                    <Radio.Group value={radioValue} onChange={(e)=>onChange(e)}>
                        <Radio.Button value="1">聚合传播关系图</Radio.Button>
                        {/* <Radio.Button value="2">时空传播关系图</Radio.Button> */}
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