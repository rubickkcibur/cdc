import React from "react";
// import {APILoader,Map} from "@uiw/react-amap"
import { Cluster, Heatmap } from "../../components/AMapCom";
import MainLayout from "../../components/MainLayoout/PageLayout";
import { Row, Col } from "antd";
import sty from "./index.module.scss"

export default function HeatMap(){
    return(
        <MainLayout>
            {/* <div style={{ height: '950px' }}>
                <APILoader akay="c640403f7b166ffb3490f7d2d4ab954c">
                    <Map center={[116.397428, 39.90923]} zoom={13}>
                        <Heatmap/>
                        <Cluster/>
                    </Map>
                </APILoader>
            </div> */}
        </MainLayout>
    )
}