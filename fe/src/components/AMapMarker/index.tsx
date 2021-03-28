import React, { useCallback, useEffect, useState } from 'react'
import { AMapLngLat } from 'react-amap'
import { useDispatch } from 'react-redux'
import { ActSetState } from '../../lib/state/global'
import { useTypedSelector } from '../../lib/store'
import { extracLocation } from '../../lib/utils'




interface IProps {
    __map__?: any
}


const colorArray = ["red","bule","green"]

export function AMapInsertMarker({ __map__ }: IProps) {
    if (!__map__)
        console.error("no map instance injected")
    const amap = useTypedSelector(e => e.PAGlobalReducer.amap)
    const vertexs = useTypedSelector(e => e.PAGlobalReducer.pauses)
    const [curV, setV] = useState<any[]>([])
    const [curE, setE] = useState()
    const generateMarker = useCallback(
        () => {
            const markers = vertexs.map((e, i) => new amap.Marker({ position: new amap.LngLat(e.lnglat.lng, e.lnglat.lat), extData: i }))
            setV(markers)
            curV && curV.length > 0 && __map__.remove(curV)
            __map__.add(markers)
        },
        [vertexs]
    )
    const generateEdge = useCallback(
        () => {
            const path = vertexs.map(e => new amap.LngLat(e.lnglat.lng, e.lnglat.lat))
            const polyline = new amap.Polyline({
                path: path,
                borderWeight: 2,
                strokeColor: 'red',
                lineJoin: 'round'
            })
            setE(polyline)
            curE && __map__.remove(curE)
            __map__.add(polyline)
        }, [vertexs])

    useEffect(() => {
        if (!amap || !__map__) return
        console.log(vertexs)
        generateMarker()
        generateEdge()
    }, [vertexs])

    return (null)
}


export function AMapShowedMarker({ __map__ }: IProps) {
    if (!__map__)
        console.error("no map instance injected")
    const amap = useTypedSelector(e => e.PAGlobalReducer.amap)
    // const vertexs = useTypedSelector(e => e.PAGlobalReducer.pauses)
    const loadedRoutes = useTypedSelector(e=>e.PAGlobalReducer.loadedRoutes)
    const showedRoutes = useTypedSelector(e=>e.PAGlobalReducer.showedRoutes)
    // const [curV, setV] = useState<any[]>([])
    // const [curE, setE] = useState()
    const [curSR, setSR] = useState<Number[]>([])
    const [curMS,setMS] = useState<any[][]>([])
    const [curPS,setPS] = useState<any[]>([])

    // useEffect(()=>{
    //     var marker = new amap.Marker({
    //         map: __map__,
    //         position: [116.481181, 39.989792]
    //     });
    //     var infoWindow = new amap.InfoWindow({
    //         content: generateContent("name","2021","12:00",[]).join(""),
    //         offset: new amap.Pixel(16, -45)
    //     });
    //     amap.event.addListener(marker, 'click', function () {
    //         infoWindow.open(__map__, marker.getPosition());
    //     });
    // })
    // useEffect(()=>{
    //     console.log(amap)
    //     __map__.add(new amap.Marker({position: new amap.LngLat(116.310905,39.992806)}))
    // })

    const generateContent = (name:string,date:string,time:string,stay:any)=>{
        return [
            "<div>",
                "<h2>" + name + "</h2>",
                "<div style=\"display:flex;flex-direction: row;align-items:center\">",
                    "<div><span style=\"font-weight:bold\">风险系数评估:</span></div>",
                    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
                    "<p style=\"font-size: 27px;color: red\">90</p>",
                "</div>",
                "<div><span style={{fontWeight:'bold'}}>到&nbsp;&nbsp;达&nbsp;&nbsp;时&nbsp;&nbsp;间：" + date + "," + time + "</span></div>",
                //"<div><span style={{fontWeight:'bold'}}>经&nbsp;&nbsp;停&nbsp;&nbsp;时&nbsp;&nbsp;间：" + stay?stay[0]:"" + stay?stay[1]:"" + "</span></div>",
                "<div><span style={{fontWeight:'bold'}}>该时段人流量： 大</span></div>",
                "<div><span style={{fontWeight:'bold'}}>行为相似患者：</span>",
                    "<a style={{textDecoration:\"underline\",color:\"blue\"}}>病例2-乘坐电梯感染</a>",
                    "，",
                    "<a style={{textDecoration:\"underline\",color:\"blue\"}}>病例8-现金交易感染</a>",
                "</div>",
            "</div>"
        ]
    }
    const content = ["<div>",
                        "<div style=\"display:flex;flex-direction: row;align-items:center\">",
                            "<div><span style=\"font-weight:bold\">风险系数评估:</span></div>",
                            "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
                            "<p style=\"font-size: 27px;color: red\">90</p>",
                        "</div>",
                        "<div><span style={{fontWeight:'bold'}}>到&nbsp;&nbsp;达&nbsp;&nbsp;时&nbsp;&nbsp;间： 2021-01-01,12:00:00</span></div>",
                        "<div><span style={{fontWeight:'bold'}}>经&nbsp;&nbsp;停&nbsp;&nbsp;时&nbsp;&nbsp;间： 60min</span></div>",
                        "<div><span style={{fontWeight:'bold'}}>该时段人流量： 大</span></div>",
                        "<div><span style={{fontWeight:'bold'}}>行为相似患者：</span>",
                            "<a style={{textDecoration:\"underline\",color:\"blue\"}}>病例2-乘坐电梯感染</a>",
                            "，",
                            "<a style={{textDecoration:\"underline\",color:\"blue\"}}>病例8-现金交易感染</a>",
                        "</div>",
                    "</div>",]

    const initMarkers = useCallback(
        ()=>{
            if(loadedRoutes){
                 // markers.push(tmp.map((p)=>{
                    //     let pos = extracLocation(p?.location?.location)
                    //     let marker = new amap.Marker({ position: new amap.LngLat(pos?pos[0]:0,pos?pos[1]:0)})
                    //     let info = new amap.InfoWindow({
                    //         content: generateContent(""+p?.location?.name,r.date,""+p?.time,p?.stay),
                    //         offset: new amap.Pixel(16, -45)
                    //     })
                    //     amap.event.addListener(marker, 'click', function () {
                    //         info.open(__map__, marker.getPosition());
                    //     });
                    //     return marker
                    // }))
                __map__.clearMap()
                setSR(Array(loadedRoutes.length).fill(0))
                let markers:any[][] = []
                let paths:any[] = []
                for(let i = 0;i < loadedRoutes?.length;i++){
                    let r = loadedRoutes[i]
                    let tmp = []
                    for (let n of r.route){
                        if(n){
                            let pos = extracLocation(n.pause?.location?.location)
                            tmp.push({position:pos,content:generateContent(""+n.pause?.location?.name,r.date,""+n.pause?.time,n.pause?.stay).join("")})
                        }
                    }
                    console.log("aaa" + i)
                    // console.log(markers)
                    markers.push(tmp.map(t=>{
                        let pos=t.position
                        //let content = t.content
                        let info = new amap.InfoWindow({
                            content:t.content,
                            offset: new amap.Pixel(16, -45)
                        })
                        let marker = new amap.Marker({ position: [pos?pos[0]:0,pos?pos[1]:0]})
                        amap.event.addListener(marker, 'click', function () {
                            info.open(__map__, marker.getPosition());
                        });
                        return marker
                    }))
                    console.log(markers)
                    paths.push(new amap.Polyline({
                        path:tmp.map(t=>t.position),
                        borderWeight: 2,
                        strokeColor: "red",
                    }))
                }
                setMS(markers)
                setPS(paths)
            }
        },
        [loadedRoutes]
    )

    const refreshMarker = useCallback(
        ()=>{
            if (curSR.length!=showedRoutes.length){
                setSR(showedRoutes.slice())
            }
            for(let i = 0;i < curSR.length;i++){
                if(curSR[i] != showedRoutes[i]){
                    if(curSR[i]){
                        // console.log(i)
                        // console.log(curSR)
                        // console.log(showedRoutes)
                        __map__.remove(curMS[i])
                        __map__.remove(curPS[i])
                    }else{
                        __map__.add(curMS[i])
                        __map__.add(curPS[i])
                    }
                }
            }
            setSR(showedRoutes.slice())
        },
        [showedRoutes]
    )
    // const generateMarker = useCallback(
    //     () => {
    //         const markers = vertexs.map((e, i) => new amap.Marker({ position: new amap.LngLat(e.lnglat.lng, e.lnglat.lat), extData: i }))
    //         setV(markers)
    //         curV && curV.length > 0 && __map__.remove(curV)
    //         __map__.add(markers)
    //     },
    //     [vertexs]
    // )
    // const generateEdge = useCallback(
    //     () => {
    //         const path = vertexs.map(e => new amap.LngLat(e.lnglat.lng, e.lnglat.lat))
    //         const polyline = new amap.Polyline({
    //             path: path,
    //             borderWeight: 2,
    //             strokeColor: 'red',
    //             lineJoin: 'round'
    //         })
    //         setE(polyline)
    //         curE && __map__.remove(curE)
    //         __map__.add(polyline)
    //     }, [vertexs])

    // useEffect(() => {
    //     if (!amap || !__map__) return
    //     console.log(vertexs)
    //     generateMarker()
    //     generateEdge()
    // }, [vertexs])

    useEffect(()=>{
        if (!amap || !__map__) return
        try{initMarkers()}catch(e){console.log(e)}
    },[loadedRoutes])

    useEffect(()=>{
        if (!amap || !__map__) return
        try{console.log("show"),refreshMarker()}catch(e){console.log(e)}
    },[showedRoutes])


    return (null)
}
