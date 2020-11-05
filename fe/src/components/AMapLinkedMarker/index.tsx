import React, { useCallback, useEffect, useState } from 'react'
import { AMapLngLat } from 'react-amap'
import { useDispatch } from 'react-redux'
import { ActSetState } from '../../lib/state/global'
import { useTypedSelector } from '../../lib/store'




interface IProps {
    __map__?: any
}


export default function AMapLinkedMarker({ __map__ }: IProps) {
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


        console.log("generaste")
        generateMarker()
        generateEdge()
    }, [vertexs])
    return (null)
}
