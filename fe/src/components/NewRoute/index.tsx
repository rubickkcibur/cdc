import { Col } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ActSetState } from "../../lib/state/global";
import { useTypedSelector } from "../../lib/store";
import { RouteForm } from "../Routes";

export default function NewRouteForm(){
    const dispatch = useDispatch()
    const buffer = useTypedSelector(e=>e.PAGlobalReducer.newRouteBuffer)

    const onChange=(e:any)=>{
        dispatch(ActSetState({newRouteBuffer:e}))
    }

    useEffect(()=>{
        console.log(buffer)
    },[buffer])

    return(
        <Col style={{width:330}}>
            <RouteForm onChange={onChange}/>
        </Col>
    )
}