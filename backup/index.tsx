import { Button, Col } from "antd";
import Axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ActSetState } from "../../lib/state/global";
import { useTypedSelector } from "../../lib/store";
import { NForm } from "../../lib/types/types";
import { RouteForm } from "../Routes";
import Constant from '../../lib/constant'
import useASR from '../../hooks/useASR'
import { ConsoleSqlOutlined } from "@ant-design/icons";

export default function NewRouteForm(){
    const dispatch = useDispatch()
    const buffer = useTypedSelector(e=>e.PAGlobalReducer.newRouteBuffer)
    const [iniValue,setIV] = useState<any>()
    const { start, stop } = useASR({
        onMessage: (e) => console.log("asr msg", e),
    })

    const sampleNode: NForm[] = [
        {
            travel: {
                transform: undefined,
                note: undefined,
                protection:"戴口罩",
                contacts:[]
            },
            pause: {
                time: undefined,
                stay:[],
                location: undefined,
                contacts: [],
                detail_location:"详细地址",
                protection:"无"
            }
        }
    ]


    const onChange=(e:any)=>{
        dispatch(ActSetState({newRouteBuffer:e}))
    }

    useEffect(()=>{
        console.log(buffer)
    },[buffer])


    const getFormat=(s)=>{
        Axios.post(`${Constant.apihost}/text2Info`,{
            text:"我的名字是张三,我的性别为男,我今年30岁了,在餐厅当服务员,我住在北京市顺义区印象街道,我的身份证号码是357334233010674834,我的电话是18813139003,我体重65公斤,我身高1米73,2021年4月1日早上6点我乘坐地铁到达天坛公园,见到了王五并停留了30分钟。4月1日15点乘坐公交去了国家博物馆,见到了李四并停留了2个小时"
        }).then(e=>{
            console.log("set",e.data)
            setIV({date:"2020-01-01",route:sampleNode})
        }).catch(e=>console.log("error",e))
    }
    // useEffect(()=>{
    //     setIV({date:"2020-01-11",route:sampleNode})
    //     console.log("set")
    // })

    return(
        <Col style={{width:'100%',padding:'0px'}}>
            <Button onClick={()=>{getFormat("")}}>开始</Button>
            <Button onClick={()=>{stop()}}>结束</Button>
            <RouteForm onChange={onChange} value={iniValue}/>
        </Col>
    )
}