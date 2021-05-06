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

export default function NewRouteForm(){
    const dispatch = useDispatch()
    const buffer = useTypedSelector(e=>e.PAGlobalReducer.newRouteBuffer)
    const [iniValue,setIV] = useState<any>()
    const { start, stop } = useASR({
        onMessage: (e) => console.log("asr msg", e),
    })

    console.log({start,stop})

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
            str:s
        }).then(e=>{
            setIV(e.data)
        }).catch(e=>console.log(e))
    }
    // useEffect(()=>{
    //     setIV({date:"2020-01-11",route:sampleNode})
    //     console.log("set")
    // })

    return(
        <Col style={{width:'100%',padding:'0px'}}>
            <Button onClick={()=>{start()}}>开始</Button>
            <Button onClick={()=>{stop()}}>结束</Button>
            <RouteForm onChange={onChange} value={iniValue}/>
        </Col>
    )
}