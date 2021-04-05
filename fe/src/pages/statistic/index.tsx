import React, { useEffect, useState } from "react"
import MainLayout from "../../components/MainLayoout/PageLayout";
import {Map} from "react-amap"
import { useTypedSelector } from '../../lib/store'
import { heatmapData } from "../../components/AMapCom";
import HeatMap from "../../components/Heatmap/heat";
export default function Statistic(){
    const amap = useTypedSelector(e => e.PAGlobalReducer.amap)
    const visible = true; 
    const radius = 30; 
    const gradient = {
        '0.4':'rgb(0, 255, 255)',
        '0.65':'rgb(0, 110, 255)',
        '0.85':'rgb(100, 0, 255)',
        '1.0':'rgb(100, 0, 255)'
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
    return(
        <MainLayout>
            <div style={{height:"90vh",width:"100vw"}}>
                <Map amapkey={"c640403f7b166ffb3490f7d2d4ab954c"}>
                    <HeatMap {...pluginProps}/>
                </Map>
            </div>
        </MainLayout>
    )
}