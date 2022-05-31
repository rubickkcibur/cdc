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

export default function AMapLinkedMarker({ __map__ }: IProps) {
    if (!__map__)
        console.error("no map instance injected")
    const amap = useTypedSelector(e => e.PAGlobalReducer.amap)
    const vertexs = useTypedSelector(e => e.PAGlobalReducer.pauses)
    const loadedRoutes = useTypedSelector(e=>e.PAGlobalReducer.loadedRoutes)
    const showedRoutes = useTypedSelector(e=>e.PAGlobalReducer.showedRoutes)
    const [curV, setV] = useState<any[]>([])
    const [curE, setE] = useState()
    const [curSR, setSR] = useState<Number[]>([])
    const [curMS,setMS] = useState<any[][]>([])
    const [curPS,setPS] = useState<any[]>([])

    const initMarkers = useCallback(
        ()=>{
            if(loadedRoutes){
                __map__.clearMap()
                setSR(Array(loadedRoutes.length).fill(0))
                let markers:any[][] = []
                let paths:any[] = []
                for(let i = 0;i < loadedRoutes?.length;i++){
                    let r = loadedRoutes[i]
                    let tmp = []
                    for (let n of r.route){
                        if(n){
                            tmp.push(extracLocation(n.pause?.location?.location))
                        }
                    }
                    console.log(i)
                    console.log(tmp)
                    markers.push(tmp.map(pos=>new amap.Marker({ position: new amap.LngLat(pos?pos[0]:0,pos?pos[1]:0)})))
                    paths.push(new amap.Polyline({
                        path:tmp,
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
